namespace UserManagement.CQRS.Queries
{
    public class GetBusinessByEmailQuery : IRequest<UsersInfo>
    {
        public string Email { get; set; }
    }
}
