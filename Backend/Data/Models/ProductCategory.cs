using System;
using System.Collections.Generic;

namespace Backend.Data.Models;

public partial class ProductCategory
{
    public int Id { get; set; }

    public string? Name { get; set; }

    public virtual ICollection<Product> Products { get; set; } = new List<Product>();
}
