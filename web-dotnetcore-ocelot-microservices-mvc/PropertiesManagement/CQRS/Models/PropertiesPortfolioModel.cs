using PropertiesManagement.Database;

namespace PropertiesManagement.CQRS.Models
{
    public class PropertiesPortfolioModel : Properties
    {
        public string? Image { get; set; }
        public float? RentAmount { get; set; }
        public float? DepositAmount { get; set; }
        public DateTime? LeaseExpirationDate { get; set; }
        public int? PayDay { get; set; }
        public List<TenantData> AllocatedUsers { get; set; }
    }
}
