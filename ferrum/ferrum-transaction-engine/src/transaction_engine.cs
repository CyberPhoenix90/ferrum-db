using ferrum_db_engine;

namespace ferrum_transaction_engine;

public class TransactionEngine
{
    private DatabaseEngine databaseEngine;
    public TransactionEngine(DatabaseEngine databaseEngine)
    {
        this.databaseEngine = databaseEngine;
    }
}
