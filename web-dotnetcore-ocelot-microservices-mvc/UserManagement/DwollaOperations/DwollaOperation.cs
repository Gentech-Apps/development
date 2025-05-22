using Newtonsoft.Json.Linq;
using UserManagement.DwollaOperations.Model;
using UserManagement.DwollaOperations.Model.Response;
using YamlDotNet.Core.Tokens;

namespace UserManagement.DwollaOperations
{
    public class DwollaOperation
    {
        private string AccessKey;
        private string SecretKey;

        public DwollaOperation()
        {
            IConfigurationRoot configuration = new ConfigurationBuilder()
                .AddJsonFile("appsettings.json")
                    .Build();
            AccessKey = configuration.GetValue<string>("DwollaConfigurations:Key");
            SecretKey = configuration.GetValue<string>("DwollaConfigurations:SecretKey");
        }

        public async Task<string> CreateUnverifiedCustomer(CreateCustomerRequest cust)
        {


            IDwollaClient client = DwollaClient.Create(isSandbox: true);

            var tokenRes = await client.PostAuthAsync<TokenResponse>(
                new Uri($"{client.ApiBaseAddress}/token"),
            //    new AppTokenRequest { Key = "4luXlNFNf7mKTQNDYX7tA29oc71TpNczk9UmMGMIQUUo2aoB2G", Secret = "EXs7WED7m26W04vmJnE91CZdXTU95fy6N24uow80MDBNi2pkmG" });
            new AppTokenRequest { Key = AccessKey, Secret = SecretKey });

            var headers = new Headers { { "Authorization", $"Bearer {tokenRes.Content.Token}" } };
            var rootRes = (await client.GetAsync<RootResponse>(new Uri(client.ApiBaseAddress), headers)).Content;

            var rootRes1 = (await client.PostAsync<CreateCustomerRequest, EmptyResponse>(rootRes.Links["customers"].Href, cust, headers));

            return rootRes1.Response.Headers.Location.ToString();

        }

        public async Task<Dictionary<String, String>> CreateVerifiedCustomer(CreateCustomerRequest cust)
        {
            Dictionary<String, String> data = new Dictionary<string, string>();

            IDwollaClient client = DwollaClient.Create(isSandbox: true);

            var tokenRes = await client.PostAuthAsync<TokenResponse>(
                new Uri($"{client.ApiBaseAddress}/token"),
                //new AppTokenRequest { Key = "4luXlNFNf7mKTQNDYX7tA29oc71TpNczk9UmMGMIQUUo2aoB2G", Secret = "EXs7WED7m26W04vmJnE91CZdXTU95fy6N24uow80MDBNi2pkmG" });
                new AppTokenRequest { Key = AccessKey, Secret = SecretKey });

            var headers = new Headers { { "Authorization", $"Bearer {tokenRes.Content.Token}" } };
            var rootRes = (await client.GetAsync<RootResponse>(new Uri(client.ApiBaseAddress), headers)).Content;
            var rootRes1 = (await client.PostAsync<CreateCustomerRequest, EmptyResponse>(rootRes.Links["customers"].Href, cust, headers));
            string value = "";
            if (rootRes1.Error != null)
            {
                data.Add("response", "false");
                data.Add("value", rootRes1.Error.Embedded.Errors[0].Message.ToString());
                return data;
            }
            else
            {
                value = rootRes1.Response.Headers.Location.ToString();
                data.Add("value", value);
                data.Add("response", "true");
                return data;
            }
        }

        public async Task<Uri?> CreateIndividualBusinessCustomer(CreateCustomerRequest cust)
        {

            IDwollaClient client = DwollaClient.Create(isSandbox: true);

            var tokenRes = await client.PostAuthAsync<TokenResponse>(
                new Uri($"{client.ApiBaseAddress}/token"),
                //new AppTokenRequest { Key = "4luXlNFNf7mKTQNDYX7tA29oc71TpNczk9UmMGMIQUUo2aoB2G", Secret = "EXs7WED7m26W04vmJnE91CZdXTU95fy6N24uow80MDBNi2pkmG" });
                new AppTokenRequest { Key = AccessKey, Secret = SecretKey });
            var headers = new Headers { { "Authorization", $"Bearer {tokenRes.Content.Token}" } };
            var rootRes = (await client.GetAsync<RootResponse>(new Uri(client.ApiBaseAddress), headers)).Content;
            var rootRes1 = (await client.PostAsync<CreateCustomerRequest, EmptyResponse>(rootRes.Links["customers"].Href, cust, headers));


            return rootRes1.Response.Headers.Location;

            var rootRes2 = (await client.GetAsync<RootResponse>(new Uri(client.ApiBaseAddress), headers)).Content;

        }
        public async Task<Dictionary<String, String>> CreateBeneficialOwner(CreateBeneficialOwnerRequest request, string customerUrl)
        {
            Dictionary<String, String> data = new Dictionary<string, string>();

            IDwollaClient client = DwollaClient.Create(isSandbox: true);

            var tokenRes = await client.PostAuthAsync<TokenResponse>(
                new Uri($"{client.ApiBaseAddress}/token"),
                //new AppTokenRequest { Key = "4luXlNFNf7mKTQNDYX7tA29oc71TpNczk9UmMGMIQUUo2aoB2G", Secret = "EXs7WED7m26W04vmJnE91CZdXTU95fy6N24uow80MDBNi2pkmG" });
                new AppTokenRequest { Key = AccessKey, Secret = SecretKey });
            var headers = new Headers { { "Authorization", $"Bearer {tokenRes.Content.Token}" } };
            var rootRes = (await client.GetAsync<RootResponse>(new Uri(client.ApiBaseAddress), headers)).Content;
            var rootRes1 = (await client.PostAsync<CreateBeneficialOwnerRequest, EmptyResponse>(new Uri($"{customerUrl}/beneficial-owners"), request, headers));
            string value = "";
            if (rootRes1.Error != null)
            {
                data.Add("response", "false");
                data.Add("value", rootRes1.Error.Embedded.Errors[0].Message.ToString());
                return data;
            }
            else
            {
                value = rootRes1.Response.Headers.Location.ToString();
                data.Add("value", value);
                data.Add("response", "true");
                return data;
            }
        }

