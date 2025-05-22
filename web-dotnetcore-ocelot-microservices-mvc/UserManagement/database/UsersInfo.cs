namespace UserManagement.database
{
    public class UsersInfo
    {
        [Key]
        public Guid UserInfoId { get; set; }
        public Guid UserId { get; set; }
        public string? FirstName { get; set; }
        public string? LastName { get; set; }
        public string? Email { get; set; }
        public string? AddressLine1 { get; set; }
        public string? AddressLine2 { get; set; }
        public string? City { get; set; }
        public string? State { get; set; }
        public string? ZipCode { get; set; }
        public string? Country { get; set; }
        public DateTime? DOB { get; set; }
        public string? DwollaVerificationStatus { get; set; } 
        public string? SSN { get; set; }
        public string? DwollaVerifcationToken { get; set; }
        public DateTime? CreatedDate { get; set; }
        public string? ProfileImageURL { get; set; } 
    }
}
