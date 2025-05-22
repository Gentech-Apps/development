namespace UserManagement.CQRS.Repositories.Implementation
{
    public class DwollaDocumentRepository : IDwollaDocumentRepository
    {
        private readonly DatabaseContext _databaseContext;

        public DwollaDocumentRepository(DatabaseContext databaseContext)
        {
            _databaseContext = databaseContext;
        }

        public async Task<DwollaVerificationDocuments> AddDwollaVerificationDocumentsAsync(DwollaVerificationDocuments data)
        {
            DwollaVerificationDocuments result = _databaseContext.DwollaVerificationDocuments.Add(data).Entity;
            await _databaseContext.SaveChangesAsync();
            return result;

        }
    }
}
