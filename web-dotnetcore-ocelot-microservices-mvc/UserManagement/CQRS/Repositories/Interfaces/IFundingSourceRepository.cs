namespace UserManagement.CQRS.Repositories.Interfaces
{
    public interface IFundingSourceRepository
    {
        Task<FundingSource> AddFundingSource(FundingSource fundingSource);
        Task<FundingSource> GetFundingSourceByUserInfoId(string userInfoId);
    }
}
