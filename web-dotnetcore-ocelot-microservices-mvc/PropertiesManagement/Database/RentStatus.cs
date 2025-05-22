namespace PropertiesManagement.Database
{
    public class RentStatus
    {
        [Key]
        public Guid RentId { get; set; }
        public Guid PropertyId { get; set; }
        public Guid TenantId { get; set; }
        public float Amount { get; set; }
        public DateTime PaidOn { get; set; }
        public DateTime DueDate { get; set; }
        public string PaymentMode { get; set; }
        public PayṃentStatuses? PaymentStatus { get; set; }
    }
    public enum PayṃentStatuses
    {
        Paid,
        Unpaid
    }
}
