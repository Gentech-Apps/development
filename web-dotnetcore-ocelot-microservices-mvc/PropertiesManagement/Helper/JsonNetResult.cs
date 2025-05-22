
using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;
using JsonSerializer = Newtonsoft.Json.JsonSerializer;

namespace PropertiesManagement.Helper
{
    public class JsonNetResult : JsonResult

	{
		public JsonNetResult(object data, bool camelCaseNames = false) : base(data)
		{
			Settings = new JsonSerializerSettings
			{
				ReferenceLoopHandling = ReferenceLoopHandling.Ignore
			};

			if (camelCaseNames)
			{
				Settings.ContractResolver = new CamelCasePropertyNamesContractResolver();
			}
		}

		public JsonSerializerSettings Settings { get; private set; }

		public override Task ExecuteResultAsync(ActionContext context)
		{
			if (context == null)
				throw new ArgumentNullException("context");

			HttpResponse response = context.HttpContext.Response;
			response.ContentType = string.IsNullOrEmpty(this.ContentType) ? "application/json" : this.ContentType;


			var scriptSerializer = JsonSerializer.Create(this.Settings);


			using (var sw = new StringWriter())
			{
				scriptSerializer.Serialize(sw, this.Value);
				response.WriteAsync(sw.ToString());
			}

			return Task.CompletedTask;
		}
	}
}
