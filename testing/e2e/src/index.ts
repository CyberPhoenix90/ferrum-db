import { ChildProcess, spawn } from 'child_process';
import { join } from 'path/posix';
import { ferrumConnect } from '../../../clients/nodejs';
import * as assert from 'assert';
import { rm } from 'fs/promises';

//@ts-ignore
async function testKillCorruption(): Promise<void> {
    await clearDatabase();
    let server = await startServer();

    let client = await ferrumConnect('localhost', 3000);
    let dbRemote = await client.createDatabase('test');
    let index = await dbRemote.createIndex('test', 'json', 'gzip');

    const data = [];
    for (let i = 0; i < 10000; i++) {
        data.push({ a: 1, b: 'test string value' });
    }

    const promises = [];
    for (let i = 0; i < 100; i++) {
        promises.push(index.set(i.toString(), data));
    }

    await Promise.all(promises);
    client.disconnect();
    server.kill();

    server = await startServer();

    client = await ferrumConnect('localhost', 3000);
    dbRemote = client.getDatabase('test');
    index = dbRemote.getIndex('test', 'json', 'gzip');

    for (let i = 0; i < 100; i++) {
        const result = await index.get(i.toString());
        console.log(result);
    }
    console.log('Kill server and reopen corruption check: OK.');
    client.disconnect();
    server.kill();
}

async function testTimeSeries(): Promise<void> {
    await clearDatabase();

    let server = await startServer();
    let client = await ferrumConnect('localhost', 3000);

    let dbRemote = await client.createDatabase('test');
    console.log('Created Database');
    let series = await dbRemote.createTimeSeries<{ a: number; b: string }>('test', 'json', 'gzip');
    console.log('Created Series');

    await series.put('a.b', 10, { a: 0, b: 'test string value' });
    await series.put('a.b', 20, { a: 1, b: 'test string value' });
    await series.put('a.b', 40, { a: 2, b: 'test string value' });
    await series.put('a.c', 0, { a: 0, b: 'test string value' });
    await series.put('a.c', 0, { a: 1, b: 'test string value' });

    console.log('Inserted content');
    client.disconnect();
    server.kill();

    server = await startServer();
    client = await ferrumConnect('localhost', 3000);
    dbRemote = client.getDatabase('test');

    series = dbRemote.getTimeSeries<{ a: number; b: string }>('test', 'json', 'gzip');

    const entriesA = await series.getEntriesBetween('a.b', 0, 100);

    assert.equal(entriesA.length, 3);
    assert.equal(entriesA[0].a, 0);
    assert.equal(entriesA[1].a, 1);
    assert.equal(entriesA[2].a, 2);

    const entriesB = await series.getLastNEntries('a.b', 2);

    assert.equal(entriesB.length, 2);
    assert.equal(entriesB[0].a, 1);
    assert.equal(entriesB[1].a, 2);

    const entriesC = await series.getEntry('a.c', 0);

    assert.equal(entriesC.a, 1);

    const entriesD = await series.getLastEntry('a.b');

    assert.equal(entriesD.a, 2);

    const entriesE = await series.getNearestEntryToTimestamp('a.b', 31);

    assert.equal(entriesE.a, 2);

    const entriesF = await series.getFirstEntryBeforeTimestamp('a.b', 39);

    assert.equal(entriesF.a, 1);

    const entriesG = await series.getFirstEntryAfterTimestamp('a.b', 21);

    assert.equal(entriesG.a, 2);

    const entriesH = await series.getFullSerieEntries('a.c');

    assert.equal(entriesH.length, 1);
    assert.equal(entriesH[0].a, 1);

    const entriesI = await series.getFullSerieEntries('a.b');

    assert.equal(entriesI.length, 3);
    assert.equal(entriesI[0].a, 0);
    assert.equal(entriesI[1].a, 1);
    assert.equal(entriesI[2].a, 2);

    await series.deleteEntry('a.b', 10);
    await series.deleteEntry('a.b', 40);
    await series.deleteEntry('a.b', 20);

    const entriesJ = await series.getFullSerieEntries('a.b');

    assert.equal(entriesJ.length, 0);

    console.log('Time series test: OK.');

    client.disconnect();
    server.kill();
}

function sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

async function clearDatabase(): Promise<void> {
    const folder = join(__dirname, '../../../ferrum-db-server/bin/Debug/net6.0/linux-x64/db');
    try {
        await rm(folder, { recursive: true });
    } catch {}
}

async function startServer(): Promise<ChildProcess> {
    const cp = spawn(join(__dirname, '../../../ferrum-db-server/bin/Debug/net6.0/linux-x64/ferrum-db-server'), [], {
        cwd: join(__dirname, '../../../ferrum-db-server/bin/Debug/net6.0/linux-x64/'),
    });

    cp.stdout.on('data', (msg) => {
        console.log(`[Server]${msg.toString().trim()}`);
    });

    await sleep(2000);

    return cp;
}

async function testTags(): Promise<void> {
    await clearDatabase();

    let server = await startServer();
    let client = await ferrumConnect('localhost', 3000);

    let dbRemote = await client.createDatabase('test');
    console.log('Created Database');

    const index = await dbRemote.createIndex('test');
    let tags = await index.getTags();

    assert.equal(tags.length, 0);
    assert.equal(await index.hasTag('tag1'), false);

    await index.setTag('tag1', 'value1');

    const tag = await index.getTagEntry('tag1');

    tags = await index.getTags();
    assert.equal(tags.length, 1);
    assert.equal(tag, 'value1');

    assert.equal(await index.hasTag('tag1'), true);

    await index.deleteTag('tag1');

    assert.equal(await index.hasTag('tag1'), false);

    console.log('Tag test: OK.');

    client.disconnect();
    server.kill();
}

async function clearTest(): Promise<void> {
    await clearDatabase();

    let server = await startServer();
    let client = await ferrumConnect('localhost', 3000);

    let dbRemote = await client.createDatabase('test');
    console.log('Created Database');

    const index = await dbRemote.createIndex('test');
    await index.set('key1', 'value1');

    assert.equal(await index.has('key1'), true);

    await index.clear();

    assert.equal(await index.has('key1'), false);

    await index.set('key1', 'value1');

    assert.equal(await index.has('key1'), true);

    console.log('Clear test: OK.');

    client.disconnect();
    server.kill();
}
(async () => {
    await testKillCorruption();
    await testTimeSeries();
    await testTags();
    await clearTest();
})();
