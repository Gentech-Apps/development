namespace S3OperationManager.Models
{
    public class S3RequestDto
    {
        public string path { get; set; }
        public IFormFile? file { get; set; }
        public string? fileName { get; set; }
    }
}
