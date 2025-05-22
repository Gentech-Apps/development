using System.Reflection.Metadata;
using static PropertiesManagement.Database.Properties;

namespace PropertiesManagement.Database
{
    public class DatabaseContext : DbContext
    {
        public DatabaseContext(DbContextOptions<DatabaseContext> options) : base(options)
        {

        }
        public DbSet<Properties> Properties { get; set; }
        public DbSet<TenantPropAssoc> TenantPropAssocs { get; set; }
        public DbSet<PropertiesDocuments> PropertyDocuments { get; set; }
        public DbSet<RentStatus> RentStatus { get; set; }
        public DbSet<Leases> Leases { get; set; }
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            Guid firstProperty = new Guid("de785645-a122-568b-7b1b-ba5882943579");
            Guid secondProperty = new Guid("bc126543-a122-568b-7b1b-ba5882943098");
            Guid thirdProperty = new Guid("cb987678-a122-568b-7b1b-ba5882943890");
            Guid fourthProperty = new Guid("08db29d5-2abd-421c-877c-1c976144321b");
            Guid secondUser = new Guid("08db29d3-40d0-4898-858a-b279d3144b82");
            Guid thirdUser = new Guid("08db29d3-b5b0-40f0-8ba1-e71ac088f927");
            modelBuilder.Entity<PropertiesDocuments>().Property(b => b.IsActive).HasDefaultValue(true);
            modelBuilder.Entity<Properties>().Property(b => b.PropertyStatus).HasDefaultValue(PropertyStatuses.Ok);
            modelBuilder.Entity<Properties>().Property(b => b.OwnerName).HasDefaultValue("");
            modelBuilder.Entity<PropertiesDocuments>().HasData(
                new PropertiesDocuments {
                DocumentId = new Guid("ac265543-a122-568b-7b1b-ba5882943102"), 
                PropertyId = secondProperty, 
                DocumentURL = "https://sre-dev-bucket.s3.eu-central-1.amazonaws.com/dev/properties/documents/2803pdf-test.pdf", 
                Type = "document",
                IsActive = true
                },
                new PropertiesDocuments
                {
                    DocumentId = new Guid("dd763543-a122-568b-7b1b-ba5882943101"),
                    PropertyId = secondProperty,
                    DocumentURL = "https://sre-dev-bucket.s3.eu-central-1.amazonaws.com/dev/properties/documents/pdf-test.pdf",
                    Type = "document",
                    IsActive = true
                },
                new PropertiesDocuments
                {
                    DocumentId = new Guid("dc656543-a122-568b-7b1b-ba5882943100"),
                    PropertyId = secondProperty,
                    DocumentURL = "https://sre-dev-bucket.s3.eu-central-1.amazonaws.com/dev/properties/images/Rectangle%2012828.png",
                    Type = "image",
                    IsActive = true
                },
                new PropertiesDocuments
                {
                    DocumentId = new Guid("bd767543-a122-568b-7b1b-ba5882943099"),
                    PropertyId = secondProperty,
                    DocumentURL = "https://sre-dev-bucket.s3.eu-central-1.amazonaws.com/dev/properties/images/Rectangle12827.png",
                    Type = "image",
                    IsActive = true
                }
                );
            modelBuilder.Entity<Leases>().HasData(
                new Leases
                {
                    LeaseId = new Guid("ea452543-b435-568b-7b1b-ba5882943187"),
                    LeaseExpirationDate= new DateTime(),
                    DepostiAmount= 1200,
                    PayDay = 5,
                    PropertyId= secondProperty,
                    RentAmount = 700
                }) ;
            modelBuilder.Entity<Properties>().HasData(
                new Properties
                {
                    PropertyId = firstProperty,
                    Address = "OLD 11 Dummy Street Dummy",
                    Zip = "12345",
                    City = "Dummy City",
                    State = "Dummy State",
                    Type = PropertyTypes.SingleFamilyHome,
                    Status = PropertyOccupationStatuses.Vacant,
                    PropertyStatus = PropertyStatuses.Ok,
                    OwnerId = secondUser,
                    CreateAt = DateTime.Now,
                    IsIDVerified = true
                },
                 new Properties
                 {
                     PropertyId = secondProperty,
                     Address = "OLD 12 Dummy Street Dummy",
                     Zip = "12345",
                     City = "Dummy City",
                     State = "Dummy State",
                     Type = PropertyTypes.SingleFamilyHome,
                     Status = PropertyOccupationStatuses.Vacant,
                     PropertyStatus = PropertyStatuses.Ok,
                     OwnerId = secondUser,
                     CreateAt = DateTime.Now,
                     IsIDVerified = true
                 },
                  new Properties
                  {
                      PropertyId = thirdProperty,
                      Address = "OLD 13 Dummy Street Dummy",
                      Zip = "12345",
                      City = "Dummy City",
                      State = "Dummy State",
                      Type = PropertyTypes.SingleFamilyHome,
                      Status = PropertyOccupationStatuses.Vacant,
                      PropertyStatus = PropertyStatuses.Ok,
                      OwnerId = thirdUser,
                      CreateAt = DateTime.Now,
                      IsIDVerified = true
                  },
                   new Properties
                   {
                       PropertyId = fourthProperty,
                       Address = "OLD 14 Dummy Street Dummy",
                       Zip = "12345",
                       City = "Dummy City",
                       State = "Dummy State",
                       Type = PropertyTypes.SingleFamilyHome,
                       Status = PropertyOccupationStatuses.Vacant,
                       PropertyStatus = PropertyStatuses.Ok,
                       OwnerId = thirdUser,
                       CreateAt = DateTime.Now,
                       IsIDVerified = true
                   }
            );
        }
    }
}
