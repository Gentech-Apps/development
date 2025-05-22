using System.IO;

namespace UserManagement.DwollaOperations
{
    public class File
    {
        public Stream Stream { get; set; }
        public string Filename { get; set; }
        public string ContentType { get; set; }
    }
}