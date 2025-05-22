using UserManagement.CQRS.Repositories.Interfaces;

namespace UserManagement.CQRS.Command
{
    public class AddFundingSourceCommandHandler: IRequestHandler<AddFundingSourceCommand, FundingSource>
    {
        private readonly IFundingSourceRepository _FundindSourceRepositoryRepository;

        public AddFundingSourceCommandHandler(IFundingSourceRepository repository)
        {
            _FundindSourceRepositoryRepository = repository;
        }

        public Task<FundingSource> Handle(AddFundingSourceCommand request, CancellationToken cancellationToken)
        {
            return _FundindSourceRepositoryRepository.AddFundingSource(request.fundingSource);
        }
    }
}
