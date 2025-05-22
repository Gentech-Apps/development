using Microsoft.Extensions.Configuration;
using NotificationsMicroservice.Utils.configuration;
using Shared.Models;
using System;
using Twilio;
using Twilio.Rest.Api.V2010.Account;
using Twilio.Types;

namespace NotificationsMicroservice.Utils.SMSHandler
{
    public class SMSHandler
    {
        private readonly IConfiguration config;

        public SMSHandler()
        {
        }

        public SMSHandler(IConfiguration iConfig)
        {
            config = iConfig;
        }

        public async Task<String> SendSMSAsync(SMSNotificationData data)
        {
            var configuration = new ConfigurationBuilder()
            .AddJsonFile("appsettings.json")
                .Build();
            string accountSid = configuration.GetValue<string>("TwilioConfigurations:accountSid");
            string authToken = configuration.GetValue<string>("TwilioConfigurations:authToken");
            string fromPhoneNumber = configuration.GetValue<string>("TwilioConfigurations:fromPhoneNumber");
            string toPhoneNumber = data.phoneNumber;
            string smsContent = data.message;
            TwilioClient.Init(accountSid, authToken);
            var messageOptions = new CreateMessageOptions(new PhoneNumber(toPhoneNumber));
            messageOptions.From = new PhoneNumber(fromPhoneNumber);
            messageOptions.Body = smsContent;
            var message = MessageResource.Create(messageOptions);
            Console.WriteLine(message.Body);
            //return message.ToString();
            return "SMS sent succesfully";
        }
    }
}
