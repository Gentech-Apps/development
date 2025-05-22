using System.Diagnostics;
using UserManagement.CQRS.Models;
using UserManagement.database;


namespace UserManagement.CQRS.Repositories.Implementation
{
    public class UserRepository : IUserRepository
    {
        private readonly DatabaseContext _databaseContext;

        public UserRepository(DatabaseContext databaseContext)
        {
            _databaseContext = databaseContext;
        }
        public Boolean IsNullorEmpty(Object data)
        {
            return data is null or (object)"";

        }
        public async Task<List<UsersModel>> GetAllUSersAsync()
        {
            /*            List<UsersModel> userModelList = await (from us in _databaseContext.Users
                                                                join ui in _databaseContext.UsersInfo on us.UserId equals ui.UserId
                                                                select new UsersModel
                                                                {
                                                                    UserId = (Guid)ui.UserId,
                                                                    Email = us.Email,
                                                                    FirstName = ui.FirstName,
                                                                    LastName = ui.LastName,
                                                                    Mobile = ui.Mobile,
                                                                    IsActive = us.IsActive,
                                                                    ProfileImageURL = ui.ProfileImageURL,
                                                                    Role = us.Role,
                                                                }).ToListAsync();
                        return userModelList;*/
            return null;
        }
        public async Task<UsersModel> AddUserAsync(UsersModel usersModel)
        {
            UsersInfo user = new UsersInfo();
            user.FirstName = usersModel.FirstName;
            user.LastName = usersModel.LastName;
            user.CreatedDate = DateTime.Now;
            //user.IsMobileVerified = false;
            user.ProfileImageURL = usersModel.ProfileImageURL;
            _databaseContext.UsersInfo.Add(user);
            await _databaseContext.SaveChangesAsync();
            //usersModel.UserId = (Guid)user.UserId;
            return usersModel;
            return null; 
        }

