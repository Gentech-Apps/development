using Microsoft.AspNetCore.Mvc;
using PropertiesManagement.CQRS.Commands;
using PropertiesManagement.CQRS.Models;
using PropertiesManagement.CQRS.Queries;
using PropertiesManagement.Database;
using PropertiesManagement.Helper;

namespace PropertiesManagement.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DashboardController : Controller
    {
        private readonly IMediator _mediator;

        public DashboardController(IMediator mediator)
        {
            _mediator = mediator;
        }

        [HttpPost]
        public async Task<IActionResult> GetPropertyAggregation(string ownerId)
        {
            HelperMapper helperMapper = new HelperMapper();
            PropertiesAggregationModel responseData = await _mediator.Send(new GetPropertiesAggregationQuery
            {
                OwnerId = ownerId,
            });

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
        [Route("GetTenantDashboard")]
        public async Task<IActionResult> GetTenantDashboard(string TenantId)
        {
            HelperMapper helperMapper = new HelperMapper();
            var responseData = await _mediator.Send(new GetTenantDashboardQuery
            {
                TenantID = TenantId
            }); 

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
