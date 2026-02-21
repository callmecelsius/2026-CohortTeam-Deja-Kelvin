namespace Backend.Dtos
{
    public class PutAnimalDto
    {
        public string? Name { get; set; }

        public string? Breed { get; set; }

        public decimal? Weight { get; set; }

        public decimal? Height { get; set; }

        public DateTime? IntakeDate { get; set; }

        public string? Status { get; set; }
    }
}