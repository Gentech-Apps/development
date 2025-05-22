namespace UserManagement.CQRS.Models
{
    public class BusinessDetailsModel
    {
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string BusinessName { get; set; }
        public string Email { get; set; }
        public string Phone { get; set; }
        public string ThresholdAmt { get; set; }
        public string BusinessEIN { get; set; }
        public string? SSN { get; set; }
        public bool IsIndividual { get; set; }
        public BusinessTypeEnum? BusinessType { get; set; }
        public Guid BusinessId { get; set; }
    }
}