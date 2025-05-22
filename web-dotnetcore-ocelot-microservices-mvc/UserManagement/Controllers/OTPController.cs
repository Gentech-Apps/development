using MassTransit;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Shared.Models;
using UserManagement.database;

namespace UserManagement.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class OTPController : ControllerBase
    {
        private readonly IMediator _mediator;
        private readonly IBus _bus;
        public OTPController(IMediator mediator, IBus bus)
        { 
            _mediator = mediator;
            _bus = bus;
        }

        [HttpPost]
        [Route("GenerateOTP")]
        public async Task<IActionResult> GenerateOTP([FromBody] Users user)
        {
            await _mediator.Send(new UpdateUserByUserIdCommand { User = user });
            var responseData = await _mediator.Send(new GenerateOTPCommand { userID = user.UserId });
            SMSNotificationData notificationData = new SMSNotificationData();
            notificationData.phoneNumber = user.PhoneNumber;
            notificationData.message = responseData;
            Uri uri = new Uri("rabbitmq://rqbbitmq/NotificationQueue");
            var endPoint = await _bus.GetSendEndpoint(uri);
            await endPoint.Send(notificationData);

            return Ok(responseData);
        }

        [HttpPost]
        [Route("VerifyOTP")]
        public async Task<IActionResult> VerifyOTP(string userID, string OTP)
        {
            bool responseData = await _mediator.Send(new VerifyOTPCommand { userID = userID, OTP = OTP });
            Dictionary<String, Boolean> data = new Dictionary<string, Boolean>();
            data.Add("message", responseData);
            return Ok(data);
        }
    }
}
