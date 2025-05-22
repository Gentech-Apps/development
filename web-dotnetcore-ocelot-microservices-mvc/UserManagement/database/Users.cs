using System.Globalization;

namespace UserManagement.database
{
    public class Users
    {
        [Key]
        public Guid UserId { get; set; }
        public string?  Email { get; set; }
        public string? PasswordHash { get; set; }
        public string? PasswordSalt { get; set; }
        public Boolean?  IsActive { get; set; } = true;
        public Boolean? IsPhoneNoVerified { get; set; }
        public string? Role { get; set; }
        public string? PhoneNumber { get; set; }
        public Boolean? IsIndividual { get; set; } = true;
        public DateTime CreatedDate { get; set; } = DateTime.Now;
        public Guid? UserInfoId { get; set; }
        public string? Threshold { get; set; }
    }
}
