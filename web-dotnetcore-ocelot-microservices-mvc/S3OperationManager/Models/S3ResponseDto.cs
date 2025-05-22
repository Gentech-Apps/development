namespace S3OperationManager.Models
{
    public class S3ResponseDto
    {
        public int StatusCode { get; set; }
        public string Message { get; set; }
        public string bucketURL { get; set; }
    }
}
