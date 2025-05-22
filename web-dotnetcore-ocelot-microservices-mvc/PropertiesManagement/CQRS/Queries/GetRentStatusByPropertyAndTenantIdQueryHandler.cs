namespace PropertiesManagement.CQRS.Queries
{
    public class GetRentStatusByPropertyAndTenantIdQueryHandler : IRequestHandler<GetRentStatusByPropertyAndTenantIdQuery, List<RentStatus>>
    {
        public  readonly IRentStatusRepository _rentStatusRepository;

        public GetRentStatusByPropertyAndTenantIdQueryHandler(IRentStatusRepository rentStatusRepository)
        {
            _rentStatusRepository = rentStatusRepository;
        }
        public async Task<List<RentStatus>> Handle(GetRentStatusByPropertyAndTenantIdQuery request, CancellationToken cancellationToken)
        {
            return await _rentStatusRepository.GetRentStatusByPropertyAndTenantId(request.PropertyId, request.TenantId);
        }
    }
}
