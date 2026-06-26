using Serilog;

namespace Affiliate.SharedLibrary.Logs
{
    public static class LogException
    {
        public static void LogExceptions(Exception ex)
        {
            LogToFile(ex.Message);
            LogToConsole(ex.Message);
            LogToDebugger(ex, ex.Message);
        }
        public static void LogToFile(string message) => Log.Information(message);

        public static void LogToConsole(string message) => Log.Warning(message);

        public static void LogToDebugger(Exception ex, string message)
        {
            Log.Error(ex, "==> LỖI HỆ THỐNG: {Message}", message);
        }
    }
}
