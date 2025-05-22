using MassTransit;
using NotificationsMicroservice.Utils.EmailHandler;
using NotificationsMicroservice.Utils.SMSHandler;
using Shared.Models;

namespace NotificationsMicroservice.Consumers
{
    public class SendEmailConsumer : IConsumer<SMSNotificationData>
    {
        public async Task Consume(ConsumeContext<SMSNotificationData> context)
        {
            var data = context.Message;
            Console.WriteLine(data);
            EmailHandler emailHandler = new EmailHandler();
            var result = await emailHandler.SendEmailAsync();
        }

    }
}
