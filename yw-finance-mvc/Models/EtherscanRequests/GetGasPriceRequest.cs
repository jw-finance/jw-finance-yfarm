using System;
using RestSharp;

namespace web_mvc.Models.EtherscanRequests
{
    public class GetGasPriceRequest : RestRequest
    {
        public GetGasPriceRequest
        (
            Uri resource,
            Method method,
            string apiToken
        ) : base(resource, method)
        {
            Parameters.Add(new Parameter("module", "gastracker", ParameterType.QueryString));
            Parameters.Add(new Parameter("action", "gasoracle", ParameterType.QueryString));
            Parameters.Add(new Parameter("apikey", apiToken, ParameterType.QueryString));
        }
    }
}