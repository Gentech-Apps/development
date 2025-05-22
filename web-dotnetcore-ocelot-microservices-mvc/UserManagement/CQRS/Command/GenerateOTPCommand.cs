namespace UserManagement.CQRS.Command
{
    public class GenerateOTPCommand : IRequest<string>
    {
        public Guid userID { get; set; }
    }
}
