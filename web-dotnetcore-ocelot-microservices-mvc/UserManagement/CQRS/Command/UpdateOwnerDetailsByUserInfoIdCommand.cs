namespace UserManagement.CQRS.Command
{
    public class UpdateOwnerDetailsByUserInfoIdCommand: IRequest<RegisterControllerModel>
    {
        public RegisterControllerModel OwnerAndControllerDetails { get; set; }
    }
}
