using UserManagement.database;

namespace UserManagement.CQRS.Models
{
    public class DocumentVerificationRequestModel
    {
        public Guid UserId { get; set; }
        public IFormFile File { get; set; }
        public DocumentTypeEnum DocumentType { get; set; }
        public string LandlordType { get; set; }
        public string? Benificary { get; set; }
        public string FileName { get; set; }
        public string s3documentUrl { get; set; }

    }
}
