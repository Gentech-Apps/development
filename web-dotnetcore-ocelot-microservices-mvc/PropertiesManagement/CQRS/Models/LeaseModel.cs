using Microsoft.EntityFrameworkCore.Metadata.Internal;
using PropertiesManagement.Database;
using System.ComponentModel.DataAnnotations.Schema;

namespace PropertiesManagement.CQRS.Models
{
    public class LeaseModel
    {
        public Guid LeaseId { get; set; }
        public Guid PropertyId { get; set; }
        public DateTime? LeaseExpirationDate { get; set; }
        public int? PayDay { get; set; }
        public float? DepostiAmount { get; set; }
        public float? RentAmount { get; set; }
        public List<PropertiesDocuments>? Documents{ get; set; }
        public List<PropertiesDocuments>? Images { get; set; }
    }
}
