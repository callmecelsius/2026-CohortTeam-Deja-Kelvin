namespace Backend.Dtos
{
    public class PostFosterParentDto
    {
        public int? UserId { get; set; }

        public int? FosterHomeId { get; set; }

        public DateTime? ApprovedDate { get; set; }

        public string? Status { get; set; }
    }
}
