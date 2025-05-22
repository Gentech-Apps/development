namespace UserManagement.CQRS.Repositories.Interfaces
{
    public interface IBusinessRepository
    {
        Task<Business> GetBusinessByBusinessIdAndUserIdAsync(string businessId, string userId);
        Task<BusinessDetailsModel> GetBusinessDetailsByUserId(Guid userId);
        public Task<Business> RegisterBusinessAsync(RegisterBusinessModel registerBusinessModel);
    }
}
