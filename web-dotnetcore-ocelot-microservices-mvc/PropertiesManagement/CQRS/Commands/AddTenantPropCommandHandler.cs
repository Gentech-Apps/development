using PropertiesManagement.CQRS.Models;
using PropertiesManagement.CQRS.Repositories.Interfaces;
using PropertiesManagement.Database;

namespace PropertiesManagement.CQRS.Commands
{
    public class AddTenantPropCommandHandler : IRequestHandler<AddTenantPropCommand,TenantPropAssoc>
    {
        private readonly ITenantPropAssocRepository _TenantPropAssocRepository;
        public AddTenantPropCommandHandler(ITenantPropAssocRepository tenantPropAssocRepository)
        {
            _TenantPropAssocRepository = tenantPropAssocRepository;
        }

        public Task<TenantPropAssoc> Handle(AddTenantPropCommand request, CancellationToken cancellationToken)
        {
            return _TenantPropAssocRepository.AddTenantAsync(request.tenantProp);

        }

    }
}
