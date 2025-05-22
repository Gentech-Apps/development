namespace UserManagement.CQRS.Command
{
    public class AddIndividualLandlordCommandHandler: IRequestHandler<AddIndividualLandlordCommand, UsersInfo>
    {
        private readonly IUserRepository _userRepository;
        public AddIndividualLandlordCommandHandler(IUserRepository userRepository)
        {
            _userRepository = userRepository;
        }
        public Task<UsersInfo> Handle(AddIndividualLandlordCommand request, CancellationToken cancellationToken)
        {
            return _userRepository.AddIndividualLandlord(request.UserInfo);
        }
    }
}
