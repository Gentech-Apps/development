namespace UserManagement.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BusinessController : ControllerBase
    {
        private readonly IMediator _mediator;

        public BusinessController(IMediator mediator)
        {
            _mediator = mediator;
        }

        [HttpPost]
        public async Task<IActionResult> RegisterBusiness(RegisterBusinessModel registerBusinessModel)
        {
            UsersInfo ifUserExists = await _mediator.Send(new GetBusinessByEmailQuery { Email = registerBusinessModel.Email });
            HelperMapper helperMapper = new HelperMapper();
            JsonResult jsonResult;
            if (ifUserExists == null)
            {
                Business responseData = await _mediator.Send(new RegisterBusinessCommand { registerBusinessModel = registerBusinessModel });
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
                return jsonResult = helperMapper.CreateJsonResponse(false, null, "MESSAGE.ALREADY_EXIST");
            }

        }

        [HttpGet]
        [Route("GetBusinessDetailsByUserId")]
        public async Task<IActionResult> GetBusinessDetailsByUserId(Guid UserId)
        {
            UsersModel userRecord = await _mediator.Send(new GetUserByIdQuery { UserId = UserId });
            HelperMapper helperMapper = new HelperMapper();
            JsonResult jsonResult;
            if (userRecord != null)
            {
                BusinessDetailsModel businessDetails = await _mediator.Send(new GetBusinessDetailsByUserIdQuery { UserId = UserId });
                if (businessDetails != null)
                {
                    jsonResult = helperMapper.CreateJsonResponse(true, businessDetails, "MESSAGE.SUCCESS");
                }
                else
                {
                    jsonResult = helperMapper.CreateJsonResponse(false, null, "MESSAGE.NOT_FOUND");
                }
                return jsonResult;
            }
            else
            {
                jsonResult = helperMapper.CreateJsonResponse(false, null, "MESSAGE.NOT_FOUND");
            }
            return jsonResult;
        }
    }
}
