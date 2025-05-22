using PropertiesManagement.CQRS.Models;
using PropertiesManagement.CQRS.Repositories.Interfaces;

namespace PropertiesManagement.CQRS.Queries
{
    public class GetPropertiesAggregationQueryHandler : IRequestHandler<GetPropertiesAggregationQuery,PropertiesAggregationModel>
    {
        private readonly IPropertiesRepository _propertyRepository;
        public GetPropertiesAggregationQueryHandler(IPropertiesRepository propertyRepository)
        {
            _propertyRepository = propertyRepository;
        }

        public Task<PropertiesAggregationModel> Handle(GetPropertiesAggregationQuery request, CancellationToken cancellationToken)
        {
            return _propertyRepository.GetPropertiesAggregationByOwnerId(request.OwnerId);
        }
    }
}
