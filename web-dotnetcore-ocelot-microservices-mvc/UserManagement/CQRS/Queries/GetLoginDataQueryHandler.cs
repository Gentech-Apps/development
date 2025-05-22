using JwtAuthanticationManager.Models;

namespace UserManagement.CQRS.Queries
{
    public class GetLoginDataQueryHandler : IRequestHandler<GetLoginDataQuery,UserAccount>
    {
        private readonly IUserRepository _UserRepository;

        public GetLoginDataQueryHandler(IUserRepository userRepository)
        {
            _UserRepository = userRepository;
        }

        public Task<UserAccount> Handle(GetLoginDataQuery request, CancellationToken cancellationToken)
        {
            return _UserRepository.GetUsersLoginDataAsync(request.QueryRequest);
        }
    }
}
