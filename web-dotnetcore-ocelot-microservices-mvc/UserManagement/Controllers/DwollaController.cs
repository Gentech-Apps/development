
using Microsoft.AspNetCore.StaticFiles;
using File = UserManagement.DwollaOperations.File;

namespace UserManagement.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DwollaController : ControllerBase
    {
        private readonly IMediator _mediator;

        public DwollaController(IMediator mediator)
        {
            _mediator = mediator;
        }

        [HttpPost]
        [Route("GetVerificationStatus")]
        public async Task<IActionResult> GetVerificationStatus(VerificationStatusRequestModel requestModel)
        {
            HelperMapper helperMapper = new HelperMapper();
            JsonResult jsonResult;
            DwollaOperation operation = new DwollaOperation();

            switch (requestModel.Type)
            {
                case "Customer":
                    UsersInfo userInfoRecord = new UsersInfo();
                    if (requestModel.LandlordType.Equals("business"))
                    {
                        if (requestModel.Benificary == UserTypeEnum.Controller)
                        {
                            userInfoRecord = await _mediator.Send(new GetControllerDetailsByUserIdQuery { UserId = requestModel.UserId });
                        }
                        else
                        {
                            userInfoRecord = await _mediator.Send(new GetOwnerDetailsByUserIdQuery { UserId = requestModel.UserId });
                        }
                    }
                    else if (requestModel.LandlordType.Equals("businessSolo") || requestModel.LandlordType.Equals("individual"))
                    {
                        userInfoRecord = await _mediator.Send(new GetUserInfoByUserIdQuery { UserId = requestModel.UserId });
                    }

                    if (userInfoRecord != null)
                    {
                        string customerStatus = await operation.GetVerificationStatusCustomer(userInfoRecord.DwollaVerifcationToken);
                        jsonResult = helperMapper.CreateJsonResponse(true, customerStatus, "MESSAGE.SUCCESS");
                    }
                    else
                    {
                        jsonResult = helperMapper.CreateJsonResponse(false, null, "MESSAGE.NOT_FOUND");
                    }
                    return jsonResult;

                case "Bank":
                    UsersInfo userInfoRec = new UsersInfo();
                    if (requestModel.LandlordType.Equals("business"))
                    {
                        if (requestModel.Benificary == UserTypeEnum.Controller)
                        {
                            userInfoRec = await _mediator.Send(new GetControllerDetailsByUserIdQuery { UserId = requestModel.UserId });
                        }
                        else
                        {
                            userInfoRecord = await _mediator.Send(new GetOwnerDetailsByUserIdQuery { UserId = requestModel.UserId });
                        }
                    }
                    else if (requestModel.LandlordType.Equals("businessSolo") || requestModel.LandlordType.Equals("individual"))
                    {
                        userInfoRec = await _mediator.Send(new GetUserInfoByUserIdQuery { UserId = requestModel.UserId });
                    }
                    if (userInfoRec != null)
                    {
                        FundingSource fundingSourceRecord = await _mediator.Send(new GetFundingSourceByUserInfoIdQuery { UserInfoId = userInfoRec.UserInfoId.ToString() });
                        string customerStatus = await operation.GetVerificationStatusCustomer(fundingSourceRecord.FundingSourceDwollaToken);
                        jsonResult = helperMapper.CreateJsonResponse(true, customerStatus, "MESSAGE.SUCCESS");
                    }
                    else
                    {
                        jsonResult = helperMapper.CreateJsonResponse(false, null, "MESSAGE.NOT_FOUND");
                    }
                    return jsonResult;
            }
            return null;
        }


        [HttpPost]
        [Route("UploadDocumentForCustomerVerification")]
        public async Task<IActionResult> UploadDocumentForCustomerVerification([FromForm] DocumentVerificationRequestModel request)
        {
            HelperMapper helperMapper = new HelperMapper();
            JsonResult jsonResult = null;
            //getuserinfoby userid
            // case 1 if owner type is individual or sole property
            UsersModel userInfo;
            if (request.LandlordType.Equals("businessSolo") || request.LandlordType.Equals("individual"))
            {
                //get userinfo by userid
                userInfo = await _mediator.Send(new GetUserByIdQuery { UserId = request.UserId });
            }
            else
            {
                userInfo = await _mediator.Send(new GetControllerDetailsByUserIdQuery { UserId = request.UserId });
            }
            //Create
            DwollaOperation dwollaOperation = new DwollaOperation();
                UploadDocumentRequest docRequest = new UploadDocumentRequest();
                switch (request.DocumentType)
                {
                    case DocumentTypeEnum.license:
                        docRequest.DocumentType = "license";
                        break;
                    case DocumentTypeEnum.passport:
                        docRequest.DocumentType = "passport";
                        break;
                    case DocumentTypeEnum.idCard:
                        docRequest.DocumentType = "idCard";
                        break;
                    case DocumentTypeEnum.other:
                        docRequest.DocumentType = "other";
                        break;
                    default:
                        docRequest.DocumentType = "other";
                        break;
                }
                new FileExtensionContentTypeProvider().TryGetContentType(request.File.FileName, out string contentType);
                var memoryStream = new MemoryStream();
                await request.File.CopyToAsync(memoryStream);
                memoryStream.Seek(0, SeekOrigin.Begin);
                docRequest.Document = new File
                {

                    ContentType = contentType,
                    Filename = request.File.FileName,
                    Stream = memoryStream
                };
                var location = await dwollaOperation.UploadCustomerVerificationDocument(userInfo.DwollaVerifcationToken, docRequest);
                if (location["response"].Equals("false"))
                {
                    return jsonResult = helperMapper.CreateJsonResponse(false, null, location["value"]);
                }
                else 
                {
                    var satatus = await dwollaOperation.GetVerificationStatusCustomer(location["value"].ToString());
                    //insert the data in DB Document table
                    DwollaVerificationDocuments data = new DwollaVerificationDocuments();
                    data.DocumentURL = request.s3documentUrl;
                    data.DocumentType = request.DocumentType;
                    data.DwollaDocumentStatus = satatus;
                    data.DwollaDocumentToken = location.ToString();
                    data.UserInfoId = userInfo.UserInfoId;
                    var result = await _mediator.Send(new AddDwollaDocumentCommand { documentsData = data });
                    jsonResult = helperMapper.CreateJsonResponse(true, result, "MESSAGE.SUCCESS");
                    return jsonResult;
                }
        }
    }
}
