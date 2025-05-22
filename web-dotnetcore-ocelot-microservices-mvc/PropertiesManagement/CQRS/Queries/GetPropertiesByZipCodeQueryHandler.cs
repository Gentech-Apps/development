using PropertiesManagement.CQRS.Models;
using PropertiesManagement.CQRS.Repositories.Interfaces;
namespace PropertiesManagement.CQRS.Queries
{
    public class GetPropertiesByZipCodeQueryHandler : IRequestHandler<GetPropertiesByZipCodeQuery, List<PropertiesModel>>
    {
        private readonly IPropertiesRepository _propertyRepository;

        public GetPropertiesByZipCodeQueryHandler(IPropertiesRepository propertyRepository)
        {
            _propertyRepository = propertyRepository;
        }

        public async Task<List<PropertiesModel>> Handle(GetPropertiesByZipCodeQuery request, CancellationToken cancellationToken)
        {
            var result = await _propertyRepository.GetPropertiesByZipCode(request.zipcode,request.street);
            return result;
        }
    }
}