        public async Task<Users> GetPasswordSaltByEmail(String Email)
        {
            var result = await (from user in _databaseContext.Users
                                where user.Email == Email
                                select new Users{ PasswordSalt = user.PasswordSalt, 
                                                  PasswordHash = user.PasswordHash, 
                                                  Email = user.Email,
                                                  UserId = user.UserId,
                                                  Role= user.Role
                                })
                                .FirstAsync();
            return result;
        }
        public async Task<UserAccount?> GetUsersLoginDataAsync(AuthenticationRequest request)
        {
            //get user password salt and encrypt then compare
            Users user = await GetUserByEmailAsync(request.UserEmail);
            if (user != null)
            {
                
                await _databaseContext.UsersInfo.FirstOrDefaultAsync(x => x.UserInfoId == user.UserInfoId);
                //generate password hash from the salt and password
                String requestPasswordHash = EncryptionService.ComputeHash(request.Password, user.PasswordSalt);
                //check  requested passwordHash with stored password hash
                if (requestPasswordHash == user.PasswordHash)
                {
                    UserAccount userAccount = new UserAccount();
                    userAccount.UserId = user.UserId;
                    userAccount.UserEmail = user.Email;
                    userAccount.Role = user.Role;
                    userAccount.IsPhoneNoVerified = (bool)user.IsPhoneNoVerified;
                    userAccount.IsActive = (bool)user.IsActive;
                    userAccount.IsIndividual = (bool)user.IsIndividual;
                    if (user.UserInfoId != null) {
                        UsersInfo usInf = await _databaseContext.UsersInfo.FirstOrDefaultAsync(x => x.UserInfoId == user.UserInfoId);
                        userAccount.FirstName = usInf.FirstName;
                        userAccount.LastName = usInf.LastName;
                    }
                    return userAccount;
                }
                else
                {
                    return null;
                }
            }
            else
            {
                return null;
            }
        }
        public async Task<UserAccount> RegisterUserAsync(RegisterUserModel registerUserModel)
        {
            if (registerUserModel.Role == "tenant")
            {
                try 
                {
                    string[] name = registerUserModel.Name.Split(' ');
                    // For Tenant
                    Users user = new Users();

                    user.Email = registerUserModel.Email;
                    user.PasswordSalt = EncryptionService.GenerateSalt();
                    user.PasswordHash = EncryptionService.ComputeHash(registerUserModel.Password, user.PasswordSalt);
                    user.Role = registerUserModel.Role;
                    user.IsActive = true;
                    user.IsIndividual = true;
                    user.IsPhoneNoVerified = false;
                    user.CreatedDate = DateTime.Now;
                    Users UserResponse = _databaseContext.Add(user).Entity;
                    await _databaseContext.SaveChangesAsync();

                    UsersInfo userInfo = new UsersInfo();
                    userInfo.Email = registerUserModel.Email;
                    userInfo.FirstName = name[0];
                    if (name.Length > 1)
                    {
                        userInfo.LastName = name[1];
                    }
                    else
                    {
                        userInfo.LastName = "";
                    }


                    //create unverified custommer in dwolla
                    CreateCustomerRequest customer = new CreateCustomerRequest();
                    customer.FirstName = userInfo.FirstName;
                    customer.LastName = userInfo.LastName;
                    customer.Email = userInfo.Email;

                    DwollaOperation customersOperations = new DwollaOperation();
                    var location = await customersOperations.CreateUnverifiedCustomer(customer);
                    userInfo.DwollaVerifcationToken = location.ToString();
                    var status = customersOperations.GetVerificationStatusCustomer(location);
                    userInfo.UserId = UserResponse.UserId;

                    UsersInfo UserInfoResponse = _databaseContext.Add(userInfo).Entity;
                    await _databaseContext.SaveChangesAsync();

                    UserAccount userAccount = new UserAccount();
                    userAccount.UserId = user.UserId;
                    userAccount.Password = user.PasswordHash;
                    userAccount.UserEmail = user.Email;
                    userAccount.Role = user.Role;

                    return userAccount;
                } catch (Exception ex)
                {
                    Debug.WriteLine(ex);
                    return null;
                }
                
            
                return null;
        }
        else
        {
            if (registerUserModel.LandlordType == "business")
            {
                Users user = new Users();
                user.Email = registerUserModel.Email;
                user.PasswordSalt = EncryptionService.GenerateSalt();
                user.PasswordHash = EncryptionService.ComputeHash(registerUserModel.Password, user.PasswordSalt);
                user.Role = registerUserModel.Role;
                user.IsActive = true;
                user.IsIndividual = false;
                user.IsPhoneNoVerified = false;
                user.CreatedDate = DateTime.Now;
                _databaseContext.Add(user);
                await _databaseContext.SaveChangesAsync();
                UserAccount userAccount = new UserAccount();
                userAccount.UserEmail = user.Email;
                userAccount.IsPhoneNoVerified = false;
                userAccount.UserId = user.UserId;
                userAccount.IsActive = true;
                userAccount.Password = user.PasswordHash;
                userAccount.Role = user.Role;
                return userAccount;
            }
            else
            {
                // for landlord with individual
                Users user = new Users();
                user.Email = registerUserModel.Email;
                user.PasswordSalt = EncryptionService.GenerateSalt();
                user.PasswordHash = EncryptionService.ComputeHash(registerUserModel.Password, user.PasswordSalt);
                user.Role = registerUserModel.Role;
                user.IsActive = true;
                user.IsIndividual = true;
                user.IsPhoneNoVerified = false;
                user.CreatedDate = DateTime.Now;
                _databaseContext.Add(user);
                await _databaseContext.SaveChangesAsync();
                UserAccount userAccount = new UserAccount();
                userAccount.UserEmail = user.Email;
                userAccount.IsPhoneNoVerified = false;
                userAccount.UserId = user.UserId;
                userAccount.IsActive = true;
                userAccount.Password = user.PasswordHash;
                userAccount.Role = user.Role;
                return userAccount;
            }
        }
        }

        public async Task<Users?> GetUserByEmailAsync(string email)
        {
            string smallCapsEmail = email.ToLower();
            try
            {
                var result = await _databaseContext.Users.FirstOrDefaultAsync(x => x.Email == smallCapsEmail);
                return result;
            }
            catch (Exception)
            {
                return null;
                throw;
            }
        }
        public async Task<UsersModel> GetUserById(Guid UserId)
        {
            UsersModel? userModel = await (from us in _databaseContext.Users
                                           where us.UserId == UserId
                                           join ui in _databaseContext.UsersInfo on us.UserId equals ui.UserId
                                           select new UsersModel
                                           {
                                               UserId = (Guid)ui.UserId,
                                               Email = us.Email,
                                               FirstName = ui.FirstName,
                                               LastName = ui.LastName,
                                               PhoneNumber = us.PhoneNumber,
                                               IsActive = (bool)us.IsActive,
                                               ProfileImageURL = ui.ProfileImageURL,
                                               Role = us.Role,
                                               Country = ui.Country,
                                               AddressLine1 = ui.AddressLine1,
                                               AddressLine2 = ui.AddressLine2,
                                               City = ui.City,
                                               State = ui.State,
                                               ZipCode = ui.ZipCode,
                                               DOB = ui.DOB,
                                               DwollaVerificationStatus = ui.DwollaVerificationStatus,
                                               SSN = ui.SSN,
                                               DwollaVerifcationToken = ui.DwollaVerifcationToken,
                                               CreatedDate = ui.CreatedDate,
                                               UserInfoId = ui.UserInfoId,
                                               IsIndividual = (bool)us.IsIndividual
                                           }).FirstOrDefaultAsync();
                        return userModel;
            return null;
            
        }

