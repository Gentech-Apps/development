namespace UserManagement.CQRS.Command
{
    public class UpdateOwnerDetailsByUserInfoIdCommandHandler: IRequestHandler<UpdateOwnerDetailsByUserInfoIdCommand, RegisterControllerModel>
    {
        IOwnerAndControllerRepository _ownerAndControllerRepository;

        public UpdateOwnerDetailsByUserInfoIdCommandHandler(IOwnerAndControllerRepository ownerAndControllerRepository)
        {
            _ownerAndControllerRepository = ownerAndControllerRepository;
        }

        public Task<RegisterControllerModel> Handle(UpdateOwnerDetailsByUserInfoIdCommand request, CancellationToken cancellationToken)
        {
            return _ownerAndControllerRepository.UpdateOwnerAndControllerDetails(request.OwnerAndControllerDetails);
        }
    }
}
