using PropertiesManagement.CQRS.Models;

namespace PropertiesManagement.CQRS.Queries
{
    public class GetPropertiesAggregationQuery : IRequest<PropertiesAggregationModel>
    {
        public string OwnerId { get; set; }
    }
}
