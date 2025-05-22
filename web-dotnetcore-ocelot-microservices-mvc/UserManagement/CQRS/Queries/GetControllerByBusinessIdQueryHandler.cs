namespace UserManagement.CQRS.Queries
{
    public class GetControllerByBusinessIdQueryHandler : IRequestHandler<GetControllerByBusinessIdQuery, UsersModel>
    {
        private readonly IOwnerAndControllerRepository _ownerandControllerRepository;

        public GetControllerByBusinessIdQueryHandler(IOwnerAndControllerRepository ownerandControllerRepository)
        {
            _ownerandControllerRepository = ownerandControllerRepository;
        }

        public Task<UsersModel> Handle(GetControllerByBusinessIdQuery request, CancellationToken cancellationToken)
        {
            return _ownerandControllerRepository.GetControllerByBusinessId(request.BusinessId);
        }
    }
}
