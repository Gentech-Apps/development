using PropertiesManagement.CQRS.Models;
using PropertiesManagement.Database;

namespace PropertiesManagement.CQRS.Repositories.Interfaces
{
    public interface ILeaseRepository
    {
        public Task<LeaseModel> AddLease(LeaseModel leaseModel);
        public Task<Leases> UpdateLease(LeaseModel leaseModel);
        public Task<LeaseModel> GetLeaseByPropertyId(string PropertyId);
    }
}
