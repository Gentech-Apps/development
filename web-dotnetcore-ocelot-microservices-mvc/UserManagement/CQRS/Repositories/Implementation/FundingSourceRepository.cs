using UserManagement.database;

namespace UserManagement.CQRS.Repositories.Implementation
{
    public class FundingSourceRepository: IFundingSourceRepository
    {
        private readonly DatabaseContext _databaseContext;

        public FundingSourceRepository(DatabaseContext databaseContext)
        {
            _databaseContext = databaseContext;
        }

        public async Task<FundingSource> AddFundingSource(FundingSource fundingSource)
        {
            FundingSource fundingSourceRecord = new FundingSource();
            fundingSourceRecord.UserInfoId = fundingSource.UserInfoId;
            fundingSourceRecord.FundingSourceDwollaToken = fundingSource.FundingSourceDwollaToken;
            fundingSourceRecord.FundingSourceDwollaStatus = fundingSource.FundingSourceDwollaStatus;
            fundingSourceRecord.PlaidProcessorToken = fundingSource.PlaidProcessorToken;
            _databaseContext.Add(fundingSourceRecord);
            await _databaseContext.SaveChangesAsync();
            return fundingSourceRecord;
        }

        public async Task<FundingSource> GetFundingSourceByUserInfoId(string userInfoId)
        {
            var result = await _databaseContext.FundingSources.FirstOrDefaultAsync(x => x.UserInfoId == new Guid(userInfoId));
            if (result != null)
            {
                return result;
            }
            return null;
        }
    }
}
