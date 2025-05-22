namespace UserManagement.CQRS.Models
{
    public class UsersModel : UsersInfo
    {
        public Guid UserId { get; set; }
        /*public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Email { get; set; }*/
        public string PhoneNumber { get; set; }
        public Boolean IsMobileVerified { get; set; }
        /*public DateTime CreatedAt { get; set; }
        public string ProfileImageURL { get; set; }*/
        public Boolean IsActive { get; set; }
        public string Role { get; set; }
        public bool IsIndividual { get; set; }
        public string Threshold { get; set; }
    }
}
