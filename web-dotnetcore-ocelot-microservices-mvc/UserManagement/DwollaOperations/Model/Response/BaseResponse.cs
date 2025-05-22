using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace UserManagement.DwollaOperations.Model.Response
{
    /// <summary>
    ///     Implemented by any model returned by DwollaClient
    /// </summary>
    public interface IDwollaResponse
    {
    }

    public abstract class BaseResponse : IDwollaResponse
    {
        [JsonPropertyName("_links")]
        public Dictionary<string, Link> Links { get; set; }
    }
}