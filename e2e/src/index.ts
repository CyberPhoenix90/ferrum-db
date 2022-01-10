import { spawn } from 'child_process';
import { join } from 'path/posix';
import { ferrumConnect } from '../../clients/nodejs';

let server = spawn(join(__dirname, '../../ferrum-db-server/bin/Release/net6.0/linux-x64/ferrum-db-server'), [], {
    cwd: join(__dirname, '../../ferrum-db-server/bin/Release/net6.0/linux-x64/'),
    stdio: 'inherit',
});

setTimeout(async () => {
    const client = await ferrumConnect('localhost', 3000);
    const dbRemote = await client.createDatabase('test');
    const index = await dbRemote.createIndex('test', 'json', 'gzip');

    const data = [];
    for (let i = 0; i < 1000; i++) {
        data.push({ a: 1, b: 'test string value' });
    }

    const promises = [];
    for (let i = 0; i < 100; i++) {
        promises.push(index.set(i.toString(), data));
    }

    await Promise.all(promises);
    client.disconnect();
    server.kill();

    server = spawn(join(__dirname, '../../ferrum-db-server/bin/Release/net6.0/linux-x64/ferrum-db-server'), [], {
        cwd: join(__dirname, '../../ferrum-db-server/bin/Release/net6.0/linux-x64/'),
        stdio: 'inherit',
    });

    setTimeout(async () => {
        const client = await ferrumConnect('localhost', 3000);
        const dbRemote = client.getDatabase('test');
        const index = dbRemote.getIndex('test', 'json', 'gzip');

        for (let i = 0; i < 100; i++) {
            const result = await index.get(i.toString());
            console.log(result);
        }
        server.kill();
    }, 10000);
}, 3000);
