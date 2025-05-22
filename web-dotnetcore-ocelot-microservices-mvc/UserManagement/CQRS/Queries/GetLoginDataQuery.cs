namespace UserManagement.CQRS.Queries
{
    public class GetLoginDataQuery : IRequest<UserAccount>
    {
        public AuthenticationRequest QueryRequest { get; set; }
    }
}
