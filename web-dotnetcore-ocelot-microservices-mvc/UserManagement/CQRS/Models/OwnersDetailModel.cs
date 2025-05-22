namespace UserManagement.CQRS.Models
{
    public class OwnersDetailModel
    {
        public string UserId { get; set; }
        public string BusinessId { get; set; }
        public List<UserDetailsModel> UserDetails { get; set; }
    }
}
