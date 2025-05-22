using PropertiesManagement.CQRS.Models;
using PropertiesManagement.CQRS.Repositories.Interfaces;
using PropertiesManagement.Database;

namespace PropertiesManagement.CQRS.Repositories.Implementation
{
    public class LeasesRepository : ILeaseRepository
    {
        private readonly DatabaseContext _databaseContext;

        public LeasesRepository(DatabaseContext databaseContext)
        {
            _databaseContext = databaseContext;
        }

        public async Task<LeaseModel> GetLeaseByPropertyId(string PropertyId)
        {
            try
            {
                Leases lease = await (from us in _databaseContext.Leases
                                      where us.PropertyId.Equals(new Guid(PropertyId))
                                      select us).FirstOrDefaultAsync();
                List<PropertiesDocuments> propertiesDocuments = await (from us in _databaseContext.PropertyDocuments
                                                                       where us.PropertyId.Equals(new Guid(PropertyId))
                                                                       && us.IsActive.Equals(true)
                                                                       select us).ToListAsync();
                if (lease == null)
                {
                    return null;
                }
                LeaseModel leaseJoinedDocuments = new LeaseModel();
                leaseJoinedDocuments.LeaseId = lease.LeaseId;
                leaseJoinedDocuments.PropertyId = lease.PropertyId;
                leaseJoinedDocuments.PayDay = lease.PayDay;
                leaseJoinedDocuments.RentAmount = lease.RentAmount;
                leaseJoinedDocuments.DepostiAmount = lease.DepostiAmount;
                leaseJoinedDocuments.LeaseExpirationDate = lease.LeaseExpirationDate;
                if (propertiesDocuments != null)
                {
                    leaseJoinedDocuments.Images = new List<PropertiesDocuments>();
                    leaseJoinedDocuments.Documents = new List<PropertiesDocuments>();
                    foreach (PropertiesDocuments doc in propertiesDocuments)
                    {
                        if (doc.Type == "document")
                        {
                            leaseJoinedDocuments.Documents.Add(doc);
                        }
                        else if (doc.Type == "image")
                        {
                            leaseJoinedDocuments.Images.Add(doc);
                        }
                    }
                }
                return leaseJoinedDocuments;
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.ToString());
                return null;
            }
        }

        public async Task<LeaseModel> AddLease(LeaseModel leaseModel)
        {
            try
            {
                Leases lease = new Leases();
                lease.PropertyId = leaseModel.PropertyId;
                lease.LeaseExpirationDate = leaseModel.LeaseExpirationDate;
                lease.PayDay = leaseModel.PayDay;
                lease.RentAmount = leaseModel.RentAmount;
                lease.DepostiAmount = leaseModel.DepostiAmount;
                _databaseContext.Leases.Add(lease);
                if (leaseModel.Documents != null)
                {
                    for (int i = 0; i < leaseModel.Documents.Count; i++)
                    {
                        _databaseContext.PropertyDocuments.Add(leaseModel.Documents[i]);
                    }
                }
                if (leaseModel.Images != null)
                {
                    for (int i = 0; i < leaseModel.Images.Count; i++)
                    {
                        _databaseContext.PropertyDocuments.Add(leaseModel.Images[i]);
                    }
                }
                await _databaseContext.SaveChangesAsync();
                leaseModel.LeaseId = lease.LeaseId;
                return leaseModel;
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.ToString());
                return null;
            }
        }
        public async Task<Leases> UpdateLease(LeaseModel leaseModel)
        {
            Leases leasedata=null;
            try
            {
                leasedata = await _databaseContext.Leases.FirstOrDefaultAsync(x => x.LeaseId == leaseModel.LeaseId);

                if (!IsNullorEmpty(leaseModel.PayDay) && leaseModel.PayDay != leasedata.PayDay)
                { 
                    leasedata.PayDay = leaseModel.PayDay;
                }
                if (!IsNullorEmpty(leaseModel.LeaseExpirationDate) && leaseModel.LeaseExpirationDate != leasedata.LeaseExpirationDate)
                {
                    leasedata.LeaseExpirationDate = leaseModel.LeaseExpirationDate;
                }
                if (!IsNullorEmpty(leaseModel.DepostiAmount) && leaseModel.DepostiAmount != leasedata.DepostiAmount)
                {
                    leasedata.DepostiAmount = leaseModel.DepostiAmount;
                }
                if (!IsNullorEmpty(leaseModel.RentAmount) && leaseModel.RentAmount != leasedata.RentAmount)
                {
                    leasedata.RentAmount = leaseModel.RentAmount;
                }
                //updating documents
                if (leaseModel.Documents != null)
                {
                    for (int i = 0; i < leaseModel.Documents.Count; i++)
                    {
                        PropertiesDocuments document = leaseModel.Documents[i];
                        if (document.DocumentId != null && document.DocumentId != Guid.Empty) 
                        {
                            PropertiesDocuments documentData = await _databaseContext.PropertyDocuments.FirstOrDefaultAsync(x => x.DocumentId == document.DocumentId);
                            if (!IsNullorEmpty(document.DocumentURL) && !IsNullorEmpty(documentData)  && document.DocumentURL != documentData.DocumentURL)
                            { 
                                documentData.DocumentURL = document.DocumentURL;
                            }
                            if (!IsNullorEmpty(document.IsActive) && !IsNullorEmpty(documentData) && document.IsActive != documentData.IsActive)
                            {
                                documentData.IsActive = document.IsActive;
                            }
                            _databaseContext.PropertyDocuments.Update(documentData);
                            await _databaseContext.SaveChangesAsync();
                            //edit
                        } else 
                        {
                            //Add
                            _databaseContext.PropertyDocuments.Add(document);
                            await _databaseContext.SaveChangesAsync();
                        }
                        

                    }
                }

                //updating images
                if (leaseModel.Images != null)
                {
                    for (int i = 0; i < leaseModel.Images.Count; i++)
                    {
                        PropertiesDocuments document = leaseModel.Images[i];
                        if (document.DocumentId != null && document.DocumentId != Guid.Empty)
                        {
                            PropertiesDocuments documentData = await _databaseContext.PropertyDocuments.FirstOrDefaultAsync(x => x.DocumentId == document.DocumentId);
                            if (!IsNullorEmpty(document.DocumentURL) && !IsNullorEmpty(documentData) && document.DocumentURL != documentData.DocumentURL)
                            {
                                documentData.DocumentURL = document.DocumentURL;
                            }
                            if (!IsNullorEmpty(document.IsActive) && !IsNullorEmpty(documentData) && document.IsActive != documentData.IsActive)
                            {
                                documentData.IsActive = document.IsActive;
                            }
                            _databaseContext.PropertyDocuments.Update(documentData);
                            await _databaseContext.SaveChangesAsync();
                            //edit
                        }
                        else
                        {
                            //Add
                            document.DocumentId = new Guid();
                            _databaseContext.PropertyDocuments.Add(document);
                            await _databaseContext.SaveChangesAsync();
                        }


                    }
                }
                if (! IsNullorEmpty(leasedata)) {
                    _databaseContext.Leases.Update(leasedata);
                    await _databaseContext.SaveChangesAsync();
                }
                
                return leasedata;

            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.ToString());
                return null;
            }
        }
        public Boolean IsNullorEmpty(Object data)
        {
            return data is null or (object)"";

        }
    }
}
