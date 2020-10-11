using System.Threading.Tasks;
using web_mvc.Models.EtherscanRequests;

namespace web_mvc.Services
{
    public interface IEthereumService
    {
        Task<GasPrice> GetGasPriceGweiAsync();
    }
}