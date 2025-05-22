namespace UserManagement.CQRS.Queries
{
    public class GetBusinessByBusinessIdAndUserIdQueryHandler: IRequestHandler<GetBusinessByBusinessIdAndUserIdQuery, Business>
    {
        private readonly IBusinessRepository _businessRepository;

        public GetBusinessByBusinessIdAndUserIdQueryHandler(IBusinessRepository businessRepository)
        {
            _businessRepository = businessRepository;
        }

        public Task<Business> Handle(GetBusinessByBusinessIdAndUserIdQuery request, CancellationToken cancellationToken)
        {
            return _businessRepository.GetBusinessByBusinessIdAndUserIdAsync(request.BusinessId, request.UserId);
        }
    }

}
