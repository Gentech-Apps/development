using UserManagement.database;

namespace UserManagement.CQRS.Repositories.Implementation
{
    public class OwnerAndControllerRepository : IOwnerAndControllerRepository
    {
        private readonly DatabaseContext _databaseContext;

        public OwnerAndControllerRepository(DatabaseContext databaseContext)
        {
            _databaseContext = databaseContext;
        }
        public Boolean IsNullorEmpty(Object data)
        {
            return data is null or (object)"";

        }

        public async Task<OwnersAndControllers> AddOwnerAndControllerAsync(RegisterControllerModel registerOwnerAndControllerModel)
        {
            try
            {
                UsersInfo userInfo = new UsersInfo();
                OwnersAndControllers ownersAndControllers = new OwnersAndControllers();
                userInfo.FirstName = registerOwnerAndControllerModel.FirstName;
                userInfo.LastName = registerOwnerAndControllerModel.LastName;
                userInfo.AddressLine1 = registerOwnerAndControllerModel.Address1;
                userInfo.AddressLine2 = registerOwnerAndControllerModel.Address2;
                userInfo.ZipCode = registerOwnerAndControllerModel.ZipCode;
                userInfo.State = registerOwnerAndControllerModel.State;
                userInfo.City = registerOwnerAndControllerModel.City;
                userInfo.DOB = registerOwnerAndControllerModel.DOB;
                ownersAndControllers.Title = registerOwnerAndControllerModel.Title;
                ownersAndControllers.BusinessId = (Guid)registerOwnerAndControllerModel.BusinessId;
                ownersAndControllers.CreatedDate = DateTime.Now;
                ownersAndControllers.IsDeleated = false;
                ownersAndControllers.IsUSPerson = false;
                if (registerOwnerAndControllerModel.UserType == UserTypeEnum.Owner)
                {
                    userInfo.DOB = registerOwnerAndControllerModel.DOB;
                    ownersAndControllers.Type = UserTypeEnum.Owner;
                }
                else
                {
                    ownersAndControllers.Type = UserTypeEnum.Controller;
                }

                if (registerOwnerAndControllerModel.IsUSPerson == 1)
                {
                    ownersAndControllers.IsUSPerson = true;
                    userInfo.SSN = registerOwnerAndControllerModel.SSN;
                }
                else
                {
                    ownersAndControllers.IsUSPerson = false;
                    userInfo.Country = registerOwnerAndControllerModel.Country;
                    ownersAndControllers.PassportNumber = registerOwnerAndControllerModel.PassportNumber;
                    ownersAndControllers.InsuranceCountry = registerOwnerAndControllerModel.IssuanceCountry;
                }
                userInfo.CreatedDate = DateTime.Now;
                UsersInfo SavedResponse = _databaseContext.Add(userInfo).Entity;
                await _databaseContext.SaveChangesAsync();
                ownersAndControllers.UserInfoId = SavedResponse.UserInfoId;
                _databaseContext.Add(ownersAndControllers);
                await _databaseContext.SaveChangesAsync();
                return ownersAndControllers;
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex);
                return null;
            }

        }

        public async Task<UsersModel> GetControllerByBusinessId(Guid BusinessId)
        {
            //var result = await _databaseContext.OwnersAndControllers.FirstOrDefaultAsync(x => x.BusinessId == BusinessId && x.Type==UserTypeEnum.Controller);
            UsersModel? result = await (from oc in _databaseContext.OwnersAndControllers
                                       join ui in _databaseContext.UsersInfo
                                       on oc.UserInfoId equals ui.UserInfoId
                                       where oc.BusinessId == BusinessId
                                       select new UsersModel
                                       {
                                           UserInfoId = ui.UserInfoId,
                                           AddressLine1 = ui.AddressLine1,
                                           AddressLine2 = ui.AddressLine2,
                                           City = ui.City,
                                           Country = ui.Country,
                                           DOB = ui.DOB,
                                           DwollaVerifcationToken = ui.DwollaVerifcationToken,
                                           DwollaVerificationStatus = ui.DwollaVerificationStatus,
                                           Email = ui.Email,
                                           FirstName = ui.FirstName,
                                           LastName = ui.LastName,
                                           SSN = ui.SSN,
                                           ProfileImageURL = ui.ProfileImageURL,
                                           State = ui.State,
                                           UserId = ui.UserId,
                                           ZipCode = ui.ZipCode,
                                       }).FirstOrDefaultAsync();
            return result;
        }

