namespace Mtg_tracker.Models.DTOs;

public class PagedResult<T>
{
    public List<T> Items { get; set; } = [];
    public int Page { get; set; }
    public bool HasMore { get; set; }
}