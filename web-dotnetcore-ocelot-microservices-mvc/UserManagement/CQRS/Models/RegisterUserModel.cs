﻿namespace UserManagement.CQRS.Models
{
    public class RegisterUserModel
    {
        public string Name { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }
        public string Role { get; set; }
        public string LandlordType { get; set; }
        
    }
}
