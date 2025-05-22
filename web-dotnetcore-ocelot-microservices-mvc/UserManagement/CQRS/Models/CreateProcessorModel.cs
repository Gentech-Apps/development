namespace UserManagement.CQRS.Models
{
    public class CreateProcessorModel
    {
        public string AccessToken { get; set; }
        public string AccountId { get; set; }
        public Guid UserId { get; set; }
        public string UserInfoId { get; set; }
        public string UserName { get; set; } 
        public string? Location { get; set; }
    }
}
