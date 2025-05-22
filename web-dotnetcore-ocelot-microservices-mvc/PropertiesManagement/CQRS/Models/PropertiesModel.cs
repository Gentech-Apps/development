using static PropertiesManagement.Database.Properties;

namespace PropertiesManagement.CQRS.Models
{
    public class PropertiesModel
    {
        public Guid PropertyId;
        public string? Address ;
        public string? Street;
        public string? Zip ;
        public string? City ;
        public string? State ;
        public string? Latitude;
        public string? Longitude;
        public PropertyTypes? Type;
        public PropertyOccupationStatuses? Status ;
        public PropertyStatuses? PropertyStatus;
        public Guid? OwnerId ;
        public string? OwnerName ;
        public string? OwnerIdString;
        public bool? IsIDVerified ;
        public DateTime? LeaseExpirationDate ;
        public int? PayDay ;
        public float? DepostiAmount ;
        public float? RentAmount ;
        public int? Units;
    }
}
