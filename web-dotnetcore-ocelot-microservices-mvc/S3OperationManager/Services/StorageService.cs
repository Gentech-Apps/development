using Amazon.Runtime;
using Amazon.S3.Transfer;
using Amazon.S3;
using Microsoft.Extensions.Configuration;
using S3OperationManager.Interfaces;
using S3OperationManager.Models;
using Amazon.S3.Model;

namespace S3OperationManager.Services
{
    public class StorageService : IStorageService
    {
        public StorageService()
        {
            //_config = config;
        }

        public async Task<S3ResponseDto> UploadFileAsync(S3Data obj)
        {
            //var awsCredentialsValues = _config.ReadS3Credentials();

            // Console.WriteLine($"Key: {awsCredentialsValues.AccessKey}, Secret: {awsCredentialsValues.SecretKey}");

            IConfigurationRoot configuration = new ConfigurationBuilder()
            .AddJsonFile("appsettings.json")
                .Build();
            string AccessKey = configuration.GetValue<string>("AWSConfigurations:AccessKey");
            string SecretKey = configuration.GetValue<string>("AWSConfigurations:SecretKey");
            string BucketName = configuration.GetValue<string>("AWSConfigurations:BucketName");

            var credentials = new BasicAWSCredentials(AccessKey, SecretKey);

            var config = new AmazonS3Config()
            {
                RegionEndpoint = Amazon.RegionEndpoint.EUCentral1
            };

            var response = new S3ResponseDto();
            try
            {
                var uploadRequest = new TransferUtilityUploadRequest()
                {
                    InputStream = obj.InputStream,
                    Key = obj.Name,
                    BucketName = BucketName,
                    CannedACL = S3CannedACL.NoACL
                };

                // initialise client
                using var client = new AmazonS3Client(credentials, config);

                // initialise the transfer/upload tools
                var transferUtility = new TransferUtility(client);

                // initiate the file upload
                await transferUtility.UploadAsync(uploadRequest);

                response.StatusCode = 201;
                response.Message = $"{obj.Name} has been uploaded sucessfully";




                GetPreSignedUrlRequest request = new GetPreSignedUrlRequest();
                request.BucketName = "sre-dev-bucket";
                request.Key = obj.Name;
                request.Expires = DateTime.Now.AddHours(1);
                request.Protocol = Protocol.HTTP;
                string url = client.GetPreSignedURL(request);
                Uri uri = new Uri(url);
                string bucketUrl = "https://" + uri.Host+"/"+obj.Name;
                Console.WriteLine(url);
                response.bucketURL= bucketUrl;
            }
            catch (AmazonS3Exception s3Ex)
            {
                response.StatusCode = (int)s3Ex.StatusCode;
                response.Message = s3Ex.Message;
            }
            catch (Exception ex)
            {
                response.StatusCode = 500;
                response.Message = ex.Message;
            }

            return response;
        }

        public async Task<S3ResponseDto> GetPreSignedURLasync(S3Data obj)
        {
            
            IConfigurationRoot configuration = new ConfigurationBuilder()
            .AddJsonFile("appsettings.json")
                .Build();
            string AccessKey = configuration.GetValue<string>("AWSConfigurations:AccessKey");
            string SecretKey = configuration.GetValue<string>("AWSConfigurations:SecretKey");
            string BucketName = configuration.GetValue<string>("AWSConfigurations:BucketName");

            var response = new S3ResponseDto();
            try
            {
            string url = "";
            if (!string.IsNullOrEmpty(obj.Name) && !string.IsNullOrWhiteSpace(obj.Name))
                using (IAmazonS3 client = new AmazonS3Client(AccessKey, SecretKey, Amazon.RegionEndpoint.EUCentral1))
                {
                    GetPreSignedUrlRequest request = new GetPreSignedUrlRequest();
                    request.BucketName = BucketName;
                    request.Key = obj.Name.TrimEnd('/');
                    request.Verb = HttpVerb.PUT;
                    request.Expires = DateTime.UtcNow.AddMinutes(10);
                    url = client.GetPreSignedURL(request);
                }
                response.StatusCode = 201;
                response.Message = $"{obj.Name} Presigned URL generated successfully";
                response.bucketURL = url;

            }
            catch (AmazonS3Exception s3Ex)
            {
                response.StatusCode = (int)s3Ex.StatusCode;
                response.Message = s3Ex.Message;
            }
            catch (Exception ex)
            {
                response.StatusCode = 500;
                response.Message = ex.Message;
            }

            return response;
        }
    }
}
