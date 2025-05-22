using Microsoft.EntityFrameworkCore.Metadata.Internal;
using System.ComponentModel.DataAnnotations.Schema;

namespace PropertiesManagement.Database
{
    public class Leases
    {
        [Key]
        public Guid LeaseId { get; set; }
        public Guid PropertyId { get; set; }

        [Column(TypeName = "Date")]
        public DateTime? LeaseExpirationDate { get; set; }
        public int? PayDay { get; set; }
        public float? DepostiAmount { get; set; }
        public float? RentAmount { get; set; }
    }
}
