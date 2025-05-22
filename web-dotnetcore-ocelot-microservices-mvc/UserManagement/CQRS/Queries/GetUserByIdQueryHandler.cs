namespace UserManagement.CQRS.Queries
{
    public class GetUserByIdQueryHandler : IRequestHandler<GetUserByIdQuery, UsersModel>
    {
        private readonly IUserRepository _userRepository;

        public GetUserByIdQueryHandler(IUserRepository userRepository)
        {
            _userRepository = userRepository;
        }

        public Task<UsersModel> Handle(GetUserByIdQuery request, CancellationToken cancellationToken)
        {
            return _userRepository.GetUserById(request.UserId);
        }
    }
}
