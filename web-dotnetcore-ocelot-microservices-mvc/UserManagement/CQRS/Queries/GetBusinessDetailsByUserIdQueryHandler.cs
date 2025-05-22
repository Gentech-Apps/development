namespace UserManagement.CQRS.Queries
{
    public class GetBusinessDetailsByUserIdQueryHandle : IRequestHandler<GetBusinessDetailsByUserIdQuery, BusinessDetailsModel>
    {
        private readonly IBusinessRepository _businessRepository;

        public GetBusinessDetailsByUserIdQueryHandle(IBusinessRepository businessRepository)
        {
            _businessRepository = businessRepository;
        }

        public Task<BusinessDetailsModel> Handle(GetBusinessDetailsByUserIdQuery request, CancellationToken cancellationToken)
        {
            return _businessRepository.GetBusinessDetailsByUserId(request.UserId);
        }
    }
}