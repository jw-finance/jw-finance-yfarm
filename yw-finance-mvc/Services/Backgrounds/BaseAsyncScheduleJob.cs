using System;
using System.Threading.Tasks;
using FluentScheduler;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;

namespace web_mvc.Services.Backgrounds
{
    public abstract class BaseAsyncScheduleJob : IJob
    {
        /// <summary>
        ///     The service provider
        /// </summary>
        protected readonly IServiceProvider ServiceProvider;

        /// <summary>
        ///     The logger
        /// </summary>
        protected readonly ILogger<BaseAsyncScheduleJob> Logger;

        /// <summary>
        ///     Initializes a new instance of the <see cref="BaseAsyncScheduleJob" /> class.
        /// </summary>
        /// <param name="serviceProvider">The service provider.</param>
        protected BaseAsyncScheduleJob(IServiceProvider serviceProvider)
        {
            ServiceProvider = serviceProvider;
            Logger = ServiceProvider.GetService<ILogger<BaseAsyncScheduleJob>>();
        }


        /// <summary>
        ///     Executes the job.
        /// </summary>
        public void Execute()
        {
            Task.Run(async () =>
            {
                try
                {
                    // run main logic code
                    Logger.LogInformation("Run schedule job ...");
                    await RunAsync();
                }
                catch (Exception e)
                {
                    Logger.LogError(e, "Error when run the cache refresh scheduler.");
                }
            });
        }

        protected abstract Task RunAsync();
    }
}