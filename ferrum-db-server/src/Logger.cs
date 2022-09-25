using System;
using System.IO;
using System.Threading;

namespace ferrum_db_server.src {

    public enum LogLevel {
        DEBUG,
        INFO,
        WARN,
        ERROR,
    }

    public class Logger {

        public static LogLevel logLevel;
        public static bool stdOut;

        private static string _fileOut = "";

        private static object _lock = new object();
        public static string fileOut {
            get {
                return _fileOut;
            }
            set {
                _fileOut = value;

                if (logFileWriter != null) {
                    logFileWriter.Close();
                    logFileWriter = null;
                }

                if (_fileOut != "") {
                    logFileWriter = new StreamWriter(File.Open(value, FileMode.Append));
                }
            }
        }

        private static StreamWriter? logFileWriter;

        public static void Log(string message, LogLevel loglevel) {
            if (CanLog(logLevel)) {
                lock (_lock) {
                    if (stdOut) {
                        Console.WriteLine(message);
                    }
                    if (logFileWriter != null) {
                        logFileWriter.WriteLine($"[{DateTime.Now.ToString("HH:mm:ss")}][{Thread.CurrentThread.Name}]{message}");
                        logFileWriter.Flush();
                    }
                }
            }
        }

        public static bool CanLog(LogLevel requestedLogLevel) {
            return requestedLogLevel >= logLevel;
        }

        public static void Info(string message) {
            Log(message, LogLevel.INFO);
        }

        public static void Error(string message) {
            Log(message, LogLevel.ERROR);
        }

        public static void Error(string message, Exception e) {
            Log(message + ": " + e.Message, LogLevel.ERROR);
        }

        public static void Debug(string message) {
            Log(message, LogLevel.DEBUG);
        }

        public static void Warn(string message) {
            Log(message, LogLevel.WARN);
        }
    }
}