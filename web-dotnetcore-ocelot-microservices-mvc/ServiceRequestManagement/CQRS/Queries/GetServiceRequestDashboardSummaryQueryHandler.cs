using ServiceRequestManagement.CQRS.Models;
using ServiceRequestManagement.CQRS.Repositories.Interfaces;

namespace ServiceRequestManagement.CQRS.Queries
{
    public class GetServiceRequestDashboardSummaryQueryHandler : IRequestHandler<GetServiceRequestDashboardSummaryQuery, ServiceRequestDashboardSummaryModel>
    {
        public readonly IServiceRequestRepository _repository;

        public GetServiceRequestDashboardSummaryQueryHandler(IServiceRequestRepository repository)
        {
            _repository = repository;
        }

        public Task<ServiceRequestDashboardSummaryModel> Handle(GetServiceRequestDashboardSummaryQuery request, CancellationToken cancellationToken)
        {
           return _repository.GetServiceRequestDashboardSummary(request.PropertiesIds);
        }
    }
}
