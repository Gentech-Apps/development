using PropertiesManagement.CQRS.Models;
using PropertiesManagement.CQRS.Repositories.Interfaces;

namespace PropertiesManagement.CQRS.Queries
{
    public class GetLeaseByPropertyIdQueryHandler : IRequestHandler<GetLeaseByPropertyIdQuery,LeaseModel>
    {
        private readonly ILeaseRepository _leaseRepository;

        public GetLeaseByPropertyIdQueryHandler(ILeaseRepository leaseRepository)
        {
            _leaseRepository = leaseRepository;
        }
        public Task<LeaseModel> Handle(GetLeaseByPropertyIdQuery request, CancellationToken cancellationToken)
        {
            return _leaseRepository.GetLeaseByPropertyId(request.PropertyId);
        }
    }
}
