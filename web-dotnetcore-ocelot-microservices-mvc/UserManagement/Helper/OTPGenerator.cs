using System.Text;

namespace UserManagement.Helper
{
    public class OTPGenerator
    {
        public string GenerateOTP()
        {
            Random generator = new Random();
            String r = generator.Next(0, 1000000).ToString("D6");
            return r;
        }
    }
}
