using PropertiesManagement.CQRS.Models;
using PropertiesManagement.Database;

namespace PropertiesManagement.CQRS.Queries
{
    public class GetPropertiesPortfolioByOwnersIDQuery : IRequest<List<PropertiesPortfolioModel>>
    {
        public string ownerID { get; set; }
        public int pageNumber { get; set; }
        public int pageSize { get; set; }
    }
}
