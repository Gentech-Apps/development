namespace UserManagement.CQRS.Queries
{
    public class GetLastActiveStepQuery : IRequest<string>
    {
        public Guid userId { get; set; }
    }
}
