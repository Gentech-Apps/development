namespace UserManagement.CQRS.Queries
{
    public class GetUserByEmailQuery : IRequest<Users>
    {
        public string Email { get; set; }
    }
}
