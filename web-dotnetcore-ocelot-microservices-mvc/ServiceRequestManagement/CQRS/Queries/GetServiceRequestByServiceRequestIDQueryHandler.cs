using ServiceRequestManagement.CQRS.Models;
using ServiceRequestManagement.CQRS.Repositories.Interfaces;
using ServiceRequestManagement.database;

namespace ServiceRequestManagement.CQRS.Queries
{
    public class GetServiceRequestByServiceRequestIDQueryHandler : IRequestHandler<GetServiceRequestByServiceRequestIDQuery, ServiceRequestModel>
    {
        public readonly IServiceRequestRepository _serviceRequestRepository;

        public GetServiceRequestByServiceRequestIDQueryHandler(IServiceRequestRepository serviceRequestRepository)
        {
            _serviceRequestRepository = serviceRequestRepository;
        }

        public Task<ServiceRequestModel> Handle(GetServiceRequestByServiceRequestIDQuery request, CancellationToken cancellationToken)
        {
            return _serviceRequestRepository.GetServiceRequestByServiceRequestID(request.ServiceRequestID);
        }
    }
}
