namespace PropertiesManagement.CQRS.Models
{
    public class TenantPropAssocModel
    {
        public Guid TenantId { get; set; }
        public string TenantName { get; set; }
        public Guid PropertyId { get; set; }
        public DateTime FromDate { get; set; }
        public DateTime ToDate { get; set; }
    }
}
