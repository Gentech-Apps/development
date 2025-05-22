using PropertiesManagement.CQRS.Models;
using PropertiesManagement.CQRS.Repositories.Interfaces;

namespace PropertiesManagement.CQRS.Commands
{
    public class AddLeaseCommandHandler : IRequestHandler<AddLeaseCommand, LeaseModel>
    {
        private readonly ILeaseRepository _leaseRepository ;
        public AddLeaseCommandHandler(ILeaseRepository leaseRepository)
        {
            _leaseRepository = leaseRepository;
        }
        public Task<LeaseModel> Handle(AddLeaseCommand request, CancellationToken cancellationToken)
        {
            return _leaseRepository.AddLease(request.Model);
        }
    }
}
