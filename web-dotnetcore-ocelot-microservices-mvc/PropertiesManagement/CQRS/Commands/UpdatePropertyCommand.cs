using PropertiesManagement.CQRS.Models;
using PropertiesManagement.Database;

namespace PropertiesManagement.CQRS.Commands
{
    public class UpdatePropertyCommand : IRequest<Properties>
    {
        public Properties propertyModel { get; set; }
    }
}
