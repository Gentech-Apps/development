namespace UserManagement.CQRS.Command
{
    public class UpdateUserInfoCommand : IRequest<UsersInfo>
    {
        public UsersInfo UserInfo { get; set; }
    }
}
