namespace UserManagement.CQRS.Command
{
    public class AddUserCommandHandler : IRequestHandler<AddUserCommand, UsersModel>
    {
        private readonly IUserRepository _UserRepository;
        public AddUserCommandHandler(IUserRepository userRepository)
        {
            _UserRepository = userRepository;
        }

        public Task<UsersModel> Handle(AddUserCommand request, CancellationToken cancellationToken)
        {
            return _UserRepository.AddUserAsync(request.userData);

        }
    }
}
