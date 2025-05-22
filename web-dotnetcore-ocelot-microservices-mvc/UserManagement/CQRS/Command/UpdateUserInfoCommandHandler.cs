using UserManagement.CQRS.Models;

namespace UserManagement.CQRS.Command
{
    public class UpdateUserInfoCommandHandler : IRequestHandler<UpdateUserInfoCommand, UsersInfo>
    {
        private readonly IUserInfoRepository _userInfoRepository;

        public UpdateUserInfoCommandHandler(IUserInfoRepository userInfoRepository)
        {
            _userInfoRepository = userInfoRepository;
        }

        public Task<UsersInfo> Handle(UpdateUserInfoCommand request, CancellationToken cancellationToken)
        {
            return _userInfoRepository.UpdateAsync(request.UserInfo);
        }
    }
}
