namespace UserManagement.CQRS.Command
{
    public class AddUserCommand : IRequest<UsersModel>
    {
        public UsersModel userData { get; set; }
    }
}
