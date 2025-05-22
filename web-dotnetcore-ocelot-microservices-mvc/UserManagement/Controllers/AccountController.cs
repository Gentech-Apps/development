using JwtAuthanticationManager;
using JwtAuthanticationManager.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using UserManagement.CQRS.Models;

namespace UserManagement.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AccountController : ControllerBase
    {
        private readonly JwtTokenHandler _jwtTokenHandler;
        private readonly IMediator _mediator;

        public AccountController(IMediator mediator, JwtTokenHandler jwtTokenHandler)
        {
            _jwtTokenHandler = jwtTokenHandler;
            _mediator = mediator;
        }
        [HttpPost]
        public async Task<ActionResult<AuthenticationResponse?>> Authanticate([FromBody] AuthenticationRequest authenticationRequest)
        {
            UserAccount userAccount = await _mediator.Send(new GetLoginDataQuery{ QueryRequest = authenticationRequest});

         if ( userAccount != null )
            {
                if (userAccount.IsActive)
                {
                    var authenticationResponse = _jwtTokenHandler.GenerateJwtToken(userAccount);
                    if (authenticationResponse == null)
                    {
                        return Unauthorized();
                    }
                    return authenticationResponse;
                }
                else
                {
                    Dictionary<string, string> returnMe = new Dictionary<string, string>();
                    returnMe.Add("message", "User is blocked");
                    return Ok(returnMe);
                }
            }
            else
            {
                return Unauthorized();
            }
        }

        [HttpPost]
        [Route("GetActiveStepByUserId")]
        public async Task<ActionResult> ActiveStep(String UserId)
        {
            string result = await _mediator.Send(new GetLastActiveStepQuery { userId = new Guid(UserId) });

            return Ok(result);
        }
    }
}

