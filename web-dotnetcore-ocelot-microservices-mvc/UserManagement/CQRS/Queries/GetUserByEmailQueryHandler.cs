using Microsoft.IdentityModel.Tokens;

namespace UserManagement.CQRS.Queries
{
    public class GetUserByEmailQueryHandler : IRequestHandler<GetUserByEmailQuery, Users>
    {
        private readonly IUserRepository _userRepository;

        public GetUserByEmailQueryHandler(IUserRepository userRepository)
        {
            _userRepository = userRepository;
        }

        public Task<Users> Handle(GetUserByEmailQuery request, CancellationToken cancellationToken)
        {
            return _userRepository.GetUserByEmailAsync(request.Email);
        }
    }
}