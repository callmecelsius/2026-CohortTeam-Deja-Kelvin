namespace Backend.Dtos
{
  public class BehaviorLogDto
  {
    public int Id { get; set; }
    public int? AnimalId { get; set; }
    public int? ReportedByUserId { get; set; }
    public string? BehaviorType { get; set; }
    public string? Notes { get; set; }
    public DateTime? DateReported { get; set; }
    public bool? Resolved { get; set; }
  }
}