namespace UserManagement.CQRS.Command
{
    public class AddIndividualLandlordCommand : IRequest<UsersInfo>
    {
        public UsersInfo UserInfo { get; set;}
    }
}
