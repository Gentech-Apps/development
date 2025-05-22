using PropertiesManagement.CQRS.Models;
using PropertiesManagement.Database;

namespace PropertiesManagement.CQRS.Repositories.Interfaces
{
    public interface ITenantPropAssocRepository
    {
        Task<TenantPropAssoc> AddTenantAsync(TenantPropAssoc tenantPropAssoc);
    }
}