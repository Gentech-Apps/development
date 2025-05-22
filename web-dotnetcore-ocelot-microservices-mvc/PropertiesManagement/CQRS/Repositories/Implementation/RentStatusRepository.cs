namespace PropertiesManagement.CQRS.Repositories.Implementation
{
    public class RentStatusRepository: IRentStatusRepository
    {
        private readonly DatabaseContext _databaseContext;

        public RentStatusRepository(DatabaseContext databaseContext)
        {
            _databaseContext = databaseContext;
        }

        public async Task<List<RentStatus>> GetRentStatusByPropertyAndTenantId(string PropertyId, string TenantId)
        {
            try
            {
                List<RentStatus> result = await (from rs in _databaseContext.RentStatus
                                             where rs.PropertyId.ToString().Equals(PropertyId) && rs.TenantId.ToString().Equals(TenantId)
                                             select rs).ToListAsync();
                return result;
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.ToString());
                return null;
            }
            return null;
        }
    }
}
