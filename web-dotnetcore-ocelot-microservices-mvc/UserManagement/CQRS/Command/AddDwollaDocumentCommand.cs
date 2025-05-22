namespace UserManagement.CQRS.Command
{
    public class AddDwollaDocumentCommand : IRequest<DwollaVerificationDocuments>
    {
        public DwollaVerificationDocuments documentsData { get; set; }
    }
}
