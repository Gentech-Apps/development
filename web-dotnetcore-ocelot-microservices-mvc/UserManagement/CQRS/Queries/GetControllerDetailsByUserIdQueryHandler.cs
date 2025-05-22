namespace UserManagement.CQRS.Queries
{
    public class GetControllerDetailsByUserIdQueryHandler: IRequestHandler<GetControllerDetailsByUserIdQuery, UsersModel>
    {
        IUserInfoRepository _userInfoRepository;

        public GetControllerDetailsByUserIdQueryHandler(IUserInfoRepository userInfoRepository)
        {
            _userInfoRepository = userInfoRepository;
        }

        public Task<UsersModel> Handle(GetControllerDetailsByUserIdQuery request, CancellationToken cancellationToken)
        {
             return _userInfoRepository.GetControllerDetailsByUserId(request.UserId);
        }
    }
}
