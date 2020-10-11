using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Nethereum.Web3;
using RestSharp;
using Serilog;
using web_mvc.Models.Pools;
using web_mvc.Options;
using web_mvc.Services;
using web_mvc.Services.SmartContracts.ERC20;

namespace web_mvc
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddRouting(options => options.LowercaseUrls = true);
            services.AddLogging(configure => configure.AddSerilog());
            services.Configure<AppSettings>(Configuration.GetSection("AppSettings"));
            services.Configure<Pool1Settings>(Configuration.GetSection("Pool1Settings"));
            services.Configure<EthereumSettings>(Configuration.GetSection("EthereumSettings"));
            //services.Configure<StakeFarm>(Configuration.GetSection("StakeFarm"));
            services.AddSingleton(typeof(IWeb3),
                                  provider =>
                                  {
                                      var infuraUrl = Configuration["EthereumSettings:InfuraUrl"];
                                      return new Web3(infuraUrl);
                                  });

            services.AddSingleton(typeof(IRestClient), provider => new RestClient());
            services.AddTransient<IErc20Contract, Erc20Contract>();
            services.AddTransient<IEthereumService, EthereumService>();
            services.AddControllersWithViews();
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }
            else
            {
                app.UseExceptionHandler("/Home/Error");
                // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
                app.UseHsts();
            }

            app.UseHttpsRedirection();
            app.UseStaticFiles();

            app.UseRouting();

            app.UseAuthorization();

            app.UseEndpoints(endpoints => { endpoints.MapControllerRoute("default", "{controller=Home}/{action=Index}/{id?}"); });
        }
    }
}