namespace UserManagement.CQRS.Queries
{
    public class GetOwnerDetailsByUserInfoIdQueryHandler: IRequestHandler<GetOwnerDetailsByUserInfoIdQuery, RegisterControllerModel>
    {
        IOwnerAndControllerRepository _ownerAndControllerRepository;

        public GetOwnerDetailsByUserInfoIdQueryHandler(IOwnerAndControllerRepository ownerAndControllerRepository)
        {
            _ownerAndControllerRepository = ownerAndControllerRepository;
        }

        public Task<RegisterControllerModel> Handle(GetOwnerDetailsByUserInfoIdQuery request, CancellationToken cancellationToken)
        {
            return _ownerAndControllerRepository.GetOwnerDetailsByUserInfoId(request.UserInfoId);
        }
    }
}
