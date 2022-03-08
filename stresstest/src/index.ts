import { ChildProcess, spawn } from 'child_process';
import * as dummy from 'cluster';
import { rm } from 'fs/promises';
import { join } from 'path';
import { ferrumConnect } from '../../clients/nodejs';
//@ts-ignore
const cluster: typeof import('cluster').default = dummy;
let val = 'test string value';
for (let i = 0; i < 17; i++) {
    val += val;
}

async function stressTest(): Promise<void> {
    console.log('START');
    let client = await ferrumConnect('localhost', 3000);
    console.log('Client connected');

    let dbRemote = client.getDatabase('test');
    let testIndex = dbRemote.getIndex<{ a: number; b: string }>('test', 'bson', 'none');

    const promises = [];
    for (let i = 0; i < Math.random() * 1000 + 100; i++) {
        promises.push(testIndex.put(Math.random().toString().substring(0, 4), { a: 1, b: val }));
    }

    try {
        await Promise.all(promises);
    } catch (e) {
        console.error(`[ERROR] Failed to put ${promises.length} items: ${e}`);
        client.disconnect();
        process.exit();
    }

    for (let i = 0; i < Math.random() * 600 + 50; i++) {
        const key = Math.random().toString().substring(0, 4);
        try {
            if (await testIndex.has(key)) {
                await testIndex.get(key);
            }
        } catch (e) {
            console.error(`[ERROR] Failed to get ${key}: ${e}`);
            client.disconnect();
            process.exit();
        }
    }

    console.log('Stress test: OK.');
    client.disconnect();
    process.exit();
}

async function clearDatabase(): Promise<void> {
    const folder = join(__dirname, '../../ferrum-db-server/bin/Release/net6.0/linux-x64/db');
    try {
        await rm(folder, { recursive: true });
    } catch {}
}

async function startServer(): Promise<ChildProcess> {
    const cp = spawn(join(__dirname, '../../ferrum-db-server/bin/Release/net6.0/linux-x64/ferrum-db-server'), ['--loglevel', 'DEBUG', '--stdout'], {
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

if (cluster.isPrimary) {
    (async () => {
        await clearDatabase();
        let server = await startServer();
        let client = await ferrumConnect('localhost', 3000);
        const dbRemote = await client.createDatabase('test');
        await dbRemote.createIndex<{ a: number; b: string }>('test', 'bson', 'none');

        client.disconnect();

        let iterations = 500;
        for (let i = 0; i < 1; i++) {
            cluster.fork();
        }

        cluster.on('exit', (worker, code, signal) => {
            if (iterations % 100 === 0) {
                console.log(`[INFO] Iteration ${iterations}`);
            }

            if (--iterations === 0) {
                console.log('OVER');
                server.kill();
                process.exit();
            } else {
                cluster.fork();
            }
        });
    })();
} else {
    (async () => {
        await stressTest();
    })();
}
