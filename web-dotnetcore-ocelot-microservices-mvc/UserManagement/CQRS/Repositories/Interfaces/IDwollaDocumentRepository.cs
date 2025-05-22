namespace UserManagement.CQRS.Repositories.Interfaces
{
    public interface IDwollaDocumentRepository
    {
        public Task<DwollaVerificationDocuments> AddDwollaVerificationDocumentsAsync(DwollaVerificationDocuments data);
    }
}
