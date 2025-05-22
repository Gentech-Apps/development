using Microsoft.EntityFrameworkCore;

namespace ServiceRequestManagement.database
{
    public class DatabaseContext : DbContext
    {
        public DatabaseContext(DbContextOptions<DatabaseContext> options) : base(options)
        { }
        public DbSet<ServiceRequest> ServiceRequest { get; set; }
        public DbSet<ServiceRequestMedia> serviceRequestMedias { get; set; }
        public DbSet<ServiceProviders> ServiceProviders { get; set; }
    }
    
}
