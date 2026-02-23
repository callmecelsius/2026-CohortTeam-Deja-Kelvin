using System;
using System.Collections.Generic;

namespace Backend.Data.Models;

public partial class BehaviorLog
{
    public int Id { get; set; }

    public int? AnimalId { get; set; }

    public int? ReportedByUserId { get; set; }

    public string? BehaviorType { get; set; }

    public string? Notes { get; set; }

    public DateTime? DateReported { get; set; }

    public bool? Resolved { get; set; }

    public virtual Animal? Animal { get; set; }

    public virtual User? ReportedByUser { get; set; }
}
