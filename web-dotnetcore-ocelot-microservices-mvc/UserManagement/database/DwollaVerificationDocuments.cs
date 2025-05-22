namespace UserManagement.database
{
    public class DwollaVerificationDocuments
    {
        
        [Key]
        public Guid DocumentId { get; set; }
        public string DocumentURL { get; set; }
        public DocumentTypeEnum DocumentType { get; set; }
        public Guid UserInfoId { get; set; }
        public string DwollaDocumentToken { get; set; }
        public string DwollaDocumentStatus { get; set; }
        public DateTime CreatedDate { get; set; }


    }
    public enum DocumentTypeEnum
    {
        passport,
        license,
        idCard,
        other
    }
}
