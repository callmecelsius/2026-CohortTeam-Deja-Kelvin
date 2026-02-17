using System;
using System.Collections.Generic;

namespace Backend.Data.Models;

public partial class FosterParent
{
    public int Id { get; set; }

    public int? UserId { get; set; }

    public int? FosterHomeId { get; set; }

    public DateTime? ApprovedDate { get; set; }

    public string? Status { get; set; }

    public virtual FosterHome? FosterHome { get; set; }

    public virtual ICollection<FosterParentNote> FosterParentNotes { get; set; } = new List<FosterParentNote>();

    public virtual User? User { get; set; }
}
