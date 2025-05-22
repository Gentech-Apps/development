using MassTransit;
using NotificationsMicroservice.Utils.SMSHandler;
using Shared.Models;

namespace NotificationsMicroservice.Consumers
{
    public class SendSMSConsumer : IConsumer<SMSNotificationData>
    {
        public async Task Consume(ConsumeContext<SMSNotificationData> context)
        {
            SMSNotificationData data = context.Message;
            Console.WriteLine(data);
            SMSHandler smsHandler = new SMSHandler();
            var result = await smsHandler.SendSMSAsync(data);
            Console.WriteLine(result);
        }

    }
}
