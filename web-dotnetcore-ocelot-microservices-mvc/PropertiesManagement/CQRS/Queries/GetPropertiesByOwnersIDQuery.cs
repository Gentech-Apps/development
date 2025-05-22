using PropertiesManagement.CQRS.Models;
using PropertiesManagement.Database;

namespace PropertiesManagement.CQRS.Queries
{
    public class GetPropertiesByOwnersIDQuery : IRequest<List<Properties>>
    {
        public string ownerID { get; set; }
    }
}
