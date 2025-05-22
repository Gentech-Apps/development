namespace UserManagement.CQRS.Command
{
    public class VerifyOTPCommand : IRequest<Boolean>
    {
        public string userID { get; set; }
        public string OTP { get; set; }
    }
}
