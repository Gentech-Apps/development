namespace UserManagement.CQRS.Queries
{
    public class GetLastActiveStepQueryHandler : IRequestHandler<GetLastActiveStepQuery, string>
    {
        private readonly IUserRepository _userRepository;
        private readonly IFundingSourceRepository _fundingSourceRepository;
        private readonly IBusinessRepository _buinessRepository;
        private readonly IOwnerAndControllerRepository _ownerAndControllerRepository;

        public GetLastActiveStepQueryHandler(IUserRepository userRepository, IFundingSourceRepository fundingSourceRepository, IBusinessRepository buinessRepository, IOwnerAndControllerRepository ownerAndController)
        {
            _userRepository = userRepository;
            _fundingSourceRepository = fundingSourceRepository;
            _buinessRepository = buinessRepository;
            _ownerAndControllerRepository = ownerAndController;
        }

        public async Task<string> Handle(GetLastActiveStepQuery request, CancellationToken cancellationToken)
        {
            //getuserdata to find type
            Users users = await _userRepository.GetUserDetailsByUserId(request.userId);
            if ((bool)!users.IsPhoneNoVerified)
            {
                return "verification";
            }
            //tenent
            if (users.Role == "tenant")
            {
                //ispropertyadded
                //isaccount verified
                //->dashboard

            }
            else
            {
                //landlord
                if ((bool)users.IsIndividual)
                {
                    if (users.UserInfoId == Guid.Empty)
                    {
                        return "individual-account";
                    }
                    else
                    {
                        if (users.Threshold == "" || users.Threshold == null)
                        {
                            return "add-threshold";
                        }
                        else
                        {
                            //is funding source added
                            {
                                UsersModel usersDetail = await _userRepository.GetUserById(request.userId);
                                FundingSource fundingSource = await _fundingSourceRepository.GetFundingSourceByUserInfoId(usersDetail.UserInfoId.ToString());
                                if (fundingSource == null)
                                {
                                    return "funding-source";
                                }
                                else
                                {
                                    if (usersDetail.DwollaVerificationStatus != "Verified" || fundingSource.FundingSourceDwollaStatus != "verified")
                                    {
                                        return "id-verification";
                                    }
                                    //is property added
                                    //return DashboardUser else return AddControllerCommand property
                                }
                            }
                        }
                    }
                }
                else
                {
                    //landlord with business
                    BusinessDetailsModel businessDetailsModel = await _buinessRepository.GetBusinessDetailsByUserId(request.userId);
                    UsersModel usersDetail = await _userRepository.GetUserById(request.userId);
                    if (businessDetailsModel == null)
                    {
                        return "business-account";
                    }
                    else
                    {
                        //businesstype solo
                        if (businessDetailsModel.BusinessType == BusinessTypeEnum.SolePartnership || businessDetailsModel.BusinessType == BusinessTypeEnum.Trust || businessDetailsModel.BusinessType == BusinessTypeEnum.Unicorporatedassociation)
                        {
                            if (users.Threshold == "" || users.Threshold == null)
                            {
                                return "add-threshold";
                            }
                            else
                            {
                                FundingSource fundingSource = await _fundingSourceRepository.GetFundingSourceByUserInfoId(usersDetail.UserInfoId.ToString());
                                if (fundingSource == null)
                                {
                                    return "funding-source";
                                }
                                else
                                {
                                    if (usersDetail.DwollaVerificationStatus != "Verified" || fundingSource.FundingSourceDwollaStatus != "verified")
                                    {
                                        return "id-verification";
                                    }
                                }
                            }
                        }
                        else
                        {
                            UsersModel controllerDetails = await _ownerAndControllerRepository.GetControllerByBusinessId(businessDetailsModel.BusinessId);
                            if (controllerDetails == null)
                            {
                                return "add-controller";
                            }
                            else
                            {
                                if (users.Threshold == "" || users.Threshold == null)
                                {
                                    return "add-threshold";
                                }
                                FundingSource fundingSource = await _fundingSourceRepository.GetFundingSourceByUserInfoId(usersDetail.UserInfoId.ToString());
                                if (fundingSource == null)
                                {
                                    return "funding-source";
                                }
                                else
                                {
                                    if (usersDetail.DwollaVerificationStatus != "Verified" || fundingSource.FundingSourceDwollaStatus != "verified")
                                    {
                                        return "id-verification";
                                    }
                                }
                            }
                        }
                    }
                }
            }
            return null;
        }
    }
}