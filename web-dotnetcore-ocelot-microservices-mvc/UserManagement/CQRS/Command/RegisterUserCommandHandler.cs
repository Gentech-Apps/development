namespace UserManagement.CQRS.Command
{
    public class RegisterUserCommandHandler : IRequestHandler<RegisterUserCommand,UserAccount>
    {
        private readonly IUserRepository _UserRepository;
        public RegisterUserCommandHandler(IUserRepository userRepository)
        {
            _UserRepository = userRepository;
        }

        public Task<UserAccount> Handle(RegisterUserCommand request, CancellationToken cancellationToken)
        {
            return _UserRepository.RegisterUserAsync(request.registerUserData);

        }
    }
}
