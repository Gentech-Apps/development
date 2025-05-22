using System.ComponentModel;
using System.ComponentModel.DataAnnotations;

namespace ServiceRequestManagement.database
{
    public class ServiceRequest
    {
        [Key]
        public Guid ServiceRequestId { get; set; }
        [Required]
        public Guid PropertyId { get; set; }
        [DefaultValue("getDate()")]
        public DateTime CreatedDate { get; set; }
        public Guid ServiceProviderId { get; set; }
        public Guid OpenedBy { get; set; }
        public string Description { get; set; }
        public WorkStatusEnum WorkStatus { get; set; }
        public ServiceTypeEnum ServiceType { get; set; }
        public string AcceptedTimeFrame { get; set; }
        public string VerificationOTP { get; set; }
        public string EstimatedCost { get; set; }
        public string PropertyAddress { get; set; }




    }

    public enum WorkStatusEnum
    {
        NEW,  //0
        SELECT_TIME_FRAME, //1
        SCHEDULED_PENDING_PAYMENT, //2
        PENDING_APPROVAL, //3
        INPROGRESS,  //4
        COMPLETED_PENDING_PAYMENT, //5
        COMPLETED, //6
        REOPEN, //7
        DISCARD, //8
    }
    public enum ServiceTypeEnum
    {
        AC,  //0
        ELECTRICAL, //1
        PLUMBLING, //2
        HANDYMAN, //3
        LOCKSMITH,  //4
        STRUCTURE_SERVICE //5
    }
}
