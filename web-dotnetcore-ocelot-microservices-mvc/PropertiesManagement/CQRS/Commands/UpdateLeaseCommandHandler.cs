using PropertiesManagement.CQRS.Models;
using PropertiesManagement.CQRS.Repositories.Interfaces;
using PropertiesManagement.Database;

namespace PropertiesManagement.CQRS.Commands
{
    public class UpdateLeaseCommandHandler : IRequestHandler<UpdateLeaseCommand, Leases>
    {
        private readonly ILeaseRepository _leaseRepository;

        public UpdateLeaseCommandHandler(ILeaseRepository leaseRepository)
        {
            _leaseRepository = leaseRepository;
        }

        public Task<Leases> Handle(UpdateLeaseCommand request, CancellationToken cancellationToken)
        {
            return _leaseRepository.UpdateLease(request.Model);
        }
    }
}
