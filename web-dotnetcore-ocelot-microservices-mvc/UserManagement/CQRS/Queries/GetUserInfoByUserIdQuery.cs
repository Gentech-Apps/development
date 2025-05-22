namespace UserManagement.CQRS.Queries
{
    public class GetUserInfoByUserIdQuery : IRequest<UsersInfo>
    {
        public Guid UserId { get; set; }
    }
}
