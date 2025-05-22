using PropertiesManagement.CQRS.Models;

namespace PropertiesManagement.CQRS.Queries
{
    public class GetLeaseByPropertyIdQuery : IRequest<LeaseModel>
    {
        public string PropertyId { get; set; }
    }
}
