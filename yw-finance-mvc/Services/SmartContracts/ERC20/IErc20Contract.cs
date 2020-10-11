using System.Threading.Tasks;

namespace web_mvc.Services.SmartContracts.ERC20
{
    public interface IErc20Contract
    {
        Task<bool> ApproveAsync
        (
            string contractAddress,
            string spender,
            decimal amount,
            int decimals
        );
    }
}