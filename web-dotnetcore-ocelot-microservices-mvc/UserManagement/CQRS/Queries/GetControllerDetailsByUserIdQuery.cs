namespace UserManagement.CQRS.Queries
{
    public class GetControllerDetailsByUserIdQuery: IRequest<UsersModel>
    {
        public Guid UserId { get; set; }
    }
}
