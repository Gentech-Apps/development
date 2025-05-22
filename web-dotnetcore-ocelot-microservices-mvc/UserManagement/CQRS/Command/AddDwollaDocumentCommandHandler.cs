namespace UserManagement.CQRS.Command
{
    public class AddDwollaDocumentCommandHandler : IRequestHandler<AddDwollaDocumentCommand, DwollaVerificationDocuments>
    {
        private readonly IDwollaDocumentRepository _dwollaDocumentRepository;

        public AddDwollaDocumentCommandHandler(IDwollaDocumentRepository dwollaDocumentRepository)
        {
            _dwollaDocumentRepository = dwollaDocumentRepository;
        }

        public Task<DwollaVerificationDocuments> Handle(AddDwollaDocumentCommand request, CancellationToken cancellationToken)
        {
            return _dwollaDocumentRepository.AddDwollaVerificationDocumentsAsync(request.documentsData);
        }
    }
}
