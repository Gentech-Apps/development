namespace UserManagement.CQRS.Queries
{
    public class GetOwnersByBusinessIdAndUserIdQuery : IRequest<OwnersDetailModel>
    {
        public string BusinessId { get; set; }
    }
}