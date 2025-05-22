namespace UserManagement.CQRS.Command
{
    public class RegisterBusinessCommand: IRequest<Business>
    {
        public RegisterBusinessModel registerBusinessModel { get; set; }
    }
}
