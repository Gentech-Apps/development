using Microsoft.OpenApi.Models;
using RabbitMQ.Client;
using RestSharp;
using RestSharp.Authenticators;
using System;
namespace NotificationsMicroservice.Utils.EmailHandler
{
    public class EmailHandler
    {
        private const string APIKey = "";
        private const string Domain = "";
        private const string SenderAddress = "";
        private const string SenderDisplayName = "Sender Name";
        private const string BaseUri = "https://api.mailgun.net/v3";
        public async Task<String> SendEmailAsync()
        {

            //var options = new RestClientOptions(BaseUri)
            //{
            //    ThrowOnAnyError = true
            //};
            //RestClient client = new RestClient(options);
            //client.Authenticator = new HttpBasicAuthenticator("api", APIKey);
            //RestRequest request = new RestRequest();
            //request.AddParameter("domain", Domain, ParameterType.UrlSegment);
            //request.Resource = "{domain}/messages";
            //request.AddParameter("from", "");
            //request.AddParameter("to", "");
            //request.AddParameter("subject", "Test email");
            //request.AddParameter("html", "<h2>Hello</h2>");
            //request.Method = Method.Post;
            //return client.Execute(request).ToString();
            return "Email send succesfully";
        }

    }
}
