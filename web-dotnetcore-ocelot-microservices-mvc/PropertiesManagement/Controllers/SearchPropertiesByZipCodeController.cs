using PropertiesManagement.CQRS.Models;
using Newtonsoft.Json;
using PropertiesManagement.CQRS.Queries;
using static MassTransit.ValidationResultExtensions;
using PropertiesManagement.Database;

namespace PropertiesManagement.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SearchPropertiesByZipCodeController : ControllerBase
    {
        public readonly IMediator _mediator;

        public SearchPropertiesByZipCodeController(IMediator mediator)
        {
            _mediator = mediator;
        }

        [HttpPost]
        public async Task<IActionResult> post([FromBody] Properties propertyModel)
        {
            List<PropertiesModel> responseData = await _mediator.Send(new GetPropertiesByZipCodeQuery
            {
                zipcode = propertyModel.Zip,
                street = propertyModel.Address,
            }) ;
            var serializeResponse = JsonConvert.SerializeObject(responseData);
            if (responseData.Count == 0)
            {
                Dictionary<String, String> response= new Dictionary<string, string>();
                response.Add("Message", "Data not found");
                return Ok(response);
            }
            return Ok(serializeResponse);
        }

    }
}
