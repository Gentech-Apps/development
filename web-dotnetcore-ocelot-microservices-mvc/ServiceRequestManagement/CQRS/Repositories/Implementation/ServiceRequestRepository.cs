using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using ServiceRequestManagement.CQRS.Models;
using ServiceRequestManagement.CQRS.Repositories.Interfaces;
using ServiceRequestManagement.database;
using System.Linq;

namespace ServiceRequestManagement.CQRS.Repositories.Implementation
{
    public class ServiceRequestRepository : IServiceRequestRepository
    {
        private readonly DatabaseContext _databaseContext;

        public ServiceRequestRepository(DatabaseContext databaseContext)
        {
            _databaseContext = databaseContext;
        }

        public async Task<List<ServiceRequestModel>> GetServiceRequests(ServiceRequestsRequestModel model)
        {
            List<string> ids = model.propertyIDs;
            List<ServiceRequestModel> serviceRequestList = await(from sr in _databaseContext.ServiceRequest
                                                       where ids.Contains(sr.PropertyId.ToString())
                                                       select new ServiceRequestModel
                                                        {
                                                           ServiceRequestID= sr.ServiceRequestId,
                                                           PropertyID= sr.PropertyId,
                                                           AcceptedTimeFrame=sr.AcceptedTimeFrame == null ? "" : sr.AcceptedTimeFrame,
                                                           CreatedDate=sr.CreatedDate,
                                                           ServiceProviderID=sr.ServiceProviderId == null? Guid.Empty: sr.ServiceProviderId,
                                                           WorkStatus=sr.WorkStatus,
                                                           Description=sr.Description,
                                                           EstimatedCost=sr.EstimatedCost == null ?"": sr.EstimatedCost,
                                                           OpenedBy=sr.OpenedBy,
                                                           ServiceProviderName= "TEST",
                                                           ServiceType=sr.ServiceType,
                                                           PropertyAddress=sr.PropertyAddress,
                                                           VerificationOTP=sr.VerificationOTP==null ? "" : sr.VerificationOTP

                                                       }).ToListAsync();
            return serviceRequestList.Skip((model.pageNumber -1) * model.pageSize).Take(model.pageSize).ToList();
        }

        public async Task<ServiceRequest> AddServiceRequestAsync(ServiceRequestModel serviceRequestModel)
        {
            try
            {
                ServiceRequest serviceRequest = new ServiceRequest();
                serviceRequest.PropertyId = serviceRequestModel.PropertyID;
                serviceRequest.Description = serviceRequestModel.Description;
                serviceRequest.OpenedBy = serviceRequestModel.OpenedBy;
                serviceRequest.PropertyAddress = serviceRequestModel.PropertyAddress;
                serviceRequest.CreatedDate = DateTime.Now;
                serviceRequest.AcceptedTimeFrame = serviceRequestModel.AcceptedTimeFrame;
                serviceRequest.EstimatedCost = serviceRequestModel.EstimatedCost;
                serviceRequest.WorkStatus = serviceRequestModel.WorkStatus;
                serviceRequest.ServiceType = serviceRequestModel.ServiceType;
                ServiceRequest savedResponse = _databaseContext.Add(serviceRequest).Entity;
                await _databaseContext.SaveChangesAsync();
                if (savedResponse != null)
                {
                    if (serviceRequestModel.Image != null)
                    {
                        for (int i = 0; i < serviceRequestModel.Image.Count; i++)
                        {
                            ServiceRequestMedia document = serviceRequestModel.Image[i];
                            document.ServiceRequestId = savedResponse.ServiceRequestId;
                            _databaseContext.serviceRequestMedias.Add(serviceRequestModel.Image[i]);
                        }
                    }
                    if (serviceRequestModel.Video != null)
                    {
                        for (int i = 0; i < serviceRequestModel.Video.Count; i++)
                        {
                            ServiceRequestMedia document = serviceRequestModel.Video[i];
                            document.ServiceRequestId = savedResponse.ServiceRequestId;
                            _databaseContext.serviceRequestMedias.Add(serviceRequestModel.Video[i]);
                        }
                    }
                    serviceRequestModel.ServiceRequestID = savedResponse.ServiceRequestId;
                    await _databaseContext.SaveChangesAsync();
                }
                return savedResponse;
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.ToString());
                return null;
            }
        }

        async Task<ServiceRequestDashboardSummaryModel> IServiceRequestRepository.GetServiceRequestDashboardSummary(List<string> propertiesIds)
        {
            try {
                ServiceRequestDashboardSummaryModel serviceRequestDashboardSummaryModel = new ServiceRequestDashboardSummaryModel();
                var r = await (from sr in _databaseContext.ServiceRequest
                               where propertiesIds.Contains(sr.PropertyId.ToString())
                               group 1 by sr.WorkStatus into ws
                               select new
                               {
                                   workstatus = ws.Key,
                                   count = ws.Count()
                               }).ToListAsync();

                for (int i = 0; i < r.Count(); i++)
                {
                    switch (r[i].workstatus)
                    {
                        case WorkStatusEnum.NEW:
                            serviceRequestDashboardSummaryModel.NewCount = r[i].count;
                            break;
                        case WorkStatusEnum.INPROGRESS:
                            serviceRequestDashboardSummaryModel.InProgress = r[i].count;
                            break;
                        case WorkStatusEnum.COMPLETED_PENDING_PAYMENT:
                            serviceRequestDashboardSummaryModel.InReview = r[i].count;
                            break;
                    }
                }
                return serviceRequestDashboardSummaryModel;
            } catch (Exception ex) {
                Console.WriteLine(ex.ToString());
                return null;
            }
            
        }

        public async Task<ServiceRequestModel> GetServiceRequestByServiceRequestID(string serviceRequestID)
        {
            ServiceRequestModel model = new ServiceRequestModel();
            try {
                model = await (from sr in _databaseContext.ServiceRequest
                                    join sp in _databaseContext.ServiceProviders
                                    on sr.ServiceProviderId equals sp.ServiceProviderId into sp
                                    from ServiceProvider in sp.DefaultIfEmpty()
                                    where sr.ServiceRequestId == new Guid(serviceRequestID)
                                    select new ServiceRequestModel
                                    {
                                        ServiceProviderID = sr.ServiceProviderId,
                                        ServiceRequestID = sr.ServiceRequestId,
                                        PropertyAddress = sr.PropertyAddress,
                                        PropertyID = sr.PropertyId,
                                        CreatedDate = sr.CreatedDate,
                                        ServiceType = sr.ServiceType,
                                        WorkStatus = sr.WorkStatus,
                                        Description = sr.Description,
                                        OpenedBy = sr.OpenedBy,
                                        ServiceProviderName = ServiceProvider.FirstName + " " + ServiceProvider.LastName,
                                    }).FirstOrDefaultAsync();
                
            } catch (Exception ex) {
                Console.WriteLine(ex.ToString());
                return null;
            }
            return model;
        }
    }
}
