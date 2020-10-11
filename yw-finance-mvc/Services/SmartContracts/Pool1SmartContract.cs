using System;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Nethereum.Web3;
using web_mvc.Options;
using web_mvc.Services.SmartContracts.GenericFunctions;

namespace web_mvc.Services.SmartContracts
{
    public class Pool1SmartContract : IPool1SmartContract
    {
        private readonly ILogger<Pool1SmartContract> logger;
        private readonly IOptions<Pool1Settings> options;
        private readonly IWeb3 web3;

        public Pool1SmartContract
        (
            ILogger<Pool1SmartContract> logger,
            IOptions<Pool1Settings> options,
            IOptions<EthereumSettings> ethOptions
        )
        {
            this.logger = logger;
            this.options = options;
            web3 = new Web3(ethOptions.Value.InfuraUrl);
        }

        public async Task<bool> IsStakeholder(string address)
        {
            var pool1Settings = options.Value;
            var contract = web3.Eth.GetContract(pool1Settings.Abi, pool1Settings.ContractAddress);
            var function = contract.GetFunction("isStakeholder");

            try
            {
                var callResult = await function.CallDeserializingToObjectAsync<IsStakeholderOutputDTO>(address);
                return callResult.Exists;
            }
            catch (Exception e)
            {
                logger.LogError(e, "Can not call function to check stakeholder.");
                return false;
            }
        }

        public async Task<GetPoolInformationOutputDto> GetPoolInformation()
        {
            var pool1Settings = options.Value;
            var contract = web3.Eth.GetContract(pool1Settings.Abi, pool1Settings.ContractAddress);
            var function = contract.GetFunction("getPoolInformation");

            try
            {
                var callResult = await function.CallDeserializingToObjectAsync<GetPoolInformationOutputDto>();
                return callResult;
            }
            catch (Exception e)
            {
                logger.LogError(e, "Can not call function to get pool #1 information.");
                return new GetPoolInformationOutputDto();
            }
        }
    }
}