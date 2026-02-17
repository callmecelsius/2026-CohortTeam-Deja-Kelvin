using System;
using System.Collections.Generic;

namespace Backend.Data.Models;

public partial class FosterAssignment
{
    public int Id { get; set; }

    public int? AnimalId { get; set; }

    public int? FosterHomeId { get; set; }

    public DateTime? StartDate { get; set; }

    public DateTime? EndDate { get; set; }

    public virtual Animal? Animal { get; set; }

    public virtual FosterHome? FosterHome { get; set; }
}
