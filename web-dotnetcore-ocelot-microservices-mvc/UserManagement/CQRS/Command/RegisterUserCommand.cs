namespace UserManagement.CQRS.Command
{
    public class RegisterUserCommand : IRequest<UserAccount>
    {
        public RegisterUserModel registerUserData { get; set; }
    }
}
