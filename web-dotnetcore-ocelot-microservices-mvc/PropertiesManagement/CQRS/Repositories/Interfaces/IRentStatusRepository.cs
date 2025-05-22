using PropertiesManagement.Database;

namespace PropertiesManagement.CQRS.Repositories.Interfaces
{
    public interface IRentStatusRepository
    {
        public Task<List<RentStatus>> GetRentStatusByPropertyAndTenantId(string PropertyId, string TenantId );
    }
}