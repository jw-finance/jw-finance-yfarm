namespace web_mvc.Models.EtherscanRequests
{
    public class GetGasPriceRequestResult
    {
        public GasPrice Result { get; set; }
    }

    public class GasPrice
    {
        public string LastBlock { get; set; }
        public decimal SafeGasPrice { get; set; }
        public decimal ProposeGasPrice { get; set; }
        public decimal FastGasPrice { get; set; }
    }
}