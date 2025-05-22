namespace UserManagement.CQRS.Command
{
    public class UpdateThresholdCommandHandler : IRequestHandler<UpdateUserByUserIdCommand, Users>
    {
       private readonly IUserRepository _userRepository;

        public UpdateThresholdCommandHandler(IUserRepository userRepository)
        {
            _userRepository = userRepository;
        }

        public Task<Users> Handle(UpdateUserByUserIdCommand request, CancellationToken cancellationToken)
        {
            return _userRepository.UpdateUsers(request.User);
        }
    }
}
