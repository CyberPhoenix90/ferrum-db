using System.Threading.Tasks;

namespace ferrum_query_engine;

public class Query
{
    public string query;
    public int? overrideMaxQueryTime;
    public int? overrideMaxQueryVMMemory;
    public string[] parameters;
    public bool debugMode;
    private TaskCompletionSource<QueryResult> taskCompletionSource;

    public Query(string query, string[] parameters, bool debugMode, TaskCompletionSource<QueryResult> taskCompletionSource, int? overrideMaxQueryTime = null, int? overrideMaxQueryVMMemory = null)
    {
        this.query = query;
        this.parameters = parameters;
        this.overrideMaxQueryTime = overrideMaxQueryTime;
        this.overrideMaxQueryVMMemory = overrideMaxQueryVMMemory;
        this.taskCompletionSource = taskCompletionSource;
        this.debugMode = debugMode;
    }

    public void Complete(QueryResult result)
    {
        taskCompletionSource.SetResult(result);
    }
}