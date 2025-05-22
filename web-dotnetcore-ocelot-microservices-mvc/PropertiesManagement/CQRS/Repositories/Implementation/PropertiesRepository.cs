using Microsoft.AspNetCore.Components.Forms;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.EntityFrameworkCore.Metadata.Internal;
using PropertiesManagement.CQRS.Models;
using PropertiesManagement.CQRS.Repositories.Interfaces;
using PropertiesManagement.Database;
using System.Collections.Generic;
using System.IO;
using System.Net;
using System.Reflection.Emit;
using System.Reflection.Metadata;
using static PropertiesManagement.Database.Properties;
using static System.Net.Mime.MediaTypeNames;

namespace PropertiesManagement.CQRS.Repositories.Implementation
{
    public class PropertiesRepository : IPropertiesRepository
    {
        private readonly DatabaseContext _databaseContext;

        public PropertiesRepository(DatabaseContext databaseContext)
        {
            _databaseContext = databaseContext;
        }

        public async Task<Properties> AddPropertyAsync(Properties property)
        {
            _databaseContext.Properties.Add(property);
            await _databaseContext.SaveChangesAsync();
            return property;
        }

        public async Task<List<PropertiesModel>> GetPropertiesByZipCode(string zipcode, string street)
        {
            List<PropertiesModel> propertyinfo = await (from us in _databaseContext.Properties
                                                        join l in _databaseContext.Leases
                                                        on us.PropertyId equals l.PropertyId into l
                                                        from Leases in l.DefaultIfEmpty()
                                                        where ((us.Zip).Equals(zipcode)
                                                        &&
                                                        (us.Address).StartsWith(street))
                                                        select new PropertiesModel
                                                        {
                                                            PropertyId = us.PropertyId,
                                                            Address = us.Address,
                                                            Zip = us.Zip,
                                                            City = us.City,
                                                            State = us.State,
                                                            Type = us.Type,
                                                            Status = us.Status,
                                                            OwnerId = us.OwnerId,
                                                            OwnerName = us.OwnerName,
                                                            IsIDVerified = us.IsIDVerified,
                                                            Units = us.Units,
                                                            PropertyStatus = us.PropertyStatus,
                                                            RentAmount = Leases.RentAmount 
                                                        }).ToListAsync();
            return propertyinfo;
        }

        public async Task<PropertiesAggregationModel> GetPropertiesAggregationByOwnerId(string OwnerId)
        {
            try
            {


                var totalUnitsLists = await _databaseContext.Properties.Where(t => t.OwnerId.Equals(new Guid(OwnerId)))
                    .GroupBy(t => t.Status).Select(
                    w => new
                    {
                        Count = w.Count(),
                        Key = w.Key
                    }).ToListAsync();
                if (totalUnitsLists.Count == 0)
                {
                    return null;
                }
                PropertiesAggregationModel returnMe = new PropertiesAggregationModel();
                returnMe.Vaccant = 0;
                returnMe.Occupied = 0;
                for (int i = 0; i < totalUnitsLists.Count; i++)
                {
                    if (totalUnitsLists[i].Key.ToString() == "Vacant")
                    {
                        returnMe.Vaccant = totalUnitsLists[i].Count;
                    }
                    else if (totalUnitsLists[i].Key.ToString() == "TenantOccupied" || totalUnitsLists[i].Key.ToString() == "OwnerOccupied")
                    {
                        returnMe.Occupied = returnMe.Occupied + totalUnitsLists[i].Count;
                    }
                }
                return returnMe;
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.ToString());
                return null;
            }
        }

