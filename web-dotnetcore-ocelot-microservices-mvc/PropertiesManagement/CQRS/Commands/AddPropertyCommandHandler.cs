using PropertiesManagement.CQRS.Models;
using PropertiesManagement.CQRS.Repositories.Interfaces;
using PropertiesManagement.Database;

namespace PropertiesManagement.CQRS.Commands
{
    public class AddPropertyCommandHandler : IRequestHandler<AddPropertyCommand,Properties>
    {
        private readonly IPropertiesRepository _propertyRepository;

        public AddPropertyCommandHandler(IPropertiesRepository propertyRepository)
        {
            _propertyRepository = propertyRepository;
        }

        public Task<Properties> Handle(AddPropertyCommand command, CancellationToken cancellationToken)
        {
            return _propertyRepository.AddPropertyAsync(command.propertyModel);
        }
    }
}
