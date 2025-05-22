using UserManagement.DwollaOperations.Model.Response;

namespace UserManagement.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class OwnerAndControllerController : ControllerBase
    {
        private readonly IMediator _mediator;

        public OwnerAndControllerController(IMediator mediator)
        {
            _mediator = mediator;
        }

        [HttpPost]
        [Route("RegisterController")]
        public async Task<IActionResult> RegisterController(RegisterControllerModel registerControllerModel)
        {
            Business businessRecord = await _mediator.Send(new GetBusinessByBusinessIdAndUserIdQuery { BusinessId = registerControllerModel.BusinessId.ToString(), UserId = registerControllerModel.UserId.ToString() });
            HelperMapper helperMapper = new HelperMapper();
            JsonResult jsonResult;
            if (businessRecord != null)
            {
                //prepare controller and business data  to verify user in dwolla

                UsersModel model = await _mediator.Send(new GetUserByIdQuery { UserId = (Guid)registerControllerModel.UserId });
                CreateCustomerRequest request = new CreateCustomerRequest();
                request.FirstName= model.FirstName;
                request.LastName= model.LastName;
                request.Email= model.Email;
                request.Type = "business";
                request.Address1 = model.AddressLine1;
                request.Address2 = model.AddressLine2;
                request.City= model.City;
                request.State = model.State;
                request.PostalCode = model.ZipCode;
                request.BusinessName = businessRecord.BusinessName;
                switch (businessRecord.BusinessType)
                {
                    case BusinessTypeEnum.LLCs:
                        request.BusinessType = "llc";
                        break;
                    case BusinessTypeEnum.Corportation:
                        request.BusinessType = "corporation";
                        break;
                    case BusinessTypeEnum.NonProfits:
                        request.BusinessType = "corporation";
                        break;
                    case BusinessTypeEnum.Publiclytradedcorporations:
                        request.BusinessType = "corporation";
                        break;
                    case BusinessTypeEnum.Partnership:
                        request.BusinessType = "partnership";
                        break;
                    default:
                        request.BusinessType = "llc";
                        break;
                 }
                request.BusinessClassification = "9ed3f666-7d6f-11e3-9a8d-5404a6144203";
                request.Ein = businessRecord.BusinessEIN;
                DwollaOperations.Controller controller = new DwollaOperations.Controller();
                controller.FirstName = registerControllerModel.FirstName;
                controller.LastName = registerControllerModel.LastName;
                controller.Title = registerControllerModel.Title;
                DateTime dt = (DateTime)registerControllerModel.DOB;
                controller.DateOfBirth = DateTime.Parse(dt.ToString());
                controller.Ssn = registerControllerModel.SSN;
                Address address = new Address()
                {
                    Address1 = registerControllerModel.Address1,
                    Address2 = registerControllerModel.Address2,
                    City = registerControllerModel.City,
                    StateProvinceRegion = registerControllerModel.State,
                    PostalCode = registerControllerModel.ZipCode,
                    Country = registerControllerModel.Country
                };

                // passport object for non US Person
                if (registerControllerModel.IsUSPerson == 0)
                {
                    Passport passport = new Passport();
                    passport.Number = registerControllerModel.PassportNumber;
                    passport.Country = registerControllerModel.IssuanceCountry;
                    controller.Passport = passport;
                }
                controller.Address = address;
                request.Controller= controller;
                DwollaOperation customersOperations = new DwollaOperation();
                    var location = await customersOperations.CreateVerifiedCustomer(request);
                    if (location["response"].Equals("false")) {
                        return jsonResult = helperMapper.CreateJsonResponse(false, null, location["value"]);
                    }
                // add location and status in DB

                var status = await customersOperations.GetVerificationStatusCustomer(location["value"]);
                OwnersAndControllers responseData = await _mediator.Send(new AddControllerCommand { RegisterOwnerAndControllerModel = registerControllerModel });
                UsersInfo userInfo = new UsersInfo();
                userInfo.UserInfoId = responseData.UserInfoId;
                userInfo.DwollaVerifcationToken = location["value"];
                userInfo.DwollaVerificationStatus = status;
                await _mediator.Send(new UpdateUserInfoCommand { UserInfo = userInfo });

                if (responseData != null)
                {
                    jsonResult = helperMapper.CreateJsonResponse(true, responseData, "MESSAGE.SUCCESS");
                }
                else
                {
                    jsonResult = helperMapper.CreateJsonResponse(false, responseData, "MESSAGE.NOT_FOUND");
                }
                return jsonResult;
            }
            else
            {
                return jsonResult = helperMapper.CreateJsonResponse(false, null, "MESSAGE.NOT_FOUND");
            }

        }

        [HttpPost]
        [Route("RegisterBeneficialOwner")]
        public async Task<IActionResult> RegisterBeneficialOwner(RegisterControllerModel registerControllerModel)
        {
            Business businessRecord = await _mediator.Send(new GetBusinessByBusinessIdAndUserIdQuery { BusinessId = registerControllerModel.BusinessId.ToString(), UserId = registerControllerModel.UserId.ToString() });
            HelperMapper helperMapper = new HelperMapper();
            JsonResult jsonResult;
            if (businessRecord != null)
            {
                //prepare controller and business data  to verify user in dwolla

                UsersModel model = await _mediator.Send(new GetControllerByBusinessIdQuery { BusinessId = (Guid)registerControllerModel.BusinessId });
                
                CreateBeneficialOwnerRequest request = new CreateBeneficialOwnerRequest();
                request.FirstName = registerControllerModel.FirstName;
                request.LastName = registerControllerModel.LastName;
                request.Ssn = registerControllerModel.SSN;
                request.DateOfBirth = new DateTime(DateTime.Parse(registerControllerModel.DOB.ToString()).Year, DateTime.Parse(registerControllerModel.DOB.ToString()).Month, DateTime.Parse(registerControllerModel.DOB.ToString()).Day);
                Address address = new Address()
                {
                    Address1 = registerControllerModel.Address1,
                    Address2 = registerControllerModel.Address2,
                    City = registerControllerModel.City,
                    StateProvinceRegion = registerControllerModel.State,
                    PostalCode = registerControllerModel.ZipCode,
                    Country = registerControllerModel.Country
                };
                request.Address = address;

                // passport object for non US Person
                if (registerControllerModel.IsUSPerson == 0)
                {
                    Passport passport = new Passport();
                    passport.Number = registerControllerModel.PassportNumber;
                    passport.Country = registerControllerModel.IssuanceCountry;
                    request.Passport = passport;
                }       
                DwollaOperation customersOperations = new DwollaOperation();
                var location = await customersOperations.CreateBeneficialOwner(request, model.DwollaVerifcationToken);
                if (location["response"].Equals("false"))
                {
                    return jsonResult = helperMapper.CreateJsonResponse(false, null, location["value"]);
                }
                // add location and status in DB

                var status = await customersOperations.GetVerificationStatusCustomer(location["value"]);
                OwnersAndControllers responseData = await _mediator.Send(new AddControllerCommand { RegisterOwnerAndControllerModel = registerControllerModel });
                UsersInfo userInfo = new UsersInfo();
                userInfo.UserInfoId = responseData.UserInfoId;
                userInfo.DwollaVerifcationToken = location["value"];
                userInfo.DwollaVerificationStatus = status;
                await _mediator.Send(new UpdateUserInfoCommand { UserInfo = userInfo });

                if (responseData != null)
                {
                    jsonResult = helperMapper.CreateJsonResponse(true, responseData, "MESSAGE.SUCCESS");
                }
                else
                {
                    jsonResult = helperMapper.CreateJsonResponse(false, responseData, "MESSAGE.NOT_FOUND");
                }
                return jsonResult;
            }
            else
            {
                return jsonResult = helperMapper.CreateJsonResponse(false, null, "MESSAGE.NOT_FOUND");
            }

        }

        [HttpPost]
        [Route("GetOwnerDetailsByBusinessIdAndUserId")]
        public async Task<IActionResult> GetAllOwnerByBusinessIdAndUserId(string BusinessId, string UserId)
        {
            Business businessRecord = await _mediator.Send(new GetBusinessByBusinessIdAndUserIdQuery { BusinessId = BusinessId, UserId = UserId });
            HelperMapper helperMapper = new HelperMapper();
            JsonResult jsonResult;
            if (businessRecord != null)
            {
                OwnersDetailModel responseData = await _mediator.Send(new GetOwnersByBusinessIdAndUserIdQuery { BusinessId = BusinessId });
                if (responseData != null)
                {
                    jsonResult = helperMapper.CreateJsonResponse(true, responseData, "MESSAGE.SUCCESS");
                }
                else
                {
                    jsonResult = helperMapper.CreateJsonResponse(false, responseData, "MESSAGE.NOT_FOUND");
                }
                return jsonResult;
            }
            else
            {
                return jsonResult = helperMapper.CreateJsonResponse(false, null, "MESSAGE.NOT_EXIST");
            }

        }

        [HttpPost]
        [Route("UpdateOwnerDetails")]
        public async Task<IActionResult> UpdateOwnerDetails(RegisterControllerModel OwnerAndControllerDetails)
        {
            HelperMapper helperMapper = new HelperMapper();
            JsonResult jsonResult;
            RegisterControllerModel responseData = await _mediator.Send(new UpdateOwnerDetailsByUserInfoIdCommand { OwnerAndControllerDetails = OwnerAndControllerDetails });
                if (responseData != null)
                {
                    jsonResult = helperMapper.CreateJsonResponse(true, responseData, "MESSAGE.SUCCESS");
                }
                else
                {
                    jsonResult = helperMapper.CreateJsonResponse(false, responseData, "MESSAGE.NOT_FOUND");
                }
            return jsonResult;
        }

        [HttpGet]
        [Route("GetOwnerDetailsByUserInfoId")]
        public async Task<IActionResult> GetOwnerDetailsByUserInfoId(Guid UserInfoId) {
            HelperMapper helperMapper = new HelperMapper();
            JsonResult jsonResult;
            RegisterControllerModel responseData = await _mediator.Send(new GetOwnerDetailsByUserInfoIdQuery { UserInfoId = UserInfoId });
            if (responseData != null)
            {
                jsonResult = helperMapper.CreateJsonResponse(true, responseData, "MESSAGE.SUCCESS");
            }
            else
            {
                jsonResult = helperMapper.CreateJsonResponse(false, responseData, "MESSAGE.NOT_FOUND");
            }
            return jsonResult;
        }
    }
}
