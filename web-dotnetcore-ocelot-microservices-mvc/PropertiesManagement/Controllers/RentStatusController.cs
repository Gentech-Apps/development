
namespace PropertiesManagement.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RentStatusController : Controller
    {
        public readonly IMediator _mediator;

        public RentStatusController(IMediator mediator)
        {
            _mediator = mediator;
        }

        [HttpGet]
        public async Task<IActionResult> GetRentStatusByPropertyAndTenantID(string PropertyId, string TenantId)
        {
            List<RentStatus> responseData = await _mediator.Send(new GetRentStatusByPropertyAndTenantIdQuery { PropertyId = PropertyId , TenantId = TenantId});
            HelperMapper helperMapper = new HelperMapper();
            JsonResult jsonResult;
            if (responseData != null)
            {
                jsonResult = helperMapper.CreateJsonResponse(true, responseData, "MESSAGE.SUCCESS");
            }
            else
            {
                jsonResult = helperMapper.CreateJsonResponse(false, responseData, "MESSAGE.NOT_FOUND");
            }

            return jsonResult;
        }

    }
}