        public async Task<OwnersDetailModel> GetOwnersDetailByBusinessIdAndUserId(string businessId)
        {
            try
            {
                OwnersDetailModel ownerDetails = await (from bu in _databaseContext.Businesses
                                                        where bu.BusinessId.Equals(new Guid(businessId))
                                                        select new OwnersDetailModel
                                                        {
                                                            BusinessId = bu.BusinessId.ToString(),
                                                            UserId = bu.UserId.ToString(),
                                                            UserDetails = (from od in _databaseContext.OwnersAndControllers
                                                                           where od.BusinessId.Equals(new Guid(businessId)) && od.Type == UserTypeEnum.Owner
                                                                           join ui in _databaseContext.UsersInfo on od.UserInfoId equals ui.UserInfoId into oui
                                                                           from ui in oui.DefaultIfEmpty()
                                                                           select new UserDetailsModel
                                                                           {
                                                                               DwollaVerificationStatus = ui.DwollaVerificationStatus,
                                                                               FirstName = ui.FirstName,
                                                                               LastName = ui.LastName,
                                                                               UserType = od.Type,
                                                                               IsDeleated = od.IsDeleated,
                                                                               OwnerAndControllerId = od.OwnersAndControllersId,
                                                                               Title = od.Title,
                                                                               UserInfoId = ui.UserInfoId
                                                                           }).ToList()
                                                        }).FirstOrDefaultAsync();
                return ownerDetails;
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return null;
            }
        }

