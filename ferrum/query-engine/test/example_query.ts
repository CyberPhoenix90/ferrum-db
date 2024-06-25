import { api, ResponseCode } from 'ferrum-query-api';
interface LogModel {}

export async function renameUser(parameters: { userId: string; newName: string }): Promise<{ code: ResponseCode; data: void }> {
    const testDb = await api.getDatabase('test-db');
    const collection = await testDb.getCollection('users');
    const user = await collection.get(parameters.userId);
    if (!user) {
        return {
            code: ResponseCode.NOT_FOUND,
            data: undefined,
        };
    }

    // All changes made in javascript are transient
    user.name = parameters.newName;

    // Transactions allow atomic updates to any number of collections and databases but are not mandatory. Updating without transaction will quickly lock write and unlock a collection for each write which is slower and in case of multiple consecutive writes can lead to inconsistent data.
    await api.transaction(async (tx) => {
        // Transactions don't actually lock the collection until the commit. Changes are written to a scratch space that is copied to the actual collection on commit
        await tx.write(collection, parameters.userId, user);
        // Transactions commits automatically if no errors are thrown and rolls back if an error is thrown
        // Transactions can run concurrently but only one transaction can write to a collection at a time and in case multiple transactions try to write to the same collection the writes are ordered by the time the transaction was committed
    });

    return {
        code: ResponseCode.OK,
        data: undefined,
    };
}

interface LogGroupMetaData {
    name: string;
    startTimestamp: number;
    endTimestamp?: number;
}

export async function getLogGroupMetaData(parameters: {
    logDocumentId: string;
    breakdownId: string;
}): Promise<{ code: ResponseCode; data?: LogGroupMetaData[] }> {
    const testDb = await api.getDatabase('job-database');
    const logDocument = await testDb.getCollection(parameters.logDocumentId);

    if (!logDocument) {
        return {
            code: ResponseCode.NOT_FOUND,
            data: undefined,
        };
    }

    const logs = await logDocument.get(parameters.breakdownId);

    const logGroupMetaData: LogGroupMetaData[] = [];
    const logGroupStack: number[] = [];

    for await (const logLine of logs.iterateNDJSON()) {
        if (logLine.group === 'start') {
            logGroupStack.push(logGroupMetaData.length);
            logGroupMetaData.push({
                name: logLine.name,
                startTimestamp: logLine.timestamp,
                endTimestamp: undefined,
            });
        } else if (logLine.group === 'end') {
            const logGroupIndex = logGroupStack.pop();
            if (logGroupIndex === undefined) {
                throw new Error('Log group stack underflow');
            }
            logGroupMetaData[logGroupIndex].endTimestamp = logLine.timestamp;
        }
    }

    return {
        code: ResponseCode.OK,
        data: logGroupMetaData,
    };
}

export async function streamLogsToDatabase(parameters: {
    logDocumentId: string;
    breakdownId: string;
    logStream: Generator<LogModel>;
}): Promise<{ code: ResponseCode; data: void }> {
    const testDb = await api.getDatabase('job-database');
    const logDocument = await testDb.getCollection(parameters.logDocumentId);

    if (!logDocument) {
        return {
            code: ResponseCode.NOT_FOUND,
            data: undefined,
        };
    }

    const logs = await logDocument.get(parameters.breakdownId);

    // This keeps an active connection to the database and writes to it as the logStream yields new logs
    // This isn't using a transaction so it will lock the collection for each write and in case of interruptions will not roll back the writes
    // This would work with a transaction as well but the transaction would be open for the entire duration of the logStream and will write to a temporary scratch space until the transaction is committed
    for (const logLines of api.batchStream(parameters.logStream, 1000)) {
        await logs.appendWriteNDJSON(logLines);
    }

    return {
        code: ResponseCode.OK,
        data: undefined,
    };
}
