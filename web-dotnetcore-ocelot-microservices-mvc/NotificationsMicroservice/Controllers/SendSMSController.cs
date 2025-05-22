using Microsoft.AspNetCore.Mvc;
using NotificationsMicroservice.CQRS.Models;
using NotificationsMicroservice.Utils.SMSHandler;
using Shared.Models;

namespace NotificationsMicroservice.Controllers
{
    [Route("api/[controller]")]
    public class SendSMSController : ControllerBase
    {
        [HttpPost]
        public async Task<ActionResult<String>> SendSMS([FromBody] SMSModel smsModel)
        {
            SMSNotificationData data = new SMSNotificationData();
            data.phoneNumber = smsModel.phoneNumber;
            data.message = smsModel.message;
            SMSHandler smsHandler = new SMSHandler();
            var result = await smsHandler.SendSMSAsync(data);
            return new JsonResult(result);
        }
    }
}
