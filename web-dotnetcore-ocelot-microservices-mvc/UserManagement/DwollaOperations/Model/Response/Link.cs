using System;
using System.Text.Json.Serialization;

namespace UserManagement.DwollaOperations.Model.Response
{
    public class Link
    {
        public Uri Href { get; set; }
        public string Type { get; set; }

        [JsonPropertyName("resource-type")]
        public string ResourceType { get; set; }
    }
}