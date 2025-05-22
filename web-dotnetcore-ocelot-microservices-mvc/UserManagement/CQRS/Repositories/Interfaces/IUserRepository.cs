namespace UserManagement.CQRS.Repositories.Interfaces
{
    public interface IUserRepository
    {
        public Task<List<UsersModel>> GetAllUSersAsync();

        public Task<UsersModel> AddUserAsync(UsersModel user);

        public Task<UserAccount?> GetUsersLoginDataAsync(AuthenticationRequest request);

        public Task<UserAccount> RegisterUserAsync(RegisterUserModel registerUserModel);

        public Task<Users?> GetUserByEmailAsync(string email);

        public Task<UsersModel> GetUserById(Guid UserId);

        public Task<Users> UpdateUsers(Users User);

        public Task<UsersInfo> AddIndividualLandlord(UsersInfo usersInfo);
        public Task<Users> GetUserDetailsByUserId(Guid UserId);
    }
}
