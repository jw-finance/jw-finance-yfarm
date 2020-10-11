using System;
using System.IO;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Hosting;
using Serilog;
using Serilog.Events;

namespace web_mvc
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var configuration = new ConfigurationBuilder()
                               .SetBasePath(AppContext.BaseDirectory)
                               .AddJsonFile("appsettings.json")
                               .AddJsonFile($"appsettings.{Environment}.json", true, true)
                               .AddEnvironmentVariables()
                               .Build();

            Log.Logger = new LoggerConfiguration()
                        .MinimumLevel.Information()
                        .MinimumLevel.Override("Microsoft", LogEventLevel.Information)
                        .MinimumLevel.Override("Microsoft.EntityFrameworkCore", LogEventLevel.Warning)
                        .Enrich.WithProperty(configuration["Logging:Application"], configuration["Logging:Application"])
                        .Enrich.FromLogContext()
                        .WriteTo.Console()
                        .WriteTo.File(configuration["Logging:FilePath"], rollingInterval: RollingInterval.Day)
                        .CreateLogger();

            try
            {
                Log.Information("Starting host...");
                CreateHostBuilder(args).Build().Run();
                Log.Information($"Started host at {DateTime.UtcNow}");
            }
            catch (Exception ex)
            {
                Log.Fatal(ex, "Host terminated unexpectedly.");
            }
            finally
            {
                Log.CloseAndFlush();
            }
        }

        public static IHostBuilder CreateHostBuilder(string[] args)
        {
            return Host.CreateDefaultBuilder(args)
                       .UseWindowsService()
                       .ConfigureWebHostDefaults(webBuilder =>
                        {
                            webBuilder.UseStartup<Startup>();
                            webBuilder.UseEnvironment(Environment);
                            if (Environment.Equals("Development"))
                            {
                                webBuilder.UseUrls("http://*:51917");
                            }
                            else
                            {
                                webBuilder.UseUrls("http://*:51918");
                            }
                        });
        }

        private static string Environment
        {
            get
            {
                var path = $"{AppContext.BaseDirectory}\\Environment.txt";

                if (File.Exists(path))
                {
                    return File.ReadAllText(path);
                }

                path = $"{Directory.GetCurrentDirectory()}\\Environment.txt";

                return !File.Exists(path) ? "Development" : File.ReadAllText(path);
            }
        }
    }
}