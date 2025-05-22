using ServiceRequestManagement.database;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel;

namespace ServiceRequestManagement.CQRS.Models
{
    public class ServiceRequestModel
    {
        public Guid ServiceRequestID { get; set; }
        public Guid PropertyID { get; set; }
        public DateTime CreatedDate { get; set; }
        public Guid? ServiceProviderID { get; set; }
        public string? ServiceProviderName { get; set; }
        public Guid OpenedBy { get; set; }
        public string Description { get; set; }
        public WorkStatusEnum WorkStatus { get; set; }
        public ServiceTypeEnum ServiceType { get; set; }
        public string? AcceptedTimeFrame { get; set; }
        public string? VerificationOTP { get; set; }
        public string? EstimatedCost { get; set; }
        public string PropertyAddress { get; set; }
        public List<ServiceRequestMedia> Image { get; set; }
        public List<ServiceRequestMedia> Video { get; set; }
    }
}
