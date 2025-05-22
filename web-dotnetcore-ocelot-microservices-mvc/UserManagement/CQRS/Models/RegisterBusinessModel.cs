namespace UserManagement.CQRS.Models
{
    public class RegisterBusinessModel
    {
       public Guid UserId { get; set; }
        public string Email { get; set;}
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string BusinessName { get; set; }
        public BusinessTypeEnum BusinessType { get; set; }
        public string? BusinessEIN { get; set; }
        public string BusinessAddress { get; set; }
        public string BusinessAddress2 { get; set; }    
        public string City {get; set; }
        public string State { get; set; }
        public string ZipCode {get; set; }
        public string? OwnerSSN { get; set; }
        public DateTime? OwnerDOB { get; set; }

    }
}
