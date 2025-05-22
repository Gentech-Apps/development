namespace UserManagement.CQRS.Queries
{
    public class GetUserInfoByUserInfoIdQuery: IRequest<UsersInfo>
    {
        public string UserInfoId { get; set; } 
    }
}
