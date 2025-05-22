namespace PropertiesManagement.CQRS.Models
{
    public class PropertiesAggregationModel
    {
        public int Occupied { get; set; }
        public int Vaccant { get; set; }
        public int OutStandingPayments { get; set; }
        public int RentalPaidYearToDate { get; set; }
    }
}
