namespace UserManagement.CQRS.Repositories.Interfaces
{
    public interface IOTPRepository
    {
        public Task<string> GenerateOTPAsync(Guid userID);
        public Task<Boolean> VerifyOTPAsync(string userID, string OTP);
    }
}
