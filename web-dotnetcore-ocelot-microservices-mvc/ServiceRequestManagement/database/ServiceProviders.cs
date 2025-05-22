using Microsoft.EntityFrameworkCore.Storage.ValueConversion.Internal;
using System.ComponentModel.DataAnnotations;
using System.IO.Compression;

namespace ServiceRequestManagement.database
{
    public class ServiceProviders
    {
        [Key]
        public Guid ServiceProviderId { get; set; }
        public string? FirstName { get; set; }
        public string? LastName { get; set; }
        public string? Address { get; set; }
        public string? Zip { get; set; }
        public string? State { get; set; }
        public string? City { get; set; }
        public string? ServiceType { get; set; }
    }
}