        public async Task<RegisterControllerModel> UpdateOwnerAndControllerDetails(RegisterControllerModel ownerAndControllerDetails)
        {
            try
            {
                OwnersAndControllers ownerAndControllerRecord = await _databaseContext.OwnersAndControllers.FirstOrDefaultAsync(x => x.UserInfoId == ownerAndControllerDetails.UserInfoId);
                if (ownerAndControllerRecord != null)
                {
                    if (!IsNullorEmpty(ownerAndControllerDetails.Title) && ownerAndControllerDetails.Title != ownerAndControllerRecord.Title)
                    {
                        ownerAndControllerRecord.Title = ownerAndControllerDetails.Title;
                    }
                    if (!IsNullorEmpty(ownerAndControllerDetails.PassportNumber) && ownerAndControllerDetails.PassportNumber != ownerAndControllerRecord.PassportNumber)
                    {
                        ownerAndControllerRecord.PassportNumber = ownerAndControllerDetails.PassportNumber;
                    }
                    if (!IsNullorEmpty(ownerAndControllerDetails.IssuanceCountry) && ownerAndControllerDetails.IssuanceCountry != ownerAndControllerRecord.InsuranceCountry)
                    {
                        ownerAndControllerRecord.InsuranceCountry = ownerAndControllerDetails.IssuanceCountry;
                    }
                    if (!IsNullorEmpty(ownerAndControllerDetails.IsUSPerson))
                    {
                        ownerAndControllerRecord.IsUSPerson = ownerAndControllerDetails.IsUSPerson == 1 ? true: false;
                    }
                    UsersInfo userInfoRecord = await _databaseContext.UsersInfo.FirstOrDefaultAsync(x => x.UserInfoId == ownerAndControllerDetails.UserInfoId);
                    if (!IsNullorEmpty(ownerAndControllerDetails.SSN) && ownerAndControllerDetails.SSN != userInfoRecord.SSN)
                    {
                        userInfoRecord.SSN = ownerAndControllerDetails.SSN;
                    }
                    if (!IsNullorEmpty(ownerAndControllerDetails.DOB) && ownerAndControllerDetails.DOB != userInfoRecord.DOB)
                    {
                        userInfoRecord.DOB = ownerAndControllerDetails.DOB;
                    }
                    if (!IsNullorEmpty(ownerAndControllerDetails.DOB) && ownerAndControllerDetails.DOB != userInfoRecord.DOB)
                    {
                        userInfoRecord.DOB = ownerAndControllerDetails.DOB;
                    }
                    if (!IsNullorEmpty(ownerAndControllerDetails.Address1) && ownerAndControllerDetails.Address1 != userInfoRecord.AddressLine1)
                    {
                        userInfoRecord.AddressLine1 = ownerAndControllerDetails.Address1;
                    }
                    if (!IsNullorEmpty(ownerAndControllerDetails.Address2) && ownerAndControllerDetails.Address2 != userInfoRecord.AddressLine2)
                    {
                        userInfoRecord.AddressLine2 = ownerAndControllerDetails.Address1;
                    }
                    if (!IsNullorEmpty(ownerAndControllerDetails.City) && ownerAndControllerDetails.City != userInfoRecord.City)
                    {
                        userInfoRecord.City = ownerAndControllerDetails.City;
                    }
                    if (!IsNullorEmpty(ownerAndControllerDetails.State) && ownerAndControllerDetails.State != userInfoRecord.State)
                    {
                        userInfoRecord.State = ownerAndControllerDetails.State;
                    }
                    if (!IsNullorEmpty(ownerAndControllerDetails.ZipCode) && ownerAndControllerDetails.ZipCode != userInfoRecord.ZipCode)
                    {
                        userInfoRecord.ZipCode = ownerAndControllerDetails.ZipCode;
                    }
                    if (!IsNullorEmpty(ownerAndControllerDetails.Country) && ownerAndControllerDetails.Country != userInfoRecord.Country)
                    {
                        userInfoRecord.Country = ownerAndControllerDetails.Country;
                    }
                    if (!IsNullorEmpty(ownerAndControllerDetails.FirstName) && ownerAndControllerDetails.FirstName != userInfoRecord.FirstName)
                    {
                        userInfoRecord.FirstName = ownerAndControllerDetails.FirstName;
                    }
                    if (!IsNullorEmpty(ownerAndControllerDetails.LastName) && ownerAndControllerDetails.LastName != userInfoRecord.LastName)
                    {
                        userInfoRecord.LastName = ownerAndControllerDetails.LastName;
                    }
                    _databaseContext.OwnersAndControllers.Update(ownerAndControllerRecord);
                    _databaseContext.UsersInfo.Update(userInfoRecord);
                    await _databaseContext.SaveChangesAsync();
                    return ownerAndControllerDetails;
                }
                return null;
            }
            catch (Exception ex) {
                Console.WriteLine(ex.Message);
                return null;
            }
        }

        public async Task<RegisterControllerModel> GetOwnerDetailsByUserInfoId(Guid userInfoId)
        {
            try
            {
                RegisterControllerModel OwnerDetails = await (from owc in _databaseContext.OwnersAndControllers
                                                              where owc.UserInfoId.Equals(userInfoId)
                                                              join ui in _databaseContext.UsersInfo on owc.UserInfoId equals ui.UserInfoId into oci
                                                              from ui in oci.DefaultIfEmpty()
                                                              select new RegisterControllerModel
                                                              {
                                                                  Title = owc.Title,
                                                                  FirstName = ui.FirstName,
                                                                  LastName = ui.LastName,
                                                                  Address1 = ui.AddressLine1,
                                                                  Address2 = ui.AddressLine2,
                                                                  City = ui.City,
                                                                  Country = ui.Country,
                                                                  DOB = ui.DOB,
                                                                  IssuanceCountry = owc.InsuranceCountry,
                                                                  OwnerAndControllerId = owc.OwnersAndControllersId,
                                                                  PassportNumber = owc.PassportNumber,
                                                                  SSN = ui.SSN,
                                                                  State = ui.State,
                                                                  ZipCode = ui.ZipCode,
                                                                  IsUSPerson = owc.IsUSPerson ? 1 : 0,
                                                                  UserType = owc.Type,
                                                                  BusinessId = owc.BusinessId,
                                                                  UserId = ui.UserId,
                                                                  UserInfoId = ui.UserInfoId
                                                              }).FirstOrDefaultAsync();
                return OwnerDetails;
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.ToString());
                return null;
            }

        }
    }
}
