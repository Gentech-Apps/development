namespace UserManagement.CQRS.Command
{
    public class RegisterBusinessCommandHandler : IRequestHandler<RegisterBusinessCommand, Business>
    {
        private readonly IBusinessRepository _businessRepository;
        public RegisterBusinessCommandHandler(IBusinessRepository businessRepository)
        {
            _businessRepository = businessRepository;
        }

        public Task<Business> Handle(RegisterBusinessCommand request, CancellationToken cancellationToken)
        {
            return _businessRepository.RegisterBusinessAsync(request.registerBusinessModel);
        }
    }
}
