using UserManagement.CQRS.Repositories.Implementation;

namespace UserManagement.CQRS.Command
{
    public class GenerateOTPCommandHandler : IRequestHandler<GenerateOTPCommand, string>
    {
        private readonly IOTPRepository _otpRepository;

        public GenerateOTPCommandHandler(IOTPRepository otpRepository) 
        { 
            _otpRepository = otpRepository;

        }
        public Task<string> Handle(GenerateOTPCommand request, CancellationToken cancellationToken)
        {
            return _otpRepository.GenerateOTPAsync(request.userID);

        }
    }
}
