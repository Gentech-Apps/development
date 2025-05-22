namespace UserManagement.database
{
    public class OTPVerifications
    {
        [Key]
        public Guid OTPId { get; set; }
        public string UserId { get; set; }
        public String OPT { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}
