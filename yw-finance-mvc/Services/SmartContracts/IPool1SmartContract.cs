using System.Threading.Tasks;
using web_mvc.Services.SmartContracts.GenericFunctions;

namespace web_mvc.Services.SmartContracts
{
    public interface IPool1SmartContract
    {
        Task<bool> IsStakeholder(string address);

        Task<GetPoolInformationOutputDto> GetPoolInformation();
    }
}