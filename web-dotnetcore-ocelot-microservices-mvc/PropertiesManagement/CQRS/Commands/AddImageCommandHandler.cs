using PropertiesManagement.CQRS.Repositories.Interfaces;
using PropertiesManagement.Database;

namespace PropertiesManagement.CQRS.Commands
{
    public class AddImageCommandHandler : IRequestHandler<AddImageCommand, PropertiesDocuments>
    {
        private readonly IPropertiesRepository _propertyRepository;

        public AddImageCommandHandler(IPropertiesRepository propertyRepository)
        {
            _propertyRepository = propertyRepository;
        }

        public Task<PropertiesDocuments> Handle(AddImageCommand request, CancellationToken cancellationToken)
        {
            return _propertyRepository.AddPropertiesDocuments(request.Document);
        }
    }
}
