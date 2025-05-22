namespace UserManagement.CQRS.Queries
{
    public class GetUsersQueryHandler : IRequestHandler<GetUsersQuery, List<UsersModel>>
    {
        private readonly IUserRepository _UserRepository;

        public GetUsersQueryHandler(IUserRepository userRepository)
        {
            _UserRepository = userRepository;
        }

        public Task<List<UsersModel>> Handle(GetUsersQuery request, CancellationToken cancellationToken)
        {
            return _UserRepository.GetAllUSersAsync();
        }
    }
}
