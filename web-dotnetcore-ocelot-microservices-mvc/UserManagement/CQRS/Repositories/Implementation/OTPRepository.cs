using MediatR;
using UserManagement.CQRS.Repositories.Interfaces;
using UserManagement.database;

namespace UserManagement.CQRS.Repositories.Implementation
{
    public class OTPRepository : IOTPRepository
    {
        private readonly DatabaseContext _databaseContext;
        public OTPRepository(DatabaseContext databaseContext)
        {
            _databaseContext = databaseContext;
        }
        public async Task<string> GenerateOTPAsync(Guid userId)
        {
            OTPGenerator generator = new OTPGenerator();
            string otp = generator.GenerateOTP();
            // insert into Data Base
            OTPVerifications varificationData = _databaseContext.OTPVerifications.Where(b => b.UserId == userId.ToString()).FirstOrDefault();
            if (varificationData != null)
            {
                varificationData.OPT = otp;
                varificationData.CreatedAt= DateTime.Now;
                _databaseContext.OTPVerifications.Update(varificationData);
                await _databaseContext.SaveChangesAsync();
            }
            else 
            {
                OTPVerifications oTPVerifications = new OTPVerifications();
                oTPVerifications.UserId = userId.ToString();
                oTPVerifications.OPT = otp;
                oTPVerifications.CreatedAt = DateTime.Now;
                _databaseContext.OTPVerifications.Add(oTPVerifications);
                await _databaseContext.SaveChangesAsync();
            }
           
            return  otp;
        }

        public async Task<Boolean> VerifyOTPAsync(string userId, string OTP)
        {
            //check is data exist in otp verification
            //var output = await _databaseContext.OTPVerifications.FindAsync(userId, OTP);
            var output = _databaseContext.OTPVerifications
                    .Where(b => b.UserId == userId && b.OPT == OTP)
                    .FirstOrDefault();

            //update to db
            if (output != null)
            {
                Users user = await _databaseContext.Users.FindAsync(new Guid(userId));
                user.IsPhoneNoVerified = true;
                _databaseContext.Users.Update(user);
                await _databaseContext.SaveChangesAsync();
                return true;
            }

            return false;
        }
    }
}
