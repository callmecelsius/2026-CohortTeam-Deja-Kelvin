using System;
using System.Collections.Generic;

namespace Backend.Models;

public partial class Order
{
    public int Id { get; set; }

    public int? UserId { get; set; }

    public bool? OrderComplete { get; set; }

    public DateTime? DateOrdered { get; set; }

    public virtual ICollection<OrderItem> OrderItems { get; set; } = new List<OrderItem>();

    public virtual User? User { get; set; }
}
