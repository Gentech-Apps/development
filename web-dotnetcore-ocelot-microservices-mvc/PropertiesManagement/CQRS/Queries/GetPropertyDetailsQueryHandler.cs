using PropertiesManagement.CQRS.Models;
using PropertiesManagement.CQRS.Repositories.Interfaces;

namespace PropertiesManagement.CQRS.Queries
{
    public class GetPropertyDetailsQueryHandler : IRequestHandler<GetPropertyDetailsQuery, PropertiesPortfolioModel>
    {
        private readonly IPropertiesRepository _propertiesRepository;

        public GetPropertyDetailsQueryHandler(IPropertiesRepository propertiesRepository)
        {
            _propertiesRepository = propertiesRepository;
        }
        public Task<PropertiesPortfolioModel> Handle(GetPropertyDetailsQuery request, CancellationToken cancellationToken)
        {
            return _propertiesRepository.GetPropertyDetails(request.ownerId,request.propertyId);
        }
    }
}
