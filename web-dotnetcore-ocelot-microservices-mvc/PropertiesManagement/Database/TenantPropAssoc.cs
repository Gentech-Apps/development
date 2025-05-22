namespace PropertiesManagement.Database
{
    public class TenantPropAssoc
    {
        [Key]
        public Guid TenantPropAssocId { get; set; }
        public Guid? TenantId { get; set; }
        public string? TenantName { get; set; }
        public Guid? PropertyId { get; set; }
        public DateTime? FromDate { get; set; }
        public DateTime? ToDate { get; set; }
        public Boolean? IsActive { get; set; }
    }
}
