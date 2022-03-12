import { ChildProcess, spawn } from 'child_process';
import { Session } from 'inspector';
import { rm } from 'fs/promises';
import { join } from 'path';
import { ferrumConnect, IndexRemote } from '../../clients/nodejs';
import { writeFileSync } from 'fs';

const session = new Session();
session.connect();

let val = 'test string value';

async function benchmark(indexRemote: IndexRemote<{ a: number; b: string }>): Promise<void> {
    const start = Date.now();

    const promises = [];
    for (let i = 0; i < 10000; i++) {
        promises.push(indexRemote.put(i.toString(), { a: 1, b: val }));
    }

    try {
        await Promise.all(promises);
    } catch (e) {
        console.error(`[ERROR] Failed to put ${promises.length} items: ${e}`);
        return;
    }

    const end = Date.now();

    console.log(`[Benchmark] Put ${promises.length} items in ${end - start} ms`);
}

//@ts-ignore
async function clearDatabase(): Promise<void> {
    const folder = join(__dirname, '../../ferrum-db-server/bin/Release/net6.0/linux-x64/db');
    try {
        await rm(folder, { recursive: true });
    } catch {}
}

//@ts-ignore
async function startServer(): Promise<ChildProcess> {
    const cp = spawn(join(__dirname, '../../ferrum-db-server/bin/Release/net6.0/linux-x64/ferrum-db-server'), ['--loglevel', 'WARN', '--stdout'], {
        cwd: join(__dirname, '../../ferrum-db-server/bin/Release/net6.0/linux-x64/'),
    });

    cp.stdout.on('data', (msg) => {
        console.log(`[Server]${msg.toString().trim()}`);
    });

    await sleep(1000);

    return cp;
}

function sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

(async () => {
    // await clearDatabase();
    // let server = await startServer();
    let client = await ferrumConnect('localhost', 3000);
    const dbRemote = await client.createDatabase('test');
    const bsonIndexRemote = await dbRemote.createIndex<{ a: number; b: string }>('test', 'bson', 'none');
    const jsonIndexRemote = await dbRemote.createIndex<{ a: number; b: string }>('test2', 'json', 'none');

    session.post('Profiler.enable', () => {
        session.post('Profiler.start', async () => {
            // Invoke business logic under measurement here...

            await benchmark(bsonIndexRemote);
            await benchmark(jsonIndexRemote);

            // some time later...
            session.post('Profiler.stop', (err, { profile }) => {
                // Write profile to disk, upload, etc.
                if (!err) {
                    writeFileSync('./profile.cpuprofile', JSON.stringify(profile));
                }
                client.disconnect();
                // server.kill();
                process.exit();
            });
        });
    });
})();
