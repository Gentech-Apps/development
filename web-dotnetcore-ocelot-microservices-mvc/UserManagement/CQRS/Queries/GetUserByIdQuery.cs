namespace UserManagement.CQRS.Queries
{
    public class GetUserByIdQuery : IRequest<UsersModel>
    {
        public Guid UserId { get; set; }
    }
}
