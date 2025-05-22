namespace UserManagement.CQRS.Command
{
    public class VerifyOTPCommandHandler : IRequestHandler<VerifyOTPCommand, Boolean>
    {
        private readonly IOTPRepository _otpRepository;

        public VerifyOTPCommandHandler(IOTPRepository otpRepository)
        {
            _otpRepository = otpRepository;
        }

        public Task<Boolean> Handle(VerifyOTPCommand request, CancellationToken cancellationToken)
        {
            return _otpRepository.VerifyOTPAsync(request.userID, request.OTP);

        }
    }
}