        public async Task<string> GetVerificationStatusCustomer(string tokenURL)
        {
            IDwollaClient client = DwollaClient.Create(isSandbox: true);

            var tokenRes = await client.PostAuthAsync<TokenResponse>(
                new Uri($"{client.ApiBaseAddress}/token"),
                //new AppTokenRequest { Key = "4luXlNFNf7mKTQNDYX7tA29oc71TpNczk9UmMGMIQUUo2aoB2G", Secret = "EXs7WED7m26W04vmJnE91CZdXTU95fy6N24uow80MDBNi2pkmG" });
                new AppTokenRequest { Key = AccessKey, Secret = SecretKey });
            var headers = new Headers { { "Authorization", $"Bearer {tokenRes.Content.Token}" } };
            var rootRes = (await client.GetAsync<RootResponse>(new Uri(client.ApiBaseAddress), headers)).Content;
            var rootRes1 = (await client.GetAsync<RootResponse>(new Uri(tokenURL), headers));
            if (rootRes1.Response != null)
            {
                dynamic jsonData = JObject.Parse(rootRes1.RawContent);
                if (jsonData.status != null)
                {
                    return jsonData.status;
                }
                else {
                    return jsonData.verificationStatus;
                }
            }
            return null;
        }

        public async Task<Dictionary<String, String>> CreateFundingSource(string customerURL, CreatePlaidFundingSourceRequest request)
        {
            Dictionary<String, String> data = new Dictionary<string, string>();

            IDwollaClient client = DwollaClient.Create(isSandbox: true);

            var tokenRes = await client.PostAuthAsync<TokenResponse>(
                new Uri($"{client.ApiBaseAddress}/token"),
                //new AppTokenRequest { Key = "4luXlNFNf7mKTQNDYX7tA29oc71TpNczk9UmMGMIQUUo2aoB2G", Secret = "EXs7WED7m26W04vmJnE91CZdXTU95fy6N24uow80MDBNi2pkmG" });
                new AppTokenRequest { Key = AccessKey, Secret = SecretKey });
            var headers = new Headers { { "Authorization", $"Bearer {tokenRes.Content.Token}" } };
            var rootRes = (await client.GetAsync<RootResponse>(new Uri(client.ApiBaseAddress), headers)).Content;
            var rootRes1 = (await client.PostAsync<CreatePlaidFundingSourceRequest, EmptyResponse>
                //(new Uri($"{rootRes.Links["customers"].Href}/{input}/funding-sources"), request, headers));
                (new Uri($"{customerURL}/funding-sources"), request, headers));
            string value = "";
            if (rootRes1.Error != null)
            {
                data.Add("response", "false");
                data.Add("value", rootRes1.Error.Code.ToString());
                return data;
            }
            else
            {
                value = rootRes1.Response.Headers.Location.ToString();
                data.Add("value", value);
                data.Add("response", "true");
                return data;
            }
            //return rootRes1.Response.Headers.Location;
        }

        public async Task<Dictionary<String, String>> UploadCustomerVerificationDocument(string customerURL, UploadDocumentRequest request)
        {
            Dictionary<String, String> data = new Dictionary<string, string>();
            IDwollaClient client = DwollaClient.Create(isSandbox: true);

            var tokenRes = await client.PostAuthAsync<TokenResponse>(
                new Uri($"{client.ApiBaseAddress}/token"),
                //new AppTokenRequest { Key = "4luXlNFNf7mKTQNDYX7tA29oc71TpNczk9UmMGMIQUUo2aoB2G", Secret = "EXs7WED7m26W04vmJnE91CZdXTU95fy6N24uow80MDBNi2pkmG" });
                new AppTokenRequest { Key = AccessKey, Secret = SecretKey });
            var headers = new Headers { { "Authorization", $"Bearer {tokenRes.Content.Token}" } };
            //var rootRes = (await client.GetAsync<RootResponse>(new Uri(client.ApiBaseAddress), headers)).Content;
                var rootRes1 = (await client.UploadAsync
               (new Uri($"{customerURL}/documents"), request, headers));

            if (rootRes1.Error != null)
            {
                data.Add("response", "false");
                data.Add("value", rootRes1.Error.Embedded.Errors[0].Message.ToString());
                return data;
            }
            else
            {
                data.Add("value", rootRes1.Response.Headers.Location.ToString());
                data.Add("response", "true");
                return data;
            }
            
            
            
            
        }
    }
}
