using Microsoft.ClearScript;
using Microsoft.ClearScript.V8;

public record NeonEngineConfiguration
{
    /**
    * The maximum amount of time the engine will wait for a script to finish executing before killing it
    */
    public int? blockingScriptTimeout { get; init; }
    public int? executionTimeLimit { get; init; }
    public int? maxOldSpaceSize { get; init; }
    public int? maxYoungSpaceSize { get; init; }
    public SandboxConfiguration? sandboxConfig { get; init; }
    public string? jsxFactory { get; init; }
    public string? jsxFragmentFactory { get; init; }
}

public record SandboxConfiguration
{
    public bool? allowImportJs { get; init; }
    public bool? allowImportJson { get; init; }
    public Func<string, bool>? canAccess { get; init; }


    public class NeonEngine
    {
        private NeonEngineConfiguration configurations;

        NeonEngine(NeonEngineConfiguration config)
        {
            this.configurations = config;
        }


        public async Task<object?> ExecuteScript(string script, CancellationToken cancellationToken)
        {
            using var engine = new V8ScriptEngine(V8ScriptEngineFlags.EnableTaskPromiseConversion);
            DefineSetTimeout(engine, cancellationToken);
            DefineSetInterval(engine, cancellationToken);
            RegisterConsoleMethods(engine);

            cancellationToken.Register(() =>
            {
                engine.Dispose();
            });

            if (await Task.Run(() => engine.Evaluate(script, File.ReadAllText(script))) is Task<object> result)
            {
                return await result;
            }
            else
            {
                return null;
            }
        }
    }

    private static void RegisterConsoleMethods(V8ScriptEngine engine)
    {
        engine.AddHostObject("console", new
        {
            log = new Action<object>(Console.WriteLine),
            error = new Action<object>(Console.Error.WriteLine),
            debug = new Action<object>(Console.WriteLine),
            info = new Action<object>(Console.WriteLine),
            warn = new Action<object>(Console.WriteLine),
            trace = new Action<object>(Console.WriteLine),
            dir = new Action<object>(Console.WriteLine),
        });
    }

    private static void DefineSetInterval(V8ScriptEngine engine, CancellationToken cancellationToken)
    {
        var setIntervalIds = new HashSet<int>();
        var nextIntervalId = 0;
        engine.AddHostObject("setInterval", new Func<Action, int, Task>(async (callback, milliseconds) =>
        {
            var id = nextIntervalId++;
            setIntervalIds.Add(id);
            while (true)
            {
                if (cancellationToken.IsCancellationRequested)
                {
                    return;
                }
                await Task.Delay(milliseconds);
                if (cancellationToken.IsCancellationRequested)
                {
                    return;
                }
                if (setIntervalIds.Contains(id))
                {
                    callback();
                }
                else
                {
                    break;
                }
            }
        }));
    }

    private static void DefineSetTimeout(V8ScriptEngine engine, CancellationToken cancellationToken)
    {
        var setTimeoutIds = new HashSet<int>();
        var nextTimeoutId = 0;
        engine.AddHostObject("setTimeout", new Func<Action, int, Task>(async (callback, milliseconds) =>
        {
            var id = nextTimeoutId++;
            setTimeoutIds.Add(id);
            if (cancellationToken.IsCancellationRequested)
            {
                return;
            }
            await Task.Delay(milliseconds);
            if (cancellationToken.IsCancellationRequested)
            {
                return;
            }
            if (setTimeoutIds.Contains(id))
            {
                setTimeoutIds.Remove(id);
                callback();
            }
        }));
    }
}
}