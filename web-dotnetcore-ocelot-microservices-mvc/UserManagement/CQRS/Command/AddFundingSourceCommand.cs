namespace UserManagement.CQRS.Command
{
    public class AddFundingSourceCommand : IRequest<FundingSource>
    {
        public FundingSource fundingSource { get; set; }
    }
}
