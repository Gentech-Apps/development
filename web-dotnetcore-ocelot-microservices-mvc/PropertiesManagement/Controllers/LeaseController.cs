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
    public class LeaseController : Controller
    {
        private readonly IMediator _mediator;

        public LeaseController(IMediator mediator)
        {
            _mediator = mediator;
        }

        [HttpGet]
        public async Task<IActionResult> GetLeaseByPropertyId(string proeprtyId)
        {
            LeaseModel responseData = await _mediator.Send(new GetLeaseByPropertyIdQuery
            {
                PropertyId = proeprtyId,
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

        [HttpPost]
        public async Task<IActionResult> AddLease(LeaseModel leaseModel)
        {
            LeaseModel responseData = await _mediator.Send(new AddLeaseCommand
            {
                Model = leaseModel,
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

        [HttpPut]
        public async Task<IActionResult> UpdateLease(LeaseModel leaseModel)
        {
            Leases responseData = await _mediator.Send(new UpdateLeaseCommand
            {
                Model = leaseModel,
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
