using PropertiesManagement.CQRS.Models;

namespace PropertiesManagement.CQRS.Queries
{
    public class GetPropertiesByZipCodeQuery : IRequest<List<PropertiesModel>>
    {
        public string zipcode { get; set; }
        public string street { get; set; }
    }
}
