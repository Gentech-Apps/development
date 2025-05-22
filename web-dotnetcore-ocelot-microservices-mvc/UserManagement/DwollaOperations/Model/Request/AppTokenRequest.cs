namespace UserManagement.DwollaOperations.Model.Request
{
    public class AppTokenRequest
    {
        public string Key { get; set; }
        public string Secret { get; set; }
        public string GrantType => "client_credentials";
    }
}