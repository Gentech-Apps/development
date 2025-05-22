using PropertiesManagement.CQRS.Models;
using PropertiesManagement.Database;

namespace PropertiesManagement.CQRS.Commands
{
    public class UpdateLeaseCommand : IRequest<Leases>
    {
        public LeaseModel Model { get; set; }
    }
}
