namespace Backend.Dtos
{
    public class AnimalDto
    {
        public int Id { get; set; }
        public string? Name { get; set; }
        public string? Breed { get; set; }
        public decimal? Weight { get; set; }
        public decimal? Height { get; set; }
        public DateTime? IntakeDate { get; set; }
        public string? Status { get; set; }
        public byte[]? AnimalPhoto { get; set; }
        public string? Type { get; set; }
    }
} 