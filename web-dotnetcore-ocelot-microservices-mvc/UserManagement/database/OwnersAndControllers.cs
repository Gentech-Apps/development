namespace UserManagement.database
{
    public class OwnersAndControllers
    {
        [Key]
        public Guid OwnersAndControllersId { get; set; }
        public UserTypeEnum Type { get; set; }
        public Guid UserInfoId { get; set; }
        public Guid BusinessId { get; set; }
        public string? Title { get; set; }
        public bool IsUSPerson { get; set; }
        public string? PassportNumber { get; set; }
        public string? InsuranceCountry { get; set; }
        public bool IsDeleated { get; set; } = false;
        public DateTime CreatedDate { get; set; } = new DateTime();
    }

    public enum UserTypeEnum
    { 
        Controller, // 0 
        Owner   // 1
    }
}
