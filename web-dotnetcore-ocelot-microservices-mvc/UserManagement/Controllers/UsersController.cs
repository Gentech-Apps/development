namespace UserManagement.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly IMediator _mediator;

        public UsersController(IMediator mediator)
        {
            _mediator = mediator;
        }
        [HttpGet]
        public async Task<IActionResult> GetUsers()
        {
            var token = Request.Headers["Authorization"].ToString().Replace("Bearer ", string.Empty);


            var handler = new JwtSecurityTokenHandler();
            var jsonToken = handler.ReadToken(token);
            var tokenS = jsonToken as JwtSecurityToken;

            var claims = tokenS.Claims;
            var identity = new ClaimsIdentity(claims); ;
            var principle = new ClaimsPrincipal(identity);
            var userId = principle.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var userName = principle.FindFirst(ClaimTypes.Role)?.Value;
            var userEmail = principle.FindFirst(ClaimTypes.Email)?.Value;

            var d = principle.Claims.ToArray();
            for (int i = 0; i < d.Length; i++)
            {
                Console.WriteLine(d[i] + " = " + d[i].Type + " = " + d[i].Value);

            }

            var responseData = await _mediator.Send(new GetUsersQuery());
            return Ok(responseData);
        }
        [HttpPost]
        public async Task<IActionResult> AddUsers(UsersModel userModel)
        {
            var responseData = await _mediator.Send(new AddUserCommand { userData = userModel });
            return Ok(responseData);
        }
        [HttpPost]
        [Route("GetUserById")]
        public async Task<IActionResult> GetUser([FromBody] UsersInfo userInfo)
        {
            try
            {
                var responseData = await _mediator.Send(new GetUserByIdQuery { UserId = (Guid)userInfo.UserId });
                if (responseData == null)
                {
                    Dictionary<string, string> errors = new Dictionary<string, string>();
                    errors.Add("message", "User dosen't Exists");
                    return Ok(errors);
                }
                else
                {
                    return Ok(responseData);
                }
            }
            catch (Exception ex)
            {
                Dictionary<string, string> errors = new Dictionary<string, string>();
                errors.Add("error", ex.Message);
                return Ok(errors);
            }
        }

        [HttpPost]
        [Route("AddThreshold")]
        public async Task<IActionResult> AddThreshold(Users user)
        {
            HelperMapper helperMapper = new HelperMapper();
            JsonResult jsonResult;
            UsersModel userData = await _mediator.Send(new GetUserByIdQuery { UserId = user.UserId });
            if (userData != null)
            {
                Users responseData = await _mediator.Send(new UpdateUserByUserIdCommand { });
                if (responseData != null)
                {
                    jsonResult = helperMapper.CreateJsonResponse(true, responseData, "MESSAGE.SUCCESS");
                }
                else
                {
                    jsonResult = helperMapper.CreateJsonResponse(false, null, "MESSAGE.NOT_FOUND");
                }
                return jsonResult;
            }
            else
            {
                return helperMapper.CreateJsonResponse(false, null, "MESSAGE.NOT_EXIST");
            }
        }

        [HttpPost]
        [Route("CreateIndividualLandlord")]
        public async Task<IActionResult> CreateIndividualLandlord(UsersInfo usersInfo)
        {
            HelperMapper helperMapper = new HelperMapper();
            JsonResult jsonResult;
            UsersInfo responseData = await _mediator.Send(new AddIndividualLandlordCommand { UserInfo = usersInfo });
            if (responseData != null)
            {
                jsonResult = helperMapper.CreateJsonResponse(true, responseData, "MESSAGE.SUCCESS");
            }
            else
            {
                jsonResult = helperMapper.CreateJsonResponse(false, null, "MESSAGE.NOT_FOUND");
            }
            return jsonResult;
        }

        [HttpPost]
        [Route("UpdateUserInfo")]
        public async Task<IActionResult> UpdateUserInfo(UsersInfo usersInfo)
        {
            HelperMapper helperMapper = new HelperMapper();
            JsonResult jsonResult;
            UsersInfo responseData = await _mediator.Send(new UpdateUserInfoCommand { UserInfo = usersInfo });
            if (responseData != null)
            {
                jsonResult = helperMapper.CreateJsonResponse(true, responseData, "MESSAGE.SUCCESS");
            }
            else
            {
                jsonResult = helperMapper.CreateJsonResponse(false, null, "MESSAGE.NOT_FOUND");
            }
            return jsonResult;
        }

        [HttpPost]
        [Route("UpdateUserByUserId")]
        public async Task<IActionResult> UpdateUsersInfoByUserId(Users user)
        {
            HelperMapper helperMapper = new HelperMapper();
            JsonResult jsonResult;
            Users responseData = await _mediator.Send(new UpdateUserByUserIdCommand { User = user });
            if (responseData != null)
            {
                jsonResult = helperMapper.CreateJsonResponse(true, responseData, "MESSAGE.SUCCESS");
            }
            else
            {
                jsonResult = helperMapper.CreateJsonResponse(false, null, "MESSAGE.NOT_FOUND");
            }
            return jsonResult;
        }

        [HttpGet]
        [Route("GetUserInfoByUserId")]
        public async Task<IActionResult> GetUserInfoByUserId(Guid userId)
        {
            HelperMapper helperMapper = new HelperMapper();
            JsonResult jsonResult;
            UsersInfo responseData = await _mediator.Send(new GetUserInfoByUserIdQuery { UserId = userId });
            if (responseData != null)
            {
                jsonResult = helperMapper.CreateJsonResponse(true, responseData, "MESSAGE.SUCCESS");
            }
            else
            {
                jsonResult = helperMapper.CreateJsonResponse(false, null, "MESSAGE.NOT_FOUND");
            }
            return jsonResult;
        }
    }
}
