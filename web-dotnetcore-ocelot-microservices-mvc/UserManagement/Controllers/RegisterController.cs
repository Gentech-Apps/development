namespace UserManagement.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RegisterController : ControllerBase
    {
        private readonly IMediator _mediator;
        private readonly JwtTokenHandler _jwtTokenHandler;
        public RegisterController(IMediator mediator, JwtTokenHandler jwtTokenHandler)
        {
            _jwtTokenHandler = jwtTokenHandler;
            _mediator = mediator;
        }

        [HttpPost]
        public async Task<ActionResult<AuthenticationResponse?>> RegisterUser(RegisterUserModel registerUserModel)
        {
            Users ifUserExists = await _mediator.Send(new GetUserByEmailQuery { Email = registerUserModel.Email });
            if(ifUserExists == null)
            {
                UserAccount responseData = await _mediator.Send(new RegisterUserCommand { registerUserData = registerUserModel });
                var authenticationResponse = _jwtTokenHandler.GenerateJwtToken(responseData);
                if (authenticationResponse == null)
                {
                    return Unauthorized();
                }
                return authenticationResponse;
            }
            else
            {
                Dictionary<String,String> responseData = new Dictionary<string, string> ();
                responseData.Add("Message", "User Already Exists");
                return Ok(responseData);
            }
        }
    }
}
