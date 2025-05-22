
namespace UserManagement.CQRS.Models
{
    public class RegisterControllerModel
    {
        public string? FirstName { get; set; }
        public string? LastName { get; set; }
        public string? Title { get; set; }
        public string? SSN { get; set; }
        public string? Address1 { get; set; }
        public string? Address2 { get; set; }
        public string? City { get; set; }
        public string? State { get; set; }
        public string? ZipCode { get; set; }
        public string? PassportNumber { get; set; }
        public string? IssuanceCountry { get; set; }
        public string? Country { get; set; }
        public Guid? BusinessId { get; set; }
        public Guid? UserId { get; set; }
        public DateTime? DOB { get; set;}
        public int? IsUSPerson { get; set; }
        public UserTypeEnum? UserType { get; set; }  
        public Guid? OwnerAndControllerId { get; set; }
        public Guid? UserInfoId { get; set; }
    }
}
