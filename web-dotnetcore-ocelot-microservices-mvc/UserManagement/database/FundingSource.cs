namespace UserManagement.database
{
    public class FundingSource
    {
        [Key]
        public Guid FundingSourceId { get; set; }
        [Required]
        public Guid UserInfoId { get; set; }
        public string FundingSourceDwollaToken { get; set; }
        public string FundingSourceDwollaStatus { get; set; } 
        public string PlaidProcessorToken { get; set; }
    }
}
