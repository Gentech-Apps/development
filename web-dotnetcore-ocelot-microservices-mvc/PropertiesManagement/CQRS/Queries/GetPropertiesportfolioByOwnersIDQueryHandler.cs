using PropertiesManagement.CQRS.Models;
using PropertiesManagement.CQRS.Repositories.Interfaces;
using PropertiesManagement.Database;

namespace PropertiesManagement.CQRS.Queries
{
    public class GetPropertiesPortfolioByOwnersIDQueryHandler : IRequestHandler<GetPropertiesPortfolioByOwnersIDQuery, List<PropertiesPortfolioModel>>
    {
        private readonly IPropertiesRepository _propertyRepository;

        public GetPropertiesPortfolioByOwnersIDQueryHandler(IPropertiesRepository propertyRepository)
        {
            _propertyRepository = propertyRepository;
        }

        public Task<List<PropertiesPortfolioModel>> Handle(GetPropertiesPortfolioByOwnersIDQuery request, CancellationToken cancellationToken)
        {
           return _propertyRepository.GetPropertiesPortfolioByOwnerId(request.ownerID, request.pageNumber, request.pageSize);

        }
    }
}
