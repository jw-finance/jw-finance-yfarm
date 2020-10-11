using System;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Nethereum.Web3;
using web_mvc.Options;
using web_mvc.Services.SmartContracts.ERC20.Functions;

namespace web_mvc.Services.SmartContracts.ERC20
{
    public class Erc20Contract : IErc20Contract
    {
        private readonly IWeb3 web3;
        private readonly ILogger<Erc20Contract> logger;

        public Erc20Contract(ILogger<Erc20Contract> logger, IOptions<EthereumSettings> ethOptions, IOptions<Pool1Settings> pool1Options)
        {
            web3 = new Web3(ethOptions.Value.InfuraUrl);
            this.logger = logger;
        }

        public async Task<bool> ApproveAsync
        (
            string contractAddress,
            string spender,
            decimal amount,
            int decimals
        )
        {
            var functionHandler = web3.Eth.GetContractTransactionHandler<ApproveFunction>();
            var function = new ApproveFunction
            {
                Amount = Web3.Convert.ToWei(amount, decimals),
                Spender = spender
            };

            try
            {
                var transactionReceipt = await functionHandler.SendRequestAndWaitForReceiptAsync(contractAddress, function);
                logger.LogInformation($"Approve spender {spender} to use {function.Amount} at block {transactionReceipt.BlockNumber} with transaction hash {transactionReceipt.BlockHash}");
                return true;
            }
            catch (Exception e)
            {
                logger.LogError(e, "Can not call function to distribute rewards.");
                return false;
            }
        }
    }
}