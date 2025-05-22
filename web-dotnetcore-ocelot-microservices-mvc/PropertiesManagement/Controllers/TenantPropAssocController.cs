using Microsoft.AspNetCore.Mvc;
using PropertiesManagement.CQRS.Commands;
using PropertiesManagement.CQRS.Models;
using PropertiesManagement.Database;
using PropertiesManagement.Helper;

namespace PropertiesManagement.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TenantPropAssocController : Controller
    {
        private readonly IMediator _mediator;

        public TenantPropAssocController(IMediator mediator)
        {
            _mediator = mediator;
        }

        [HttpPost]
        public async Task<IActionResult> AddTenantPropAsoc(TenantPropAssoc tenantPropAssoc)
        {
            var responseData = await _mediator.Send(new AddTenantPropCommand { tenantProp = tenantPropAssoc});
            Properties requestProperty = new Properties
            {
                PropertyId = (Guid)tenantPropAssoc.PropertyId,
                Status = Properties.PropertyOccupationStatuses.TenantOccupied
            };
            Properties propResponse = await _mediator.Send(new UpdatePropertyCommand
            {
                propertyModel = requestProperty,
            });
            
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
