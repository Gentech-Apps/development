namespace UserManagement.CQRS.Queries
{
    public class GetOwnersByBusinessIdAndUserIdQueryHandler : IRequestHandler<GetOwnersByBusinessIdAndUserIdQuery, OwnersDetailModel>
    {
        private readonly IOwnerAndControllerRepository _ownerAndControllerRepository;

        public GetOwnersByBusinessIdAndUserIdQueryHandler(IOwnerAndControllerRepository ownerAndControllerRepository)
        {
            _ownerAndControllerRepository = ownerAndControllerRepository;
        }

        public Task<OwnersDetailModel> Handle(GetOwnersByBusinessIdAndUserIdQuery request, CancellationToken cancellationToken)
        {
            return _ownerAndControllerRepository.GetOwnersDetailByBusinessIdAndUserId(request.BusinessId);
        }
    }
}