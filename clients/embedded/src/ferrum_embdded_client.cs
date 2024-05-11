using ferrum_db_engine;
using ferrum_io_engine;

namespace embedded_client;

public class FerrumEmbeddedClient
{
    private DatabaseEngine engine;

    public FerrumEmbeddedClient(DatabaseEngineConfig config)
    {
        this.engine = new DatabaseEngine(config, new IOEngine());
    }

    public Database CreateDatabase(string name)
    {
        return this.engine.CreateDatabase(name);
    }

    public void DeleteDatabase(string name)
    {
        this.engine.DeleteDatabase(name);
    }

    public List<string> ListDatabases()
    {
        return this.engine.ListDatabases();
    }

    public bool HasDatabase(string name)
    {
        return this.engine.HasDatabase(name);
    }

    public Database GetDatabase(string name)
    {
        return this.engine.GetDatabase(name);
    }

}
