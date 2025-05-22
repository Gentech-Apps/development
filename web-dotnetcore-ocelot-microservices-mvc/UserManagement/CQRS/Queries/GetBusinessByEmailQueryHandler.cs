namespace UserManagement.CQRS.Queries
{
    public class GetBusinessByEmailQueryHandler : IRequestHandler<GetBusinessByEmailQuery, UsersInfo>
    {
        private readonly IUserInfoRepository _UserInfoRepository;

        public GetBusinessByEmailQueryHandler(IUserInfoRepository userInfoRepository)
        {
            _UserInfoRepository = userInfoRepository;
        }

        Task<UsersInfo> IRequestHandler<GetBusinessByEmailQuery, UsersInfo>.Handle(GetBusinessByEmailQuery request, CancellationToken cancellationToken)
        {
            return _UserInfoRepository.GetUsersInfoByEmailAsync(request.Email);
        }
    }
}
