using System;
using System.Collections.Generic;

namespace Backend.Data.Models;

public partial class Product
{
    public int Id { get; set; }

    public int? CategoryId { get; set; }

    public string? Description { get; set; }

    public decimal? UnitPrice { get; set; }

    public virtual ProductCategory? Category { get; set; }

    public virtual ICollection<Inventory> Inventories { get; set; } = new List<Inventory>();

    public virtual ICollection<OrderItem> OrderItems { get; set; } = new List<OrderItem>();
}
