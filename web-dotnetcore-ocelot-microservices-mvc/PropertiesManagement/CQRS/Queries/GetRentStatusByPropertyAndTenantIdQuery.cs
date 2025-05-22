namespace PropertiesManagement.CQRS.Queries
{
    public class GetRentStatusByPropertyAndTenantIdQuery: IRequest<List<RentStatus>>
    {
        public string TenantId { get; set; }
        public string PropertyId { get; set; }

    }
}
