using PropertiesManagement.CQRS.Models;

namespace PropertiesManagement.CQRS.Queries
{
    public class GetPropertyDetailsQuery : IRequest<PropertiesPortfolioModel>
    {
        public string ownerId { get; set; }
        public string propertyId { get; set; }
    }
}
