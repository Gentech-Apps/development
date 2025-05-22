using PropertiesManagement.CQRS.Models;
using PropertiesManagement.CQRS.Repositories.Interfaces;
using PropertiesManagement.Database;

namespace PropertiesManagement.CQRS.Queries
{
    public class GetTenantDashboardQueryHandler : IRequestHandler<GetTenantDashboardQuery, PropertiesPortfolioModel>
    {
        public readonly IPropertiesRepository _propertiesRepository;
        public GetTenantDashboardQueryHandler(IPropertiesRepository propertiesRepository) {
            _propertiesRepository= propertiesRepository;
        }

        public async Task<PropertiesPortfolioModel> Handle(GetTenantDashboardQuery request, CancellationToken cancellationToken)
        {
            Properties data = await _propertiesRepository.GetPropertyIdAndOwnerIdByTenantId(request.TenantID);
            if(data == null)
            {
                return null;
            }
            else
            {
                return await _propertiesRepository.GetPropertyDetailsByTenantId(request.TenantID,data.OwnerId.ToString(), data.PropertyId.ToString());
            }
        }
    }
}
