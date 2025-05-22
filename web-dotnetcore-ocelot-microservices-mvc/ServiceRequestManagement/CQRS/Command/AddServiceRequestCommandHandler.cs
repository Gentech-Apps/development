using MediatR;
using ServiceRequestManagement.CQRS.Repositories.Interfaces;
using ServiceRequestManagement.database;

namespace ServiceRequestManagement.CQRS.Commands
{
    public class AddServiceRequestCommandHandler : IRequestHandler<AddServiceRequestCommand, ServiceRequest>
    {
        private readonly IServiceRequestRepository _serviceRequestRepository;

        public AddServiceRequestCommandHandler(IServiceRequestRepository ServiceRequestRepository) {
            _serviceRequestRepository = ServiceRequestRepository;
        }
        public Task<ServiceRequest> Handle(AddServiceRequestCommand request, CancellationToken cancellationToken)
        {
            return _serviceRequestRepository.AddServiceRequestAsync(request.serviceRequest);
        }
    }
}
