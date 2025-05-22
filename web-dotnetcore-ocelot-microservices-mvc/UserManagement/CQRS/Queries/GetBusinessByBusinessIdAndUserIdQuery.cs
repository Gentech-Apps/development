namespace UserManagement.CQRS.Queries
{
    public class GetBusinessByBusinessIdAndUserIdQuery : IRequest<Business>
    {
        public string BusinessId { get; set; }
        public string UserId { get; set; }
    }
}
