using ServiceRequestManagement.CQRS.Models;

namespace ServiceRequestManagement.CQRS.Queries
{
    public class GetServiceRequestDashboardSummaryQuery : IRequest<ServiceRequestDashboardSummaryModel>
    {
        public List<string> PropertiesIds { get; set; }
    }
}
