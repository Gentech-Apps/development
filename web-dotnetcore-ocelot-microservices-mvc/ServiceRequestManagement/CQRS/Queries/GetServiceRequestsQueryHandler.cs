using ServiceRequestManagement.CQRS.Models;
using ServiceRequestManagement.CQRS.Repositories.Interfaces;
using ServiceRequestManagement.database;

namespace ServiceRequestManagement.CQRS.Queries
{
    public class GetServiceRequestsQueryHandler : IRequestHandler<GetServiceRequestsQuery, List<ServiceRequestModel>>
    {
        public readonly IServiceRequestRepository _serviceRequestRepository;

        public GetServiceRequestsQueryHandler(IServiceRequestRepository serviceRequestRepository)
        {
            _serviceRequestRepository = serviceRequestRepository;
        }

        public Task<List<ServiceRequestModel>> Handle(GetServiceRequestsQuery request, CancellationToken cancellationToken)
        {
            return _serviceRequestRepository.GetServiceRequests(request.serviceRequestsRequestModel);
            
        }
    }
}
