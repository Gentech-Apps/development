using System.Text.Json.Serialization;
using UserManagement.DwollaOperations.Model.Response;

namespace UserManagement.DwollaOperations.Model.Request
{
    public class CreatePlaidFundingSourceRequest
    {
        [JsonPropertyName("_links")]
        public Dictionary<string, Link> Links { get; set; }
        public string Name { get; set; }
        public string PlaidToken { get; set; }
    }

}