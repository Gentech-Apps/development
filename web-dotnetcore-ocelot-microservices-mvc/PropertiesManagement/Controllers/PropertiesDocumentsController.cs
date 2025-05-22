using Microsoft.AspNetCore.Mvc;
using PropertiesManagement.CQRS.Commands;
using PropertiesManagement.CQRS.Models;
using PropertiesManagement.Database;
using PropertiesManagement.Helper;

namespace PropertiesManagement.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PropertiesDocumentsController : Controller
    {
        private readonly IMediator _mediator;
        public PropertiesDocumentsController(IMediator mediator)
        {
            _mediator = mediator;
        }

        [HttpPost]
        public async Task<IActionResult> AddDocument(PropertiesDocuments propertyDocument)
        {
            PropertiesDocuments responseData = await _mediator.Send(new AddImageCommand
            {
                Document = propertyDocument,
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
