using Microsoft.AspNetCore.Mvc;
using NotificationsMicroservice.CQRS.Models;
using NotificationsMicroservice.Utils.EmailHandler;

namespace NotificationsMicroservice.Controllers
{
    [Route("api/[controller]")]
    public class SendEmailController : ControllerBase
    {

        [HttpPost]
        public async Task<ActionResult<String>> SendEmail([FromBody] EmailModel emailBody)
        {
            EmailHandler emailHandler = new EmailHandler();
            var result = await emailHandler.SendEmailAsync();
            return Ok(result);

        }
    }
}
