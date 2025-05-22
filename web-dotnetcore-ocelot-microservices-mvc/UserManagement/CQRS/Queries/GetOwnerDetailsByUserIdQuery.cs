namespace UserManagement.CQRS.Queries
{
    public class GetOwnerDetailsByUserIdQuery : IRequest<UsersModel>
    {
        public Guid UserId { get; set; }  
    }
}
