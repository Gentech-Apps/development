
using ServiceRequestManagement.CQRS.Models;
using ServiceRequestManagement.database;

namespace ServiceRequestManagement.CQRS.Queries
{
    public class GetServiceRequestsQuery : IRequest<List<ServiceRequestModel>>
    {
        public ServiceRequestsRequestModel serviceRequestsRequestModel { get; set; }
    }
}
