using PropertiesManagement.Database;

namespace PropertiesManagement.CQRS.Commands
{
    public class AddImageCommand : IRequest<PropertiesDocuments>
    {
        public PropertiesDocuments Document { get; set; }
    }
}
