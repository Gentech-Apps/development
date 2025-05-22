using ServiceRequestManagement.CQRS.Commands;
using ServiceRequestManagement.CQRS.Models;
using ServiceRequestManagement.CQRS.Queries;
using ServiceRequestManagement.database;
using ServiceRequestManagement.Helper;

namespace ServiceRequestManagement.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ServiceRequestController : Controller
    {
        private readonly MediatR.IMediator _mediator;
        private readonly IBus _bus;

        public ServiceRequestController(MediatR.IMediator mediator)
        {
            _mediator = mediator;
           
        }

        [HttpPost]
        [Route("GetServiceRequests")]
        public async Task<IActionResult> GetServiceRequests(ServiceRequestsRequestModel model)
        {
            List<ServiceRequestModel> responseData = await _mediator.Send(new GetServiceRequestsQuery { serviceRequestsRequestModel = model});


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

        [HttpPost]
        [Route("AddServiceRequest")]

        public async Task<IActionResult> AddServiceRequest(ServiceRequestModel requestService)
        {
            ServiceRequest responseData = await _mediator.Send(new AddServiceRequestCommand { serviceRequest = requestService });
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

        [HttpPost]
        [Route("GetServiceRequestDashboardSummary")]
        public async Task<IActionResult> GetServiceRequestDashboardSummary(List<string> propertIds)
        {
            ServiceRequestDashboardSummaryModel responseData = await _mediator.Send(new GetServiceRequestDashboardSummaryQuery { PropertiesIds = propertIds });
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

        [HttpGet]
        public async Task<IActionResult> GetServiceRequestByID(string serviceRequestID)
        {
            ServiceRequestModel responseData = await _mediator.Send(new GetServiceRequestByServiceRequestIDQuery { ServiceRequestID = serviceRequestID });
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
    
