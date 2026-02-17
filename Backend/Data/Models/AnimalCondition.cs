using System;
using System.Collections.Generic;

namespace Backend.Data.Models;

public partial class AnimalCondition
{
    public int Id { get; set; }

    public int? AnimalId { get; set; }

    public string? ConditionType { get; set; }

    public string? Description { get; set; }

    public string? Severity { get; set; }

    public DateTime? StartDate { get; set; }

    public DateTime? EndDate { get; set; }

    public bool? VetSeen { get; set; }

    public virtual Animal? Animal { get; set; }
}