        public async Task<Users> UpdateUsers(Users user)
        {
            Users userRecord = await _databaseContext.Users.FindAsync(user.UserId);
            if (!IsNullorEmpty(user.Email) && userRecord.Email != user.Email)
            {
                userRecord.Email = user.Email;
            }
            if (!IsNullorEmpty(user.PhoneNumber) && userRecord.PhoneNumber != user.PhoneNumber)
            {
                userRecord.PhoneNumber = user.PhoneNumber;
            }
            if (!IsNullorEmpty(user.Threshold) && userRecord.Threshold != user.Threshold)
            {
                userRecord.Threshold = user.Threshold;
            }
            if (!IsNullorEmpty(user.Role) && userRecord.Role != user.Role)
            {
                userRecord.Role = user.Role;
            }
            if (!IsNullorEmpty(user.IsActive) && userRecord.IsActive != user.IsActive)
            {
                userRecord.IsActive = user.IsActive;
            }
            if (!IsNullorEmpty(user.IsPhoneNoVerified) && userRecord.IsPhoneNoVerified != user.IsPhoneNoVerified)
            {
                userRecord.IsPhoneNoVerified = user.IsPhoneNoVerified;
            }
            _databaseContext.Users.Update(userRecord);
            await _databaseContext.SaveChangesAsync();
            return userRecord;
        }

        public async Task<UsersInfo> AddIndividualLandlord(UsersInfo usersInfo)
        {
            try
            {
                UsersInfo userInfoRecord = new UsersInfo();
                CreateCustomerRequest request = new CreateCustomerRequest();
                request.FirstName = usersInfo.FirstName;
                request.LastName = usersInfo.LastName;
                request.Email = usersInfo.Email;
                request.Type = "personal";
                request.Address1 = usersInfo.AddressLine1;
                request.Address2 = usersInfo.AddressLine2;
                request.City = usersInfo.City;
                request.State = usersInfo.State;
                request.PostalCode = usersInfo.ZipCode;
                DateTime dt = (DateTime)usersInfo.DOB;
                request.DateOfBirth = DateTime.Parse(dt.ToString("yyyy-MM-dd"));
                request.Ssn = usersInfo.SSN;
                DwollaOperation operations = new DwollaOperation();
                var location = await operations.CreateVerifiedCustomer(request);
                var status = await operations.GetVerificationStatusCustomer(location["value"]);

                userInfoRecord.DwollaVerifcationToken = location["value"];
                userInfoRecord.DwollaVerificationStatus = status.ToString();
                userInfoRecord.UserId = usersInfo.UserId;
                userInfoRecord.FirstName = usersInfo.FirstName;
                userInfoRecord.LastName = usersInfo.LastName;
                userInfoRecord.AddressLine1 = usersInfo.AddressLine1;
                userInfoRecord.AddressLine2 = usersInfo.AddressLine2;
                userInfoRecord.City = usersInfo.City;
                userInfoRecord.State = usersInfo.State;
                userInfoRecord.Email = usersInfo.Email;
                userInfoRecord.SSN = usersInfo.SSN;
                userInfoRecord.DOB = usersInfo.DOB;
                UsersInfo savedUserInfoRecord = _databaseContext.Add(userInfoRecord).Entity;
                await _databaseContext.SaveChangesAsync();
                if (savedUserInfoRecord != null)
                {
                    return savedUserInfoRecord;
                }
                return null;
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return null;
            }
        }
        public async Task<Users> GetUserDetailsByUserId(Guid UserId)
        {
            try
            {
               Users userRecord = await _databaseContext.Users.FirstOrDefaultAsync(x => x.UserId == UserId);
                return userRecord;
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return null;
            }
        }
    }
}