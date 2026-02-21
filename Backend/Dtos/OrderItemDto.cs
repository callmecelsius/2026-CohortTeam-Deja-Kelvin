using Backend.Data.Models;

namespace Backend.Dtos
{
    public class OrderItemDto
    {
        public int Id { get; set; }
        public int? OrderId { get; set; }
        public int? ProductId { get; set; }
        public int? Quantity { get; set; }
        public string? ProductName { get; set; }

        // Order Details
        //public int? UserId { get; set; }
        //public bool? OrderComplete { get; set; }
        //public DateTime? DateOrdered { get; set; }
    }
}
