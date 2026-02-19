using System;
using System.Collections.Generic;

namespace Backend.Models;

public partial class FosterHome
{
    public int Id { get; set; }

    public string? HomeName { get; set; }

    public string? Address { get; set; }

    public int? Capacity { get; set; }

    public virtual ICollection<FosterAssignment> FosterAssignments { get; set; } = new List<FosterAssignment>();

    public virtual ICollection<FosterParent> FosterParents { get; set; } = new List<FosterParent>();
}
