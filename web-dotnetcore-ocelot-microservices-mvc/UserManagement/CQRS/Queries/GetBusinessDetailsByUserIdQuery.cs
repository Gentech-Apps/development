namespace UserManagement.CQRS.Queries
{
    public class GetBusinessDetailsByUserIdQuery : IRequest<BusinessDetailsModel>
    {
        public Guid UserId { get; set; }
    }
}