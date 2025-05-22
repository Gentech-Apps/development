namespace UserManagement.CQRS.Command
{
    public class AddControllerCommandHandler : IRequestHandler<AddControllerCommand, OwnersAndControllers>
    {
        private readonly IOwnerAndControllerRepository _ownerAndControllerRepository;

        public AddControllerCommandHandler(IOwnerAndControllerRepository ownerAndControllerRepository)
        {
            _ownerAndControllerRepository = ownerAndControllerRepository;
        }

        public Task<OwnersAndControllers> Handle(AddControllerCommand request, CancellationToken cancellationToken)
        {
            return _ownerAndControllerRepository.AddOwnerAndControllerAsync(request.RegisterOwnerAndControllerModel);
        }
    }
}
