namespace ServiceRequestManagement.CQRS.Models
{
    public class ServiceRequestDashboardSummaryModel
    {
        public int NewCount { get; set; }
        public int InProgress { get; set; }
        public int InReview { get; set; }
    }
}
