using Microsoft.AspNetCore.Mvc.ApplicationModels;

namespace PropertiesManagement.Database
{
    public class Properties
    {
        [Key]
        public Guid PropertyId { get; set; }
        public string? Address { get; set; }
        public string? Street { get; set; }
        public string? Zip { get; set; }
        public string? Latitude { get; set; }
        public string? Longitude { get; set; }
        public string? City { get; set; }
        public string? State { get; set; }
        public PropertyTypes? Type { get; set; }
        public int? Units { get; set; }
        public PropertyOccupationStatuses? Status { get; set; }
        public Guid? OwnerId { get; set; }
        public string? OwnerName { get; set; }
        public DateTime? CreateAt { get; set; }
        public Boolean? IsIDVerified { get; set; }
        public PropertyStatuses? PropertyStatus { get; set; }

        public static implicit operator PropertyModel(Properties v)
        {
            throw new NotImplementedException();
        }


        /// <summary>
        /// Enums used in table
        /// </summary>
        public enum PropertyTypes
        {
            SingleFamilyHome,
            MultiUnit
        }
        public enum PropertyOccupationStatuses
        {
            Vacant,
            TenantOccupied,
            OwnerOccupied
        }

        public enum PropertyStatuses
        {
            Ok,
            ActiveServiceRequest,
            Vacant,
            RentalPaymentPastDue,
            PendingTanantApproval,
            LeaseAgreementExpired
        }
    }
}
