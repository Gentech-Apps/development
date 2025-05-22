namespace UserManagement.database
{
    public class Business
    {
        [Key]
        public Guid BusinessId { get; set; }
        [Required]
        public string BusinessName { get; set; }
        [Required]
        public BusinessTypeEnum BusinessType { get; set; }
        public string? BusinessEIN { get; set; }
        public DateTime CreatedDate { get; set; } = DateTime.Now;
        [Required]
        public Guid UserId { get; set; }
        public Guid UserInfoId { get; set; }
    }
    public enum BusinessTypeEnum
    {
        LLCs =0,
        Corportation=1,
        SolePartnership=2,
        Trust=3,
        Unicorporatedassociation=4,
        Publiclytradedcorporations=5,
        NonProfits=6,
        Partnership=7,
    }
}


