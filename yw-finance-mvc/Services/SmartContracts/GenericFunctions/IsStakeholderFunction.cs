using System.Numerics;
using Nethereum.ABI.FunctionEncoding.Attributes;
using Nethereum.Contracts;

namespace web_mvc.Services.SmartContracts.GenericFunctions
{
    [Function("isStakeholder")]
    public class IsStakeholderFunction : FunctionMessage
    {
        [Parameter("address", "_address")] 
        public string Address { get; set; }
    }

    [FunctionOutput]
    public class IsStakeholderOutputDTO : IFunctionOutputDTO
    {
        [Parameter("bool", "exists_", 1)] 
        public virtual bool Exists { get; set; }

        [Parameter("uint256", "index_", 2)] 
        public virtual BigInteger Index { get; set; }
    }
}