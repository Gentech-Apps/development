using System.ComponentModel.DataAnnotations;

namespace ServiceRequestManagement.database
{
    public class ServiceRequestMedia
    {
        [Key]
        public Guid DocumentId { get; set; }
        public Guid PropertyId { get; set; }
        public Guid? ServiceRequestId { get; set; }
        public string? DocumentURL { get; set; }
        public string? Type { get; set; }
        public Boolean? IsActive { get; set; }
    }
}
