namespace UserManagement.CQRS.Command
{
    public class UpdateUserByUserIdCommand : IRequest<Users>
    {
       public Users User { get; set; }
    }
}
