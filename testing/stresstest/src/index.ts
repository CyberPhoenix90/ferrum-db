import { ChildProcess, spawn, spawnSync } from 'child_process';
import * as dummy from 'cluster';
import { rm } from 'fs/promises';
import { join } from 'path';
import { ferrumConnect } from '../../../clients/nodejs';

const WORKERS = 4;
const WORK_ITEMS = 1000;
const ITEM_SIZE = 1024 * 1024;
const BATCH_SIZE = 100;
const ROUNDS = 2;
const LOOPS = 4;

//@ts-ignore
const cluster: typeof import('cluster').default = dummy;

async function stressTest(): Promise<void> {
    console.log('WORKER START');
    let client = await ferrumConnect('localhost', 3001);
    console.log('Client connected');

    let dbRemote = await client.getDatabase('test');
    let testIndex = dbRemote.getIndex<{ payload: string }>('test', 'json', 'gzip');

    for (let i = 0; i < LOOPS; i++) {
        await testIndex.clear();

        let payload = '';
        for (let i = 0; i < ITEM_SIZE; i++) {
            payload += String.fromCharCode(Math.floor(Math.random() * 26) + 97);
        }

        const item = { payload };
        const batch = [];

        for (let i = 0; i < WORK_ITEMS; i++) {
            try {
                batch.push(testIndex.put(Math.random().toString().substring(0, 4), item));
                if (batch.length >= BATCH_SIZE) {
                    await Promise.all(batch);
                    console.log(`[Worker ${process.pid}] Put ${i + 1} items`);
                    batch.length = 0;
                }
            } catch (e) {
                console.error(`[ERROR] Failed to put item: ${e.stack}`);
                client.disconnect();
                process.exit();
            }
        }
    }

    console.log('Stress test: OK.');
    client.disconnect();
    process.exit();
}

async function clearDatabase(): Promise<void> {
    const folder = join(__dirname, '../../../ferrum-db-server/bin/Debug/net8.0/db');
    try {
        await rm(folder, { recursive: true });
    } catch {}
}

async function startServer(): Promise<ChildProcess> {
    const cp = spawn('./ferrum-db-server', ['--loglevel', 'DEBUG', '--stdout'], {
        cwd: join(__dirname, '../../../ferrum-db-server/bin/Debug/net8.0/'),
        stdio: 'inherit',
    });

    await sleep(2000);

    return cp;
}

function sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

if (cluster.isPrimary) {
    (async () => {
        spawnSync('pkill', ['-9', 'ferrum-db-server']);
        await clearDatabase();
        let server = await startServer();
        let client = await ferrumConnect('localhost', 3001);
        client.onTimeout.subscribe(() => {
            console.log('DB Timeout');
        });
        console.log('Connected');
        const dbRemote = await client.createDatabase('test');
        console.log('DB created');
        await dbRemote.createIndex<{ payload: string }>('test', 'json', 'gzip');

        client.disconnect();
        console.log('Server started');

        let iterations = ROUNDS;
        for (let i = 0; i < WORKERS; i++) {
            console.log('FORK');
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
