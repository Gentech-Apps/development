using UserManagement.database;

namespace UserManagement.CQRS.Repositories.Implementation
{
    public class UserInfoRepository : IUserInfoRepository
    {
        private readonly DatabaseContext _databaseContext;

        public UserInfoRepository(DatabaseContext databaseContext)
        {
            _databaseContext = databaseContext;
        }


        public async Task<UsersInfo> UpdateAsync(UsersInfo usersInfo)
        {

            UsersInfo UserData  = await _databaseContext.UsersInfo.FirstOrDefaultAsync(x => x.UserInfoId == usersInfo.UserInfoId);

            if (!IsNullorEmpty(usersInfo.FirstName) && usersInfo.FirstName != UserData.FirstName) {
                UserData.FirstName = usersInfo.FirstName;
            }
            if (!IsNullorEmpty(usersInfo.LastName) && usersInfo.LastName != UserData.LastName)
            {
                UserData.FirstName = usersInfo.FirstName;
            }
            if (!IsNullorEmpty(usersInfo.ProfileImageURL) && usersInfo.ProfileImageURL != UserData.ProfileImageURL)
            {
                UserData.ProfileImageURL = usersInfo.ProfileImageURL;
            }
            if (!IsNullorEmpty(usersInfo.DwollaVerifcationToken) && usersInfo.DwollaVerifcationToken != UserData.DwollaVerifcationToken)
            {
                UserData.DwollaVerifcationToken = usersInfo.DwollaVerifcationToken;
            }
            if (!IsNullorEmpty(usersInfo.DwollaVerificationStatus) && usersInfo.DwollaVerificationStatus != UserData.DwollaVerificationStatus)
            {
                UserData.DwollaVerificationStatus = usersInfo.DwollaVerificationStatus;
            }
            if (!IsNullorEmpty(usersInfo.SSN) && usersInfo.SSN != UserData.SSN)
            {
                UserData.SSN = usersInfo.SSN;
            }
            if (!IsNullorEmpty(usersInfo.DOB) && usersInfo.DOB != UserData.DOB)
            {
                UserData.DOB = usersInfo.DOB;
            }
            if (!IsNullorEmpty(usersInfo.State) && usersInfo.State != UserData.State)
            {
                UserData.State = usersInfo.State;
            }
            if (!IsNullorEmpty(usersInfo.ZipCode) && usersInfo.ZipCode != UserData.ZipCode)
            {
                UserData.ZipCode = usersInfo.ZipCode;
            }
            if (!IsNullorEmpty(usersInfo.Country) && usersInfo.Country != UserData.Country)
            {
                UserData.Country = usersInfo.Country;
            }
            if (!IsNullorEmpty(usersInfo.Email) && usersInfo.Email != UserData.Email)
            {
                UserData.Email = usersInfo.Email;
            }
            if (!IsNullorEmpty(usersInfo.AddressLine1) && usersInfo.AddressLine1 != UserData.AddressLine1)
            {
                UserData.AddressLine1 = usersInfo.AddressLine1;
            }
            if (!IsNullorEmpty(usersInfo.AddressLine2) && usersInfo.AddressLine2 != UserData.AddressLine2)
            {
                UserData.AddressLine2 = usersInfo.AddressLine2;
            }
            if (!IsNullorEmpty(usersInfo.City) && usersInfo.City != UserData.City)
            {
                UserData.City = usersInfo.City;
            }
            _databaseContext.UsersInfo.Update(UserData);
            await _databaseContext.SaveChangesAsync();
            return usersInfo;
        }

        public Boolean IsNullorEmpty(Object data)
        {
            return data is null or (object)"";

        }

        public async Task<UsersInfo> GetUsersInfoByEmailAsync(string email)
        {
            string emailLowerCase = email.ToLower();
            try { 
                var result = await _databaseContext.UsersInfo.FirstOrDefaultAsync(x => x.Email == emailLowerCase);
                return result;
            }catch {
                return null;
                throw;
            }
        }

        public async Task<UsersInfo> GetUserInfoByUserIdInfo(string userInfoId)
        {
            var result = await _databaseContext.UsersInfo.FirstOrDefaultAsync(x => x.UserInfoId == new Guid(userInfoId));
            if (result != null) {
                return result;
            }
            return null;
        }

        public async Task<UsersInfo> GetUserInfoByUserId(Guid userId)
        {
            var result = await _databaseContext.UsersInfo.FirstOrDefaultAsync(x => x.UserId == userId);
            if (result != null)
            {
                return result;
            }
            return null;
        }
        public async Task<UsersModel> GetControllerDetailsByUserId(Guid userId)
        {
            UsersModel userInfo = await (from bs in _databaseContext.Businesses
                                        where bs.UserId.Equals(userId)
                                        join owc in _databaseContext.OwnersAndControllers on bs.BusinessId equals owc.BusinessId
                                        where owc.Type == UserTypeEnum.Controller
                                        join us in _databaseContext.UsersInfo on owc.UserInfoId equals us.UserInfoId
                                        select new UsersModel
                                        {
                                            DwollaVerifcationToken = us.DwollaVerifcationToken,
                                            Email = us.Email,
                                            UserInfoId = us.UserInfoId
                                        }).FirstOrDefaultAsync();
            if (userInfo != null)
            {
                return userInfo;
            }
            else
            {
                return null;
            }
        }

        public async Task<UsersModel> GetOwnerDetailsByuserId(Guid userId)
        {
            UsersModel userInfo = await (from bs in _databaseContext.Businesses
                                        where bs.UserId.Equals(userId)
                                        join owc in _databaseContext.OwnersAndControllers on bs.BusinessId equals owc.BusinessId
                                        where owc.Type == UserTypeEnum.Owner
                                        join us in _databaseContext.UsersInfo on owc.UserInfoId equals us.UserInfoId
                                        select new UsersModel
                                        {
                                            DwollaVerifcationToken = us.DwollaVerifcationToken,
                                            Email = us.Email,
                                            UserInfoId = us.UserInfoId
                                        }).FirstOrDefaultAsync();
            if (userInfo != null)
            {
                return userInfo;
            }
            else
            {
                return null;
            }
        }
    }
}

