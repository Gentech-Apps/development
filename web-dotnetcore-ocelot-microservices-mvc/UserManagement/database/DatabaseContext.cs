using MassTransit;
using Microsoft.EntityFrameworkCore;
using UserManagement.Helper;

namespace UserManagement.database
{
    public class DatabaseContext : DbContext
    {
        public DatabaseContext(DbContextOptions<DatabaseContext> options) : base(options)
        {

        }
        public DbSet<Users> Users { get; set; }
        public DbSet<UsersInfo> UsersInfo { get; set; }
        public DbSet<OTPVerifications> OTPVerifications { get; set; }
        public DbSet<Business> Businesses { get; set; }
        public DbSet<OwnersAndControllers> OwnersAndControllers { get; set; }
        public DbSet<FundingSource> FundingSources { get; set; }
        public DbSet<DwollaVerificationDocuments> DwollaVerificationDocuments { get; set; }
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            string firstSalt = Helper.EncryptionService.GenerateSalt();
            string firstHash = Helper.EncryptionService.ComputeHash("Test@1234", firstSalt);
            Guid firstUser = new Guid("08db29d2-b133-4cf8-805e-4f63083effca");
            Guid secondUser = new Guid("08db29d3-40d0-4898-858a-b279d3144b82");
            Guid thirdUser = new Guid("08db29d3-b5b0-40f0-8ba1-e71ac088f927");
            Guid firstCompany = new Guid("08dc5678-b5b0-40f0-8ba1-1a3ed088f978");
            Guid secondCompany = new Guid("08fe0990-b5b0-40f0-8ba1-1a3ed01a5d6f");
            modelBuilder.Entity<Users>().HasData(
                new Users { UserId = firstUser, Email = "admin@sre.com", PasswordHash = firstHash, PasswordSalt = firstSalt, Role = "admin", IsPhoneNoVerified = true, IsActive=true },
                new Users { UserId = secondUser, Email = "test1@sre.com", PasswordHash = firstHash, PasswordSalt = firstSalt, Role = "landlord", IsPhoneNoVerified = true, IsActive = true },
                new Users { UserId = thirdUser, Email = "test2@sre.com", PasswordHash = firstHash, PasswordSalt = firstSalt, Role = "landlord", IsPhoneNoVerified = true, IsActive = true }
            );
           // modelBuilder.Entity<UsersInfo>().HasData(
             //new UsersInfo { UserinfoId = new Guid("08db29d2-b133-4cf8-805e-4f63083effcc"), FirstName = "Admin", LastName = "Admin"},
             //new UsersInfo { UserinfoId = new Guid("08db29d2-b133-4cf8-805e-4f63083effcd"), FirstName = "Test", LastName = "User1"},
             //new UsersInfo { UserinfoId = new Guid("08db29d2-b133-4cf8-805e-4f63083effce"), FirstName = "Test", LastName = "User2"}
             //new UsersInfo { UserinfoId = new Guid("08db29d2-b133-4cf8-805e-4f63083effce"), FirstName = "Test1", LastName = "User1", AddressLine1 = "Add1", AddressLine2 = "Add2", City = "city1", State = "state1", ZipCode = "123456", Country = "Country1", DOB = new DateOnly() , DwollaVerificationStatus = "Pending", SSN = "123456789", DwollaVerifcationToken = "DwollaVerifcationToken1", CreatedDate = DateTime.Now },
             //new UsersInfo { UserinfoId = new Guid("08db29d2-b133-4cf8-805e-4f63083effcf"), FirstName = "Test2", LastName = "User2", AddressLine1 = "AddLine1", AddressLine2 = "AddLine2", City = "city2", State = "state1", ZipCode = "223466", Country = "Country1", DOB = new DateOnly(), DwollaVerificationStatus = "Pending", SSN = "123456789", DwollaVerifcationToken = "DwollaVerifcationToken1", CreatedDate = DateTime.Now },
             //new UsersInfo { UserinfoId = new Guid("08db29d2-b133-4cf8-805e-4f63083effcg"), FirstName = "Test3", LastName = "User3", AddressLine1 = "AddressLine1", AddressLine2 = "AddressLine2", City = "city3", State = "state1", ZipCode = "113455", Country = "Country1", DOB = new DateOnly(), DwollaVerificationStatus = "Pending", SSN = "123456789", DwollaVerifcationToken = "DwollaVerifcationToken1", CreatedDate = DateTime.Now }
             //);
        }
    }
}
