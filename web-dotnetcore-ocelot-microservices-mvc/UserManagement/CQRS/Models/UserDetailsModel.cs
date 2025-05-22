namespace UserManagement.CQRS.Models
{
    public class UserDetailsModel
    {
        public string? FirstName { get; set; }
        public string? LastName { get; set; }
        public UserTypeEnum? UserType { get; set; }
        public string? DwollaVerificationStatus { get; set; }
        public Guid? OwnerAndControllerId { get; set; }
        public bool? IsDeleated { get; set; }
        public string? Title { get; set; }
        public Guid? UserInfoId { get; set; }
    }
}
