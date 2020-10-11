using System.Numerics;
using Nethereum.ABI.FunctionEncoding.Attributes;
using Nethereum.Contracts;
using Nethereum.Util;

namespace web_mvc.Services.SmartContracts.ERC20.Functions
{
    [Function("approve", "bool")]
    public class ApproveFunction : FunctionMessage
    {
        [Parameter("address", "spender")]
        public string Spender { get; set; }
        [Parameter("uint256", "amount")]
        public BigInteger Amount { get; set; }
    }
}