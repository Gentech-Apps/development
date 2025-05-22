using PropertiesManagement.CQRS.Repositories.Interfaces;
using PropertiesManagement.Database;

namespace PropertiesManagement.CQRS.Queries
{
    public class GetPropertiesByOwnersIDQueryHandler : IRequestHandler<GetPropertiesByOwnersIDQuery, List<Properties>>
    {
        private readonly IPropertiesRepository _propertyRepository;

        public GetPropertiesByOwnersIDQueryHandler(IPropertiesRepository propertyRepository)
        {
            _propertyRepository = propertyRepository;
        }

        public async Task<List<Properties>> Handle(GetPropertiesByOwnersIDQuery request, CancellationToken cancellationToken)
        {
            List<Properties> result = await _propertyRepository.GetPropertiesByOwnerId(request.ownerID);
            return result;
        }
    }
}
