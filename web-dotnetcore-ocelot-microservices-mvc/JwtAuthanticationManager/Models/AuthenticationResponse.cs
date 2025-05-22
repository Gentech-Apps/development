namespace JwtAuthanticationManager.Models
{
    public class AuthenticationResponse
    {
        public Guid UserId { get; set; }
        public string UserEmail { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Role { get; set; }
        public string JwtToken { get; set; }
        public int ExpiresIn { get; set; }
        public Boolean IsPhoneNoVerified { get; set; }
        public Boolean IsActive { get; set; }
        public bool? IsIndividual { get; set; }
    }
}
