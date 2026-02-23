namespace Backend.Dtos
{
    public class ProductDto
    {
        public int Id { get; set; }

        public int? CategoryId { get; set; }

        public string? Description { get; set; }

        public decimal? UnitPrice { get; set; }
        public string? prod_name { get; set; }
    }
}
