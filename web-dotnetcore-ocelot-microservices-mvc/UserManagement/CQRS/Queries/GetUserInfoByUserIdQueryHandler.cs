namespace UserManagement.CQRS.Queries
{
    public class GetUserInfoByUserIdQueryHandler : IRequestHandler<GetUserInfoByUserIdQuery, UsersInfo>
    {
        private readonly IUserInfoRepository _userInfoRepository;

        public GetUserInfoByUserIdQueryHandler(IUserInfoRepository userInfoRepository)
        {
            _userInfoRepository = userInfoRepository;
        }

        public Task<UsersInfo> Handle(GetUserInfoByUserIdQuery request, CancellationToken cancellationToken)
        {
            return _userInfoRepository.GetUserInfoByUserId(request.UserId);
        }
    }
}
