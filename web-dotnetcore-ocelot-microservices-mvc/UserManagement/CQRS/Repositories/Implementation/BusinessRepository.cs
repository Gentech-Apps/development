namespace UserManagement.CQRS.Repositories.Implementation
{
    public class BusinessRepository: IBusinessRepository
    {
        private readonly DatabaseContext _databaseContext;

        public BusinessRepository(DatabaseContext databaseContext)
        {
            _databaseContext = databaseContext;
        }

        public async Task<Business> GetBusinessByBusinessIdAndUserIdAsync(string businessId, string userId)
        {
            var result = await _databaseContext.Businesses.FirstOrDefaultAsync(x => x.BusinessId.ToString().Equals(businessId) && x.UserId.ToString().Equals(userId));
            return result;
        }

        public async Task<Business> RegisterBusinessAsync(RegisterBusinessModel registerBusinessModel)
        {
            try {
                UsersInfo userInfo = new UsersInfo();
                //if sole business then send businedd verification request to dwolla
                if (registerBusinessModel.BusinessType == BusinessTypeEnum.SolePartnership || registerBusinessModel.BusinessType == BusinessTypeEnum.Trust || registerBusinessModel.BusinessType == BusinessTypeEnum.Unicorporatedassociation)
                {
                    CreateCustomerRequest request = new CreateCustomerRequest();
                    request.FirstName = registerBusinessModel.FirstName;
                    request.LastName = registerBusinessModel.LastName;
                    request.Email = registerBusinessModel.Email;
                    request.Type = "business";
                    int year = DateTime.Parse(registerBusinessModel.OwnerDOB.ToString()).Year;
                    int month = DateTime.Parse(registerBusinessModel.OwnerDOB.ToString()).Month;
                    int day = DateTime.Parse(registerBusinessModel.OwnerDOB.ToString()).Day;
                    request.DateOfBirth = new DateTime(year, month, day);
                    request.Ssn = registerBusinessModel.OwnerSSN;
                    request.Address1 = registerBusinessModel.BusinessAddress;
                    request.Address2 = registerBusinessModel.BusinessAddress2;
                    request.City = registerBusinessModel.City;
                    request.State = registerBusinessModel.State;
                    request.PostalCode = registerBusinessModel.ZipCode;
                    request.BusinessName = registerBusinessModel.BusinessName;
                    request.BusinessType = "soleProprietorship";
                    request.BusinessClassification = "9ed3f666-7d6f-11e3-9a8d-5404a6144203";
                    DwollaOperation operations = new DwollaOperation();
                    var location = await operations.CreateVerifiedCustomer(request);
                    userInfo.DwollaVerifcationToken = location["value"].ToString();
                    var status = await operations.GetVerificationStatusCustomer(location["value"]);
                    userInfo.DwollaVerificationStatus = status.ToString();
                }

                userInfo.Email = registerBusinessModel.Email;
                userInfo.FirstName = registerBusinessModel.FirstName;   
                userInfo.LastName = registerBusinessModel.LastName; 
                userInfo.AddressLine1 =  registerBusinessModel.BusinessAddress;
                userInfo.AddressLine2 = registerBusinessModel.BusinessAddress2;
                userInfo.City = registerBusinessModel.City;
                userInfo.State = registerBusinessModel.State;
                userInfo.ZipCode = registerBusinessModel.ZipCode;
                userInfo.CreatedDate = DateTime.Now;
                userInfo.UserId= registerBusinessModel.UserId;
                Business business = new Business();
                if (registerBusinessModel.BusinessType == BusinessTypeEnum.SolePartnership || registerBusinessModel.BusinessType == BusinessTypeEnum.Trust || registerBusinessModel.BusinessType == BusinessTypeEnum.Unicorporatedassociation)
                {
                    userInfo.DOB = registerBusinessModel.OwnerDOB;
                    userInfo.SSN = registerBusinessModel.OwnerSSN;
                }
                else {
                    business.BusinessEIN = registerBusinessModel.BusinessEIN;
                }
                UsersInfo SavedResponse = _databaseContext.Add(userInfo).Entity;
                await _databaseContext.SaveChangesAsync();

                if (SavedResponse !=null) {
                    business.CreatedDate = DateTime.Now;
                    business.BusinessName = registerBusinessModel.BusinessName;
                    business.UserInfoId = SavedResponse.UserInfoId;
                    business.UserId = registerBusinessModel.UserId;
                    business.BusinessType = registerBusinessModel.BusinessType;
                    _databaseContext.Add(business);
                    await _databaseContext.SaveChangesAsync();
                    
                    return business;
                }
                return null;
            }
            catch (Exception ex)
            {
                return null;
            }
        }
        public async Task<BusinessDetailsModel> GetBusinessDetailsByUserId(Guid UserId)
        {
            try
            {
                Users userRecord = await _databaseContext.Users.FirstOrDefaultAsync(x => x.UserId == UserId);
                BusinessDetailsModel? businessDetailsModel = new BusinessDetailsModel();
                if (userRecord.Role.Equals("landlord")) {
                    if ((bool)userRecord.IsIndividual)
                    {
                        businessDetailsModel = await (from user in _databaseContext.Users
                                                                           where user.UserId.Equals(UserId)
                                                                           join ui in _databaseContext.UsersInfo on user.UserId equals ui.UserId into uif
                                                                           from ui in uif.DefaultIfEmpty()
                                                                           select new BusinessDetailsModel
                                                                           {
                                                                               SSN = ui.SSN,
                                                                               FirstName = ui.FirstName,
                                                                               LastName = ui.LastName,
                                                                               Email = ui.Email,
                                                                               Phone = user.PhoneNumber,
                                                                               IsIndividual = true, 
                                                                               ThresholdAmt = (from user in _databaseContext.Users
                                                                                               where user.UserId == ui.UserId
                                                                                               select user.Threshold).First()
                                                                           }).FirstOrDefaultAsync();
                    }
                    else {
                        businessDetailsModel = await (from bu in _databaseContext.Businesses
                                                                           where bu.UserId.Equals(UserId)
                                                                           join user in _databaseContext.Users on bu.UserId equals user.UserId
                                                                           join ui in _databaseContext.UsersInfo on bu.UserInfoId equals ui.UserInfoId into buin
                                                                           from ui in buin.DefaultIfEmpty()
                                                                           select new BusinessDetailsModel
                                                                           {
                                                                               BusinessEIN = bu.BusinessEIN,
                                                                               BusinessName = bu.BusinessName,
                                                                               FirstName = ui.FirstName,
                                                                               LastName = ui.LastName,
                                                                               IsIndividual = false,
                                                                               BusinessType = bu.BusinessType,
                                                                               Email = ui.Email,
                                                                               Phone = user.PhoneNumber,
                                                                               BusinessId =  bu.BusinessId,
                                                                               ThresholdAmt = (from user in _databaseContext.Users
                                                                                               where user.UserId == bu.UserId
                                                                                               select user.Threshold).First()
                                                                           }).FirstOrDefaultAsync();
                    }
                }
                return businessDetailsModel;
            }
            catch (Exception ex)
            {
                return null;
            }
        }
    }
}
