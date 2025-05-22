namespace UserManagement.CQRS.Repositories.Interfaces
{
    public interface IUserInfoRepository
    {
        public Task<UsersInfo> UpdateAsync(UsersInfo usersInfo);
        public Task<UsersInfo> GetUsersInfoByEmailAsync(string email);
        Task<UsersInfo> GetUserInfoByUserIdInfo(string userInfoId);
        Task<UsersInfo> GetUserInfoByUserId(Guid userId);
        Task<UsersModel> GetControllerDetailsByUserId(Guid userId);
        Task<UsersModel> GetOwnerDetailsByuserId(Guid userId);
    }
}
