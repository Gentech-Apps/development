using System;
using UserManagement.DwollaOperations.Models;

namespace UserManagement.DwollaOperations
{
    public class Controller
    {
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Title { get; set; }
        public Address Address { get; set; }
        public DateTime DateOfBirth { get; set; }
        public string Ssn { get; set; }
        public Passport Passport { get; set; }
    }
}