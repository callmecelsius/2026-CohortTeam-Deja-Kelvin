namespace Backend.Dtos
{
    public class PostInventoryDto
    {
        public int? ProductId { get; set; }
        public int? QuantityOnHand { get; set; }
        public int? ReorderLevel { get; set; }
        public DateTime? LastUpdated { get; set; }
    }
}