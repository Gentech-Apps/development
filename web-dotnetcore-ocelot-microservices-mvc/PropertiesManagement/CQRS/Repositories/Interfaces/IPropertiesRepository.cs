using PropertiesManagement.CQRS.Models;
using PropertiesManagement.Database;

namespace PropertiesManagement.CQRS.Repositories.Interfaces
{
    public interface IPropertiesRepository
    {
        public Task<Properties> AddPropertyAsync(Properties property);
        public Task<List<PropertiesModel>> GetPropertiesByZipCode(string zipcode,string street);
        public Task<PropertiesAggregationModel> GetPropertiesAggregationByOwnerId(string OwnerId);
        public Task<List<Properties>> GetPropertiesByOwnerId(string OwnerId);
        public Task<List<PropertiesPortfolioModel>> GetPropertiesPortfolioByOwnerId(string OwnerId, int pageNumber, int pageSize);
        public Task<PropertiesPortfolioModel> GetPropertyDetails(string OwnerId, string PropertyId);
        public Task<Properties> UpdatePropertyAsync(Properties property);
        public Task<Properties> GetPropertyIdAndOwnerIdByTenantId(string TenantId);
        public Task<PropertiesPortfolioModel> GetPropertyDetailsByTenantId(string TenantId, string OwnerId, string PropertyId);
        public Task<PropertiesDocuments> AddPropertiesDocuments(PropertiesDocuments pd);

    }
}
