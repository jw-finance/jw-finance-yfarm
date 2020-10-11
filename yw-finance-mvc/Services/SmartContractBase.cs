using Nethereum.Contracts;
using Nethereum.Web3;

namespace web_mvc.Services
{
    public class SmartContractBase : ISmartContract
    {
        protected readonly IWeb3 Web3;
        protected readonly Contract Contract;

        public SmartContractBase(IWeb3 web3, string jsonAbi, string address)
        {
            Web3 = web3;
            Contract = web3.Eth.GetContract(jsonAbi, address);
        }
    }
}