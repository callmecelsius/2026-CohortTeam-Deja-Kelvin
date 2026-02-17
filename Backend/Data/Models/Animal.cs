using System;
using System.Collections.Generic;

namespace Backend.Data.Models;

public partial class Animal
{
    public int Id { get; set; }

    public string? Name { get; set; }

    public string? Breed { get; set; }

    public decimal? Weight { get; set; }

    public decimal? Height { get; set; }

    public DateTime? IntakeDate { get; set; }

    public string? Status { get; set; }

    public virtual ICollection<AnimalCondition> AnimalConditions { get; set; } = new List<AnimalCondition>();

    public virtual ICollection<BehaviorLog> BehaviorLogs { get; set; } = new List<BehaviorLog>();

    public virtual ICollection<FosterAssignment> FosterAssignments { get; set; } = new List<FosterAssignment>();
}
