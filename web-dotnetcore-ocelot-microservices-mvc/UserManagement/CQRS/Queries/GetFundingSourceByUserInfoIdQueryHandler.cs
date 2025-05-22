namespace UserManagement.CQRS.Queries
{
    public class GetFundingSourceByUserInfoIdQueryHandler: IRequestHandler<GetFundingSourceByUserInfoIdQuery, FundingSource>
    {
        private readonly IFundingSourceRepository _fundingSourceRepository;

        public GetFundingSourceByUserInfoIdQueryHandler(IFundingSourceRepository fundingSourceRepository)
        {
            _fundingSourceRepository = fundingSourceRepository;
        }

        public Task<FundingSource> Handle(GetFundingSourceByUserInfoIdQuery request, CancellationToken cancellationToken)
        {
            return _fundingSourceRepository.GetFundingSourceByUserInfoId(request.UserInfoId);
        }
    }
}
