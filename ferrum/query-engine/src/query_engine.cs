using System;
using System.Threading.Tasks;
using ferrum_db_engine;
using ferrum_transaction_engine;
using Microsoft.ClearScript;
using Microsoft.ClearScript.V8;

namespace ferrum_query_engine;

public class QueryEngine
{
    private DatabaseEngine databaseEngine;
    private TransactionEngine transactionEngine;

    public QueryEngine(DatabaseEngine databaseEngine, TransactionEngine transactionEngine)
    {
        this.transactionEngine = transactionEngine;
        this.databaseEngine = databaseEngine;
    }

    public async Task ExecuteQuery(string query)
    {
        using (var engine = new V8ScriptEngine(V8ScriptEngineFlags.EnableTaskPromiseConversion))
        {
            string javascriptCode = @"
function delay(milliseconds) {
    return new Promise((resolve) => {
        setTimeout(resolve, milliseconds);
    });
}

async function main() {
    console.log('Start');
    await delay(2000);
    console.log('1 second later');
    return 2;
}

 main();
";

            engine.AddHostObject("setTimeout", new Func<dynamic, int, Task>(async (callback, milliseconds) =>
            {
                await Task.Delay(milliseconds);
                await callback();
            }));

            engine.AddHostObject("console", new
            {
                log = new Action<object>(Console.WriteLine)
            });

            Console.WriteLine($"BEFORE");
            var stringResult = await (engine.Evaluate(javascriptCode) as Task<object>);
            Console.WriteLine($"AFTER");
            Console.WriteLine($"stringResult : {stringResult}");
        }
    }
}
