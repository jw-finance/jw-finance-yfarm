using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using web_mvc.Services;

namespace web_mvc.Controllers
{
    [ApiController]
    [Route("api/network")]
    public class NetworkController : Controller
    {
        private readonly IEthereumService ethereumService;

        public NetworkController(IEthereumService ethereumService)
        {
            this.ethereumService = ethereumService;
        }

        [HttpGet("gas-price")]
        public async Task<IActionResult> GetCurrentGasPrice()
        {
            return Ok(await ethereumService.GetGasPriceGweiAsync());
        }
    }
}