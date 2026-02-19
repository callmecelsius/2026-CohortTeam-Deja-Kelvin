using System;
using System.Collections.Generic;

namespace Backend.Models;

public partial class FosterParentNote
{
    public int Id { get; set; }

    public int? FosterParentId { get; set; }

    public string? Notes { get; set; }

    public DateTime? DateCreated { get; set; }

    public virtual FosterParent? FosterParent { get; set; }
}
