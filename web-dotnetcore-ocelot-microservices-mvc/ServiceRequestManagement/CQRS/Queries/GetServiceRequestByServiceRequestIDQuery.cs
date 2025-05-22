using ServiceRequestManagement.CQRS.Models;
using ServiceRequestManagement.database;

namespace ServiceRequestManagement.CQRS.Queries
{
    public class GetServiceRequestByServiceRequestIDQuery: IRequest<ServiceRequestModel>
    {
         public string ServiceRequestID { get; set; }
    }
}
