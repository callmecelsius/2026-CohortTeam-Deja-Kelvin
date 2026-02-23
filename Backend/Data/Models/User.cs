using System;
using System.Collections.Generic;

namespace Backend.Data.Models;

public partial class User
{
    public int Id { get; set; }

    public string? FirstName { get; set; }

    public string? LastName { get; set; }

    public int? EmployeeId { get; set; }

    public int? PhoneNumber { get; set; }

    public string? Email { get; set; }

    public string? Address { get; set; }

    public string? City { get; set; }

    public string? State { get; set; }

    public int? Zip { get; set; }

    public DateTime? CreatedOn { get; set; }

    public DateTime? UpdatedOn { get; set; }

    public virtual ICollection<BehaviorLog> BehaviorLogs { get; set; } = new List<BehaviorLog>();

    public virtual ICollection<FosterParent> FosterParents { get; set; } = new List<FosterParent>();

    public virtual ICollection<Order> Orders { get; set; } = new List<Order>();
}
