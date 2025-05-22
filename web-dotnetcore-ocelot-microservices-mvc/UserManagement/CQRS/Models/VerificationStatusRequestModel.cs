namespace UserManagement.CQRS.Models
{
    public class VerificationStatusRequestModel
    {
        public Guid UserId { get; set; }
        public string Type { get; set; }
        public UserTypeEnum? Benificary { get; set; }
        public string LandlordType { get; set; }
    }
}
