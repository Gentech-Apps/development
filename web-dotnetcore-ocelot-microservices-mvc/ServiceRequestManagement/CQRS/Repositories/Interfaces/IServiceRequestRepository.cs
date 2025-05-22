using ServiceRequestManagement.CQRS.Models;
using ServiceRequestManagement.database;

namespace ServiceRequestManagement.CQRS.Repositories.Interfaces
{
    public interface IServiceRequestRepository
    {
        public Task<List<ServiceRequestModel>> GetServiceRequests(ServiceRequestsRequestModel model);
        public Task<ServiceRequest> AddServiceRequestAsync(ServiceRequestModel servicerequestModel);
        public Task<ServiceRequestDashboardSummaryModel> GetServiceRequestDashboardSummary(List<String> propertiesIds);
        public Task<ServiceRequestModel> GetServiceRequestByServiceRequestID(string serviceRequestID);
    }
}
