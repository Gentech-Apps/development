using PropertiesManagement.CQRS.Models;
using PropertiesManagement.CQRS.Repositories.Interfaces;
using PropertiesManagement.Database;

namespace PropertiesManagement.CQRS.Repositories.Implementation
{
    public class TenantPropAssocRepository : ITenantPropAssocRepository
    {
        private readonly DatabaseContext _databaseContext;
        public TenantPropAssocRepository(DatabaseContext databaseContext)
        {
            _databaseContext = databaseContext;
        }
        public async Task<TenantPropAssoc> AddTenantAsync(TenantPropAssoc tenantProp)
        {
            try
            {
                tenantProp.FromDate= DateTime.Now;
                tenantProp.IsActive= true;
                _databaseContext.TenantPropAssocs.Add(tenantProp);
                await _databaseContext.SaveChangesAsync();
                return tenantProp;
            }
            catch (Exception ex)
            {
                Console.Write(ex.ToString());
                return null;
            }
        }
    }
}
