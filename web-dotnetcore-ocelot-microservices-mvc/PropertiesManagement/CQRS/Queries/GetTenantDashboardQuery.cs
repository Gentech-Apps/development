using PropertiesManagement.CQRS.Models;

namespace PropertiesManagement.CQRS.Queries
{
    public class GetTenantDashboardQuery :  IRequest<PropertiesPortfolioModel>
    {
        public string TenantID { get; set; }
    }
}
