namespace Backend.Dtos
{
    public class OrderDto
    {
        public int Id { get; set; }
        public int? UserId { get; set; }
        public bool? OrderComplete { get; set; }
        public DateTime? DateOrdered { get; set; }
        public ICollection<OrderItemDto>? OrderItems { get; set; }

    }
}
