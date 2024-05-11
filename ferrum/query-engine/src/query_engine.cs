using ferrum_db_engine;
using ferrum_transaction_engine;

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
}
