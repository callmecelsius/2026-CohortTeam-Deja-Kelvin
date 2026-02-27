namespace Backend.Dtos
{
    public class FosterUserGetDto
    {
        public int? Id { get; set; }
        public string? FirstName { get; set; }
        public string? LastName { get; set; }
        public string? Phone { get; set; }
        public string? Email { get; set; }
        public string? Address { get; set; }
        public string? City { get; set; }
        public string? State { get; set; }
        public int? Zip { get; set; }
        public FosterParentGetDto FosterParent { get; set; } = default!;
    }

    public class FosterParentGetDto
    {
        public int? UserId { get; set; }
        public int? FosterHomeId { get; set; }
        public DateTime? ApprovedDate { get; set; }
        public string? Status { get; set; }
        public FosterHomeDto? FosterHome { get; set; }
    }
}
