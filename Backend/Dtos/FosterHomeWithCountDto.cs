namespace Backend.Dtos
{
    public class FosterHomeWithCountDto
    {
        public int Id { get; set; }
        public string? HomeName { get; set; }
        public string? Address { get; set; }
        public int Capacity { get; set; }
        public int CurrentAnimalCount { get; set; }
    }
}