        public async Task<List<Properties>> GetPropertiesByOwnerId(string OwnerId)
        {
            try
            {
                List<Properties> properties = await (from us in _databaseContext.Properties
                                                     where us.OwnerId.Equals(new Guid(OwnerId))
                                                     select us).ToListAsync();
                return properties;
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.ToString());
                return null;
            }
        }
        public async Task<List<PropertiesPortfolioModel>> GetPropertiesPortfolioByOwnerId(string OwnerId, int pageNumber, int pageSize)
        {
            List<PropertiesPortfolioModel> propertiesPortfolioinfo = await (from pr in _databaseContext.Properties
                                                                            where pr.OwnerId.Equals(new Guid(OwnerId))
                                                                            join ls in _databaseContext.Leases on pr.PropertyId equals ls.PropertyId into lslj
                                                                            from ls in lslj.DefaultIfEmpty()
                                                                                //from us in uslj.DefaultIfEmpty()
                                                                                //join pd in _databaseContext.PropertyDocuments on pr.PropertyId equals pd.PropertyId into pdlj
                                                                                //where (pd.Type == "Image")
                                                                                //from pd in pdlj.DefaultIfEmpty()
                                                                            select new PropertiesPortfolioModel
                                                                            {
                                                                                PropertyId = pr.PropertyId,
                                                                                Address = pr.Address,
                                                                                OwnerId = pr.OwnerId,
                                                                                OwnerName = pr.OwnerName,
                                                                                Latitude = pr.Latitude,
                                                                                Longitude = pr.Longitude,
                                                                                Zip = pr.Zip,
                                                                                State = pr.State,
                                                                                City = pr.City,
                                                                                Type = pr.Type,
                                                                                Status = pr.Status,
                                                                                Units = pr.Units,
                                                                                Street = pr.Street,
                                                                                PropertyStatus = pr.PropertyStatus,
                                                                                Image = (
                                                                                  from pd in _databaseContext.PropertyDocuments
                                                                                  where pd.PropertyId == pr.PropertyId && pd.Type == "image"
                                                                                  select pd.DocumentURL).FirstOrDefault(),
                                                                                RentAmount = ls.RentAmount,
                                                                                DepositAmount = ls.DepostiAmount,
                                                                                LeaseExpirationDate = ls.LeaseExpirationDate,
                                                                                PayDay = ls.PayDay,
                                                                                AllocatedUsers = (from rf in _databaseContext.TenantPropAssocs
                                                                                                  where rf.PropertyId == pr.PropertyId && rf.IsActive == true
                                                                                                  select new TenantData
                                                                                                  {
                                                                                                      UserId = (Guid)rf.TenantId,
                                                                                                      UserName = rf.TenantName
                                                                                                  }).ToList(),
                                                                            }).ToListAsync();
            
            return propertiesPortfolioinfo.DistinctBy(p => p.PropertyId).Skip((pageNumber - 1) * pageSize).Take(pageSize).ToList();
        }

        public async Task<PropertiesPortfolioModel> GetPropertyDetails(string OwnerId, string PropertyId)
        {
            PropertiesPortfolioModel propertiesPortfolioinfo = await (from pr in _databaseContext.Properties
                                                                      where pr.OwnerId.Equals(new Guid(OwnerId)) && pr.PropertyId.Equals(new Guid(PropertyId))
                                                                      join ls in _databaseContext.Leases on pr.PropertyId equals ls.PropertyId into lslj
                                                                      from ls in lslj.DefaultIfEmpty()
                                                                      select new PropertiesPortfolioModel
                                                                      {
                                                                          PropertyId = pr.PropertyId,
                                                                          Address = pr.Address,
                                                                          OwnerId = pr.OwnerId,
                                                                          OwnerName = pr.OwnerName,
                                                                          Latitude = pr.Latitude,
                                                                          Longitude = pr.Longitude,
                                                                          Zip = pr.Zip,
                                                                          State = pr.State,
                                                                          City = pr.City,
                                                                          Type = pr.Type,
                                                                          Status = pr.Status,
                                                                          Units = pr.Units,
                                                                          Street = pr.Street,
                                                                          PropertyStatus = pr.PropertyStatus,
                                                                          Image = (
                                                                            from pd in _databaseContext.PropertyDocuments
                                                                            where pd.PropertyId == pr.PropertyId && pd.Type == "image"
                                                                            select pd.DocumentURL).FirstOrDefault(),
                                                                          RentAmount = ls.RentAmount,
                                                                          DepositAmount = ls.DepostiAmount,
                                                                          LeaseExpirationDate = ls.LeaseExpirationDate,
                                                                          PayDay = ls.PayDay,
                                                                          AllocatedUsers = (from rf in _databaseContext.TenantPropAssocs
                                                                                            where rf.PropertyId == pr.PropertyId && rf.IsActive == true
                                                                                            select new TenantData
                                                                                            {
                                                                                                UserId = (Guid)rf.TenantId,
                                                                                                UserName = rf.TenantName
                                                                                            }).ToList(),
                                                                      }).FirstOrDefaultAsync();
            return propertiesPortfolioinfo;
        }
        public async Task<Properties> UpdatePropertyAsync(Properties property)
        {
            Boolean statusChanged = false;
            Properties propertyData = await _databaseContext.Properties.FirstOrDefaultAsync(x => x.PropertyId == property.PropertyId);
            if (!IsNullorEmpty(property.Street) && property.Street != propertyData.Street)
            {
                propertyData.Street = property.Street;
            }
            if (!IsNullorEmpty(property.Status) && property.Status != propertyData.Status)
            {
                propertyData.Status = property.Status;
                statusChanged = true;
            }
            if (!IsNullorEmpty(property.State) && property.State != propertyData.State)
            {
                propertyData.State = property.State;
            }
            if (!IsNullorEmpty(property.Latitude) && property.Latitude != propertyData.Latitude)
            {
                propertyData.Latitude = property.Latitude;
            }
            if (!IsNullorEmpty(property.City) && property.City != propertyData.City)
            {
                propertyData.City = property.City;
            }
            if (!IsNullorEmpty(property.Address) && property.Address != propertyData.Address)
            {
                propertyData.Address = property.Address;
            }
            if (!IsNullorEmpty(property.Zip) && property.Zip != propertyData.Zip)
            {
                propertyData.Zip = property.Zip;
            }
            if (!IsNullorEmpty(property.Longitude) && property.Longitude != propertyData.Longitude)
            {
                propertyData.Longitude = property.Longitude;
            }
            if (!IsNullorEmpty(property.Type) && property.Type != propertyData.Type)
            {
                propertyData.Type = property.Type;
            }
            if (!IsNullorEmpty(property.Units) && property.Units != propertyData.Units)
            {
                propertyData.Units = property.Units;
            }
            if (!IsNullorEmpty(property.OwnerId) && property.OwnerId != propertyData.OwnerId)
            {
                propertyData.OwnerId = property.OwnerId;
            }
            if (!IsNullorEmpty(property.IsIDVerified) && property.IsIDVerified != propertyData.IsIDVerified)
            {
                propertyData.IsIDVerified = property.IsIDVerified;
            }
            if (!IsNullorEmpty(property.PropertyStatus) && property.PropertyStatus != propertyData.PropertyStatus)
            {
                propertyData.PropertyStatus = property.PropertyStatus;
            }
            if (!IsNullorEmpty(property.OwnerName) && property.OwnerName != propertyData.OwnerName)
            {
                propertyData.OwnerName = property.OwnerName;
            }
            _databaseContext.Properties.Update(propertyData);
            await _databaseContext.SaveChangesAsync();
            if (statusChanged)
            {
                List<TenantPropAssoc> tenantPropAssocs =await (from tr in _databaseContext.TenantPropAssocs
                       where tr.PropertyId == property.PropertyId && tr.IsActive == true
                       select tr)
                       .ToListAsync();
                foreach(TenantPropAssoc update in tenantPropAssocs)
                {
                    update.IsActive = false;
                    update.ToDate = DateTime.Now;
                }
                await _databaseContext.SaveChangesAsync();
            }
            return propertyData;
        }
        public async Task<Properties> GetPropertyIdAndOwnerIdByTenantId(string TenantId)
        {
            Properties data = new Properties();
            data = await (from rf in _databaseContext.TenantPropAssocs
                               where rf.TenantId == new Guid(TenantId)
                               join pr in _databaseContext.Properties on rf.PropertyId equals pr.PropertyId
                               select pr).FirstOrDefaultAsync();
            return data;
        }

        public Boolean IsNullorEmpty(Object data)
        {
            return data is null or (object)"";

        }

        public async Task<PropertiesPortfolioModel> GetPropertyDetailsByTenantId(string TenantId,string OwnerId, string PropertyId)
        {
            PropertiesPortfolioModel propertiesPortfolioinfo = await (from pr in _databaseContext.Properties
                                                                      where pr.OwnerId.Equals(new Guid(OwnerId)) && pr.PropertyId.Equals(new Guid(PropertyId))
                                                                      join ls in _databaseContext.Leases on pr.PropertyId equals ls.PropertyId into lslj
                                                                      from ls in lslj.DefaultIfEmpty()
                                                                      select new PropertiesPortfolioModel
                                                                      {
                                                                          PropertyId = pr.PropertyId,
                                                                          Address = pr.Address,
                                                                          OwnerId = pr.OwnerId,
                                                                          OwnerName = pr.OwnerName,
                                                                          Latitude = pr.Latitude,
                                                                          Longitude = pr.Longitude,
                                                                          Zip = pr.Zip,
                                                                          State = pr.State,
                                                                          City = pr.City,
                                                                          Type = pr.Type,
                                                                          Status = pr.Status,
                                                                          Units = pr.Units,
                                                                          Street = pr.Street,
                                                                          PropertyStatus = pr.PropertyStatus,
                                                                          Image = (
                                                                            from pd in _databaseContext.PropertyDocuments
                                                                            where pd.PropertyId == pr.PropertyId && pd.Type == "image"
                                                                            && pd.UploadedByUserId == new Guid(TenantId)
                                                                            select pd.DocumentURL).FirstOrDefault(),
                                                                          RentAmount = ls.RentAmount,
                                                                          DepositAmount = ls.DepostiAmount,
                                                                          LeaseExpirationDate = ls.LeaseExpirationDate,
                                                                          PayDay = ls.PayDay,
                                                                          AllocatedUsers = (from rf in _databaseContext.TenantPropAssocs
                                                                                            where rf.PropertyId == pr.PropertyId && rf.IsActive == true
                                                                                            select new TenantData
                                                                                            {
                                                                                                UserId = (Guid)rf.TenantId,
                                                                                                UserName = rf.TenantName
                                                                                            }).ToList(),
                                                                      }).FirstOrDefaultAsync();
            if (propertiesPortfolioinfo.Image == null)
            {
                propertiesPortfolioinfo.Image = (from pd in _databaseContext.PropertyDocuments
                                                 where pd.PropertyId == new Guid(PropertyId) && pd.Type == "image"
                                                 select pd.DocumentURL).FirstOrDefault();
            }
            return propertiesPortfolioinfo;
        }

        public async Task<PropertiesDocuments> AddPropertiesDocuments(PropertiesDocuments requestDocument)
        {
            try
            {
                //If already added Images are there then setting Active Status False
                PropertiesDocuments alreadyExists = await (from pds in _databaseContext.PropertyDocuments
                                                                where pds.PropertyId == requestDocument.PropertyId 
                                                                && pds.UploadedByUserId == requestDocument.UploadedByUserId
                                                                && pds.Type == requestDocument.Type
                                                                select pds).FirstOrDefaultAsync();
                if(alreadyExists == null)
                {
                    _databaseContext.PropertyDocuments.Add(requestDocument);
                    await _databaseContext.SaveChangesAsync();
                    return requestDocument;
                }
                else
                {
                    alreadyExists.DocumentURL = requestDocument.DocumentURL;
                    await _databaseContext.SaveChangesAsync();
                    return alreadyExists;
                }
            }
            catch(Exception ex)
            {
                Console.WriteLine(ex.ToString());
                return null;
            }
        }
    }
}
