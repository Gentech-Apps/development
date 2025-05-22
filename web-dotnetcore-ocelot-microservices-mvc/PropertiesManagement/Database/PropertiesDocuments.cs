namespace PropertiesManagement.Database
{
    public class PropertiesDocuments
    {
        [Key]
        public Guid DocumentId { get; set; }
        public Guid PropertyId { get; set; }
        public Guid? UploadedByUserId { get; set; }
        public string? DocumentURL { get; set; }
        public string? Type { get; set; }
        public Boolean? IsActive { get; set; }
    }
}
