using UserManagement.CQRS.Models;

namespace UserManagement.CQRS.Queries
{
    public class GetOwnerDetailsByUserInfoIdQuery: IRequest<RegisterControllerModel>
    {
        public Guid UserInfoId { get; set; }
    }
}
