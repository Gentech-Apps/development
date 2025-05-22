using System.Text;

namespace UserManagement.Helper
{
    public class HelperMapper
    {
        public JsonResult CreateJsonResponse(dynamic data, bool allowGet = false, bool camelCaseNames = true)
        {
            return JsonWithProperties(data,
                        "application/json",
                        Encoding.UTF8,
            camelCaseNames);
        }


        public JsonResult CreateJsonResponse(bool result, dynamic data, string error, string message, bool allowGet = false, bool camelCaseNames = true)

        {
            return JsonWithProperties(new
            {
                Result = result,
                Error = error,
                Data = data,
                Message = message
            },
                        "application/json",
                        Encoding.UTF8,
            camelCaseNames);
        }

        public JsonResult CreateJsonResponse(bool result, dynamic data, string message)

        {
            return JsonWithProperties(new
            {
                Result = result,
                Data = data,
                Message = message
            },
                        "application/json",
                        Encoding.UTF8,
            false);
        }
        public JsonResult JsonWithProperties(object data, string contentType, System.Text.Encoding contentEncoding, bool camelCaseNames = true)
        {
            return new JsonNetResult(data, camelCaseNames)
            {
                ContentType = contentType
            };
        }


        public JsonResult CreateJsonObject(dynamic data, bool camelCaseNames = true)
        {
            return JsonWithProperties(new
            {
                Data = data
            },
                        "application/json",
                        Encoding.UTF8,
            camelCaseNames);
        }

    }
}
