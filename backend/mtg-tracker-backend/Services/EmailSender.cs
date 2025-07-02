using Microsoft.Extensions.Options;
using Mailjet.Client;
using Mailjet.Client.Resources;
using Newtonsoft.Json.Linq;

namespace Mtg_tracker.Services;

public class VerifyEmailRequestVariables
{
    public required string Name { get; set; }
    public required string UserId { get; set; }
    public required string Token { get; set; }
}

public class ForgotPasswordRequestVariables
{
    public required string UserId { get; set; }
    public required string Token { get; set; }
}

public class ResetPasswordConfirmationVariables
{
    public required string UserId { get; set; }
    public required string Name { get; set; }
}

public class EmailSender(
    IOptions<EmailSenderOptions> optionsAccessor,
    ILogger<EmailSender> logger) : ITemplatedEmailSender
{
    private readonly ILogger _logger = logger;

    public EmailSenderOptions Options { get; } = optionsAccessor.Value;

    public async Task SendEmailAsync(EmailTemplateContext context)
    {
        if (string.IsNullOrEmpty(Options.MailjetEmail) ||
                  string.IsNullOrEmpty(Options.MailjetApiKey) ||
                  string.IsNullOrEmpty(Options.MailjetSecretKey))
        {
            throw new Exception("Missing Mailjet Data");
        }

        try
        {
            await Execute(Options.MailjetEmail, Options.MailjetApiKey, Options.MailjetSecretKey, context);
        }
        catch (Exception e)
        {
            Console.WriteLine(e);
        }
    }

    public async Task Execute(string fromEmail, string apiKey, string secretKey, EmailTemplateContext context)
    {
        MailjetClient client = new(apiKey, secretKey);
        MailjetRequest? request = null;

        switch (context.Type)
        {
            case EmailType.VerifyEmail:
                {
                    request = VerifyEmailRequest(fromEmail, context);
                    break;
                }
            case EmailType.ForgotPassword:
                {
                    request = ForgotPasswordRequest(fromEmail, context);
                    break;
                }
            case EmailType.ResetPasswordConfirmation:
                {
                    request = ResetPasswordConfirmation(fromEmail, context);
                    break;
                }
            default:
                throw new Exception("Not a valid Email Type");
        }

        if (request is null)
        {
            Console.WriteLine("No request");
            return;
        }

        var response = await client.PostAsync(request);

        if (response.IsSuccessStatusCode)
        {
            Console.WriteLine(string.Format("Total: {0}, Count: {1}", response.GetTotal(), response.GetCount()));
            Console.WriteLine(response.GetData());
        }
        else
        {
            Console.WriteLine(string.Format("StatusCode: {0}", response.StatusCode));
            Console.WriteLine(string.Format("ErrorInfo: {0}", response.GetErrorInfo()));
            Console.WriteLine(response.GetData());
            Console.WriteLine(string.Format("ErrorMessage: {0}", response.GetErrorMessage()));
        }
    }

    private static MailjetRequest VerifyEmailRequest(string fromEmail, EmailTemplateContext context)
    {
        var vars = (context.Variables as VerifyEmailRequestVariables)
            ?? throw new ArgumentNullException("Variables must be of type VerifyEmailRequestVariables.");

        var request = new MailjetRequest { Resource = SendV31.Resource }
        .Property(Send.Messages, new JArray {
            new JObject {
                // {"From", new JObject {
                //     {"Email", fromEmail},
                // }},
                {"To", new JArray {
                    new JObject {
                        {"Email", context.ToEmail},
                    }
                }},
                {"TemplateID", 7113645},
                {"TemplateLanguage", true},
                {"Variables", new JObject {
                    {"name", vars.Name},
                    {"userId", vars.UserId},
                    {"token", vars.Token},
                }}
            }
        });

        return request;
    }

    private static MailjetRequest ForgotPasswordRequest(string fromEmail, EmailTemplateContext context)
    {
        var vars = (context.Variables as ForgotPasswordRequestVariables)
            ?? throw new ArgumentNullException("Variables must be of type ForgotPasswordRequestVariables.");

        var request = new MailjetRequest { Resource = SendV31.Resource }
        .Property(Send.Messages, new JArray {
            new JObject {
                // {"From", new JObject {
                //     {"Email", fromEmail},
                // }},
                {"To", new JArray {
                    new JObject {
                        {"Email", context.ToEmail},
                    }
                }},
                {"TemplateID", 7113643},
                {"TemplateLanguage", true},
                {"Variables", new JObject {
                    {"userId", vars.UserId},
                    {"token", vars.Token},
                }}
            }
        });

        return request;
    }

    private static MailjetRequest ResetPasswordConfirmation(string fromEmail, EmailTemplateContext context)
    {
        var vars = (context.Variables as ResetPasswordConfirmationVariables)
            ?? throw new ArgumentNullException("Variables must be of type ResetPasswordConfirmationVariables.");

        var request = new MailjetRequest { Resource = SendV31.Resource }
        .Property(Send.Messages, new JArray {
            new JObject {
                // {"From", new JObject {
                //     {"Email", fromEmail},
                // }},
                {"To", new JArray {
                    new JObject {
                        {"Email", context.ToEmail},
                    }
                }},
                {"TemplateID", 7114426},
                {"TemplateLanguage", true},
                {"Variables", new JObject {
                    {"userId", vars.UserId},
                    {"name", vars.Name},
                }}
            }
        });

        return request;
    }
}