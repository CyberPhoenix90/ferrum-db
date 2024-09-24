using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using ferrum_db_engine;
using ferrum_transaction_engine;

namespace ferrum_query_engine;

public class QueryEngine
{
    private DatabaseEngine databaseEngine;
    private TransactionEngine transactionEngine;

    public List<Query> pendingQueries = [];
    public List<ExecutionEngine> queryEngines = [];

    public delegate void onDebugMessageDelegate(int debugPort);

    public QueryEngine(DatabaseEngine databaseEngine, TransactionEngine transactionEngine, QueryEngineConfig config)
    {
        this.transactionEngine = transactionEngine;
        this.databaseEngine = databaseEngine;

        for (int i = 0; i < config.maxQueryVMs; i++)
        {
            queryEngines.Add(new ExecutionEngine(databaseEngine, transactionEngine, config));
        }
    }

    public async Task<QueryResult> SubmitQuery(string query, string[] parameters, bool debugMode,
    onDebugMessageDelegate onDebugMessage
    , int? overrideMaxQueryTime = null, int? overrideMaxQueryVMMemory = null)
    {
        var taskSource = new TaskCompletionSource<QueryResult>();
        Query q = new Query(query, parameters, debugMode, taskSource, overrideMaxQueryTime, overrideMaxQueryVMMemory);
        pendingQueries.Add(q);
        NextQuery();

        // Continue with the next query when the current one is done. This ensures that potentially pending queries are executed.
        taskSource.Task.ContinueWith(_ => NextQuery());

        return await taskSource.Task;
    }

    private void NextQuery()
    {
        Query? query = pendingQueries.FirstOrDefault();
        if (query != null)
        {
            ExecutionEngine? engine = GetAvailableEngine();
            if (engine != null)
            {
                engine.AssignAndExecuteQuery(query);
                pendingQueries.Remove(query);
            }
        }
    }

    private ExecutionEngine? GetAvailableEngine()
    {
        foreach (var engine in queryEngines)
        {
            if (!engine.isBusy)
            {
                return engine;
            }
        }

        return null;
    }
}
