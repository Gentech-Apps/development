namespace NotificationsMicroservice.CQRS.Models
{
    public class EmailModel
    {
        public string ToEmail { get; set; }

        public string FromEmail { get; set; }
        public string Subject { get; set; }
        public string Body { get; set; }
    }
}
