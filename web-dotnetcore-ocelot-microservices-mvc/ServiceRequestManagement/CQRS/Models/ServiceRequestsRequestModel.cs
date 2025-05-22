namespace ServiceRequestManagement.CQRS.Models
{
    public class ServiceRequestsRequestModel
    {
        public List<string> propertyIDs { get; set; }
        public int pageNumber { get; set; }
        public int pageSize { get; set; }
        public List<string> status { get; set; } 

    }
}
