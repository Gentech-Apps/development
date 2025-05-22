namespace UserManagement.DwollaOperations.Model.Request
{
    public class UploadDocumentRequest
    {
        public string DocumentType { get; set; }
        public File Document { get; set; }
    }
}