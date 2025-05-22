namespace UserManagement.CQRS.Queries
{
    public class GetControllerByBusinessIdQuery :  IRequest<UsersModel>
    {
        public Guid BusinessId { get; set; }
    }
}
