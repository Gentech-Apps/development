namespace JwtAuthanticationManager.Models
{
    public class UserAccount
    {
        public Guid UserId { get; set; }
        public string UserEmail { get; set; }
        public string Password { get; set; } 
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Role { get; set; }
        public Boolean IsPhoneNoVerified { get; set; }
        public Boolean IsActive { get; set; }
        public Guid UserInfoId { get; set; }
        public bool IsIndividual { get; set; }
    }
}
