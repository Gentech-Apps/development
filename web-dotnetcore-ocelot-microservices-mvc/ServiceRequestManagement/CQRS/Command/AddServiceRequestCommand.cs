using ServiceRequestManagement.CQRS.Models;
using ServiceRequestManagement.database;

namespace ServiceRequestManagement.CQRS.Commands
{
    public class AddServiceRequestCommand: IRequest<ServiceRequest>
    {
        public ServiceRequestModel serviceRequest { get; set; }
    }
}
