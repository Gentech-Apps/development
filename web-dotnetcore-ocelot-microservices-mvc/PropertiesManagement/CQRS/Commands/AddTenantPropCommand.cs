using PropertiesManagement.CQRS.Models;
using PropertiesManagement.Database;

namespace PropertiesManagement.CQRS.Commands
{
    public class AddTenantPropCommand : IRequest<TenantPropAssoc>
    {
        public TenantPropAssoc tenantProp { get; set; }
    }
}
