using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Server.Kestrel.Core.Features;
using PropertiesManagement.CQRS.Commands;
using PropertiesManagement.CQRS.Models;
using PropertiesManagement.CQRS.Queries;
using PropertiesManagement.Database;
using PropertiesManagement.Helper;

namespace PropertiesManagement.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PropertyController : Controller
    {
        private readonly IMediator _mediator;

        public PropertyController(IMediator mediator)
        {
            _mediator = mediator;
        }
        [HttpPost]
        public async Task<IActionResult> AddProperty( Properties requestProperty)
        {

            Properties responseData = await _mediator.Send(new AddPropertyCommand
            {
                propertyModel= requestProperty,
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

        [HttpGet]
        public async Task<IActionResult> GetPropertiesByOwnerID(string OwnerId)
        {
            var responseData = await _mediator.Send(new GetPropertiesByOwnersIDQuery { ownerID = OwnerId });
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
        [Route("GetPropertiesportfolio")]
        public async Task<IActionResult> GetPropertiesportfolioByOwnerID(string OwnerId, string pageNumber, string pageSize)
        {
            var responseData = await _mediator.Send(new GetPropertiesPortfolioByOwnersIDQuery { ownerID = OwnerId, pageNumber =int.Parse(pageNumber),pageSize = int.Parse(pageSize) });
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
        [Route("GetPropertyDetails")]
        public async Task<IActionResult> GetPropertyDetails(string OwnerId, string PropertyId)
        {
            var responseData = await _mediator.Send(new GetPropertyDetailsQuery{ ownerId = OwnerId, propertyId= PropertyId });
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
        [HttpPut]
        public async Task<IActionResult> UpdateProperty(Properties requestProperty)
        {
            Properties responseData = await _mediator.Send(new UpdatePropertyCommand
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
