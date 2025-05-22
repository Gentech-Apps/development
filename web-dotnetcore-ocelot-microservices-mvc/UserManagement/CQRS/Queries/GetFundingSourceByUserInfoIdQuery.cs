namespace UserManagement.CQRS.Queries
{
    public class GetFundingSourceByUserInfoIdQuery : IRequest<FundingSource>
    {
        public string UserInfoId { get; set; }
    }
}
