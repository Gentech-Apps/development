namespace UserManagement.CQRS.Queries
{
    public class GetUserInfoByUserInfoIdQueryHandler : IRequestHandler<GetUserInfoByUserInfoIdQuery, UsersInfo>
    {
        private IUserInfoRepository _userInfoRepository;

        public GetUserInfoByUserInfoIdQueryHandler(IUserInfoRepository userInfoRepository)
        {
            _userInfoRepository = userInfoRepository;
        }

        public Task<UsersInfo> Handle(GetUserInfoByUserInfoIdQuery request, CancellationToken cancellationToken)
        {
            return _userInfoRepository.GetUserInfoByUserIdInfo(request.UserInfoId);
        }
    }
}
