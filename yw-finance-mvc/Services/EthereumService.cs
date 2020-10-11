using System;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using RestSharp;
using web_mvc.Models.EtherscanRequests;
using web_mvc.Options;

namespace web_mvc.Services
{
    public class EthereumService : IEthereumService
    {
        private readonly ILogger<EthereumService> logger;
        private readonly EthereumSettings ethereumSettings;
        private readonly IRestClient restClient;

        public EthereumService
        (
            ILogger<EthereumService> logger,
            IOptions<EthereumSettings> options,
            IRestClient restClient
        )
        {
            this.logger = logger;
            ethereumSettings = options.Value;
            this.restClient = restClient;
        }

        public async Task<GasPrice> GetGasPriceGweiAsync()
        {
            var resource = new Uri($"{ethereumSettings.EtherScanUrl}/api");
            var request = new GetGasPriceRequest(resource, Method.GET, ethereumSettings.EtherScanApiKey);
            try
            {
                var getPriceResult = await restClient.GetAsync<GetGasPriceRequestResult>(request);
                return getPriceResult?.Result;
            }
            catch (Exception e)
            {
                logger.LogError(e, "Error when get current gas price gwei. Use default 100 gwei.");
                return new GasPrice
                {
                    FastGasPrice = 100,
                    LastBlock = "0x0",
                    ProposeGasPrice = 100,
                    SafeGasPrice = 100
                };
            }
        }
    }
}