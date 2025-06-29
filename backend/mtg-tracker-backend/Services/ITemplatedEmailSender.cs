namespace Mtg_tracker.Services;

public enum EmailType
{
    VerifyEmail,
    ForgotPassword
};

public class EmailTemplateContext
{
    public required string ToEmail { get; set; }
    public required EmailType Type { get; set; }
    public object? Variables { get; set; }
}

public interface ITemplatedEmailSender
{
    Task SendEmailAsync(EmailTemplateContext context);
}