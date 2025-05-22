namespace UserManagement.CQRS.Repositories.Interfaces
{
    public interface IOwnerAndControllerRepository
    {
        Task<OwnersAndControllers> AddOwnerAndControllerAsync(RegisterControllerModel registerOwnerAndControllerModel);
        Task<UsersModel> GetControllerByBusinessId(Guid BusinessId);
        Task<RegisterControllerModel> GetOwnerDetailsByUserInfoId(Guid userInfoId);
        Task<OwnersDetailModel> GetOwnersDetailByBusinessIdAndUserId(string businessId);
        Task<RegisterControllerModel> UpdateOwnerAndControllerDetails(RegisterControllerModel ownerAndControllerDetails);
    }
}
