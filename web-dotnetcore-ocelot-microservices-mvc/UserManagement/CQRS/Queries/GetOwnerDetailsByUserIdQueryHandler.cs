namespace UserManagement.CQRS.Queries
{
    public class GetOwnerDetailsByUserIdQueryHandler: IRequestHandler<GetOwnerDetailsByUserIdQuery, UsersModel>
    {
       IUserInfoRepository _userInfoRepository;

        public GetOwnerDetailsByUserIdQueryHandler(IUserInfoRepository userInfoRepository)
        {
            _userInfoRepository = userInfoRepository;
        }

        public Task<UsersModel> Handle(GetOwnerDetailsByUserIdQuery request, CancellationToken cancellationToken)
        {
            return _userInfoRepository.GetOwnerDetailsByuserId(request.UserId);
        }
    }
}
