using PropertiesManagement.CQRS.Models;

namespace PropertiesManagement.CQRS.Commands
{
    public class AddLeaseCommand : IRequest<LeaseModel>
    {
        public LeaseModel Model { get; set; }
    }
}
