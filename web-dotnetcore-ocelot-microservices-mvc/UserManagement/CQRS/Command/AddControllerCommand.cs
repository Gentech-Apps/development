namespace UserManagement.CQRS.Command
{
    public class AddControllerCommand : IRequest<OwnersAndControllers>
    {
        public RegisterControllerModel RegisterOwnerAndControllerModel { get; set; }
    }
}
