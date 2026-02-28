namespace Backend.Dtos;

public class FosterHomeAvailabilityDto
{
    public int FosterHomeId { get; set; }
    public int Capacity { get; set; }
    public int OccupiedSlots { get; set; }
    public int Availability { get; set; }
}
