using Going.Plaid;
using Going.Plaid.Entity;
using Going.Plaid.Item;
using Going.Plaid.Link;
using Going.Plaid.Processor;
using Microsoft.Extensions.Options;
using UserManagement.CQRS.Models;
using UserManagement.DwollaOperations.Model.Plaid;

namespace UserManagement.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PlaidController : ControllerBase
    {
        private readonly PlaidCredentials _credentials;
        private readonly PlaidClient _client;
        private readonly IMediator _mediator;

        public PlaidController(IOptions<PlaidCredentials> credantials, PlaidClient client, IMediator mediator)
        {
            _credentials = credantials.Value;
            _client = client;
          _mediator = mediator;
        }

        [HttpGet]
        [Route("CreateLinkToken")]
        public async Task<IActionResult> CreateLinkToken(string clientName, string countryCodes)
        {
            HelperMapper helperMapper = new HelperMapper();
            JsonResult jsonResult;
            try
            {
                var response = await _client.LinkTokenCreateAsync(
                    new LinkTokenCreateRequest()
                    {
                        AccessToken = null,
                        User = new LinkTokenCreateRequestUser { ClientUserId = Guid.NewGuid().ToString(), },
                        ClientName = clientName,
                        Products =  _credentials!.Products!.Split(',').Select(p => Enum.Parse<Products>(p, true)).ToArray() ,
                        Language = Language.English, // TODO: Should pick up from config
                        CountryCodes = countryCodes.Split(',').Select(p => Enum.Parse<CountryCode>(p, true)).ToArray(),
                    });

                if (response.Error is not null)
                {
                    jsonResult = helperMapper.CreateJsonResponse(false, null, response.Error.ErrorMessage);
                }
                else 
                {
                    jsonResult = helperMapper.CreateJsonResponse(true, response, "MESSAGE.SUCCESS");
                }
            }
            catch (Exception ex)
            {
                jsonResult = helperMapper.CreateJsonResponse(false, null, ex.ToString());
            }
            return jsonResult;
        }

        [HttpPost]
        [Route("ExchangePublicToken")]
        public async Task<IActionResult> ExchangePublicToken(string publicToken)
        {
            HelperMapper helperMapper = new HelperMapper();
            JsonResult jsonResult;
            var request = new ItemPublicTokenExchangeRequest()
            {
                PublicToken = publicToken
            };

            var response = await _client.ItemPublicTokenExchangeAsync(request);

            if (response.Error is not null)
            {
                return jsonResult = helperMapper.CreateJsonResponse(false, null, response.Error.ErrorMessage);
            }
            else
            {
                /*_credentials.AccessToken = response.AccessToken;
                _credentials.ItemId = response.ItemId;*/
                return jsonResult = helperMapper.CreateJsonResponse(true, response, "MESSAGE.SUCCESS");
            }
            //return jsonResult;
        }
        [HttpPost]
        [Route("CreateProcessToken")]

        public async Task<IActionResult> CreateProcessorToken(CreateProcessorModel createProcessorModel)
        {
            HelperMapper helperMapper = new HelperMapper();
            JsonResult jsonResult;
            var request = new ProcessorTokenCreateRequest
            {
                AccessToken = createProcessorModel.AccessToken,
                AccountId = createProcessorModel.AccountId,
                Processor = ProcessorTokenCreateRequestProcessorEnum.Dwolla
            };
            var response = await _client.ProcessorTokenCreateAsync(request);

            if (response.Error is not null)
            {
                if (response.Error.ErrorCode.Equals("INVALID_ACCOUNT_ID")) {
                    return jsonResult = helperMapper.CreateJsonResponse(false, null, response.Error.ErrorCode);
                }
                return jsonResult = helperMapper.CreateJsonResponse(false, null, response.Error.ErrorMessage);
            }
            else
            {
                //send request to dwolla and generate the funding source
                DwollaOperation operation = new DwollaOperation();
                CreatePlaidFundingSourceRequest req = new CreatePlaidFundingSourceRequest();
                req.PlaidToken = response.ProcessorToken;
                req.Name = createProcessorModel.UserName;

                UsersInfo userInfoRecord = await _mediator.Send(new GetUserInfoByUserInfoIdQuery { UserInfoId = createProcessorModel.UserInfoId });

                var location = await operation.CreateFundingSource(userInfoRecord.DwollaVerifcationToken, req);
                if (location["response"].Equals("false"))
                {
                    return jsonResult = helperMapper.CreateJsonResponse(false, null, location["value"]);
                }
                else {
                    var status = await operation.GetVerificationStatusCustomer(location["value"].ToString());
                    FundingSource fundingSource = new FundingSource();
                    fundingSource.PlaidProcessorToken = req.PlaidToken;
                    fundingSource.FundingSourceDwollaToken = location["value"].ToString();
                    fundingSource.FundingSourceDwollaStatus = status;
                    fundingSource.UserInfoId = new Guid(createProcessorModel.UserInfoId);
                    FundingSource savedFundingSourcerecord = await _mediator.Send(new AddFundingSourceCommand { fundingSource = fundingSource });
                    jsonResult = helperMapper.CreateJsonResponse(true, savedFundingSourcerecord, "MESSAGE.SUCCESS");
                    return jsonResult;
                }
            }
        }

    }
}
