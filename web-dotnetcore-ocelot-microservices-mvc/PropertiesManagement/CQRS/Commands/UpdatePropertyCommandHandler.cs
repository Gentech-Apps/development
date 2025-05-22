using PropertiesManagement.CQRS.Models;
using PropertiesManagement.CQRS.Repositories.Interfaces;
using PropertiesManagement.Database;

namespace PropertiesManagement.CQRS.Commands
{
    public class UpdatePropertyCommandHandler : IRequestHandler<UpdatePropertyCommand,Properties>
    {
        private readonly IPropertiesRepository _propertyRepository;

        public UpdatePropertyCommandHandler(IPropertiesRepository propertyRepository)
        {
            _propertyRepository = propertyRepository;
        }

        public Task<Properties> Handle(UpdatePropertyCommand command, CancellationToken cancellationToken)
        {
            return _propertyRepository.UpdatePropertyAsync(command.propertyModel);
            
        }
    }
}
