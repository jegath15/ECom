using System.Net;
using System.Net.Mail;
using ChefSupply.API.Services.Interfaces;

namespace ChefSupply.API.Services.Implementations
{
    public class EmailService : IEmailService
    {
        private readonly IConfiguration _config;
        private readonly ILogger<EmailService> _logger;

        public EmailService(IConfiguration config, ILogger<EmailService> logger)
        {
            _config = config;
            _logger = logger;
        }

        public async Task SendEmailAsync(string toEmail, string subject, string body)
        {
            var smtpServer = _config["Email:SmtpServer"];
            var smtpPort = _config.GetValue<int>("Email:SmtpPort");
            var smtpUser = _config["Email:SmtpUser"];
            var smtpPass = _config["Email:SmtpPass"];
            var fromEmail = _config["Email:FromEmail"] ?? "noreply@chefsupply.com";

            // If SMTP is NOT configured, fallback to console logging (Development Mode)
            if (string.IsNullOrEmpty(smtpServer) || smtpPort == 0)
            {
                _logger.LogInformation(">>> [MOCK EMAIL SENT] <<<");
                _logger.LogInformation($"To: {toEmail}");
                _logger.LogInformation($"Subject: {subject}");
                _logger.LogInformation($"Body: {body}");
                _logger.LogInformation(">>> [END EMAIL] <<<");
                return;
            }

            try
            {
                using var client = new SmtpClient(smtpServer, smtpPort)
                {
                    Credentials = new NetworkCredential(smtpUser, smtpPass),
                    EnableSsl = true
                };

                var mailMessage = new MailMessage
                {
                    From = new MailAddress(fromEmail, "ChefSupply Admin"),
                    Subject = subject,
                    Body = body,
                    IsBodyHtml = true
                };
                mailMessage.To.Add(toEmail);

                await client.SendMailAsync(mailMessage);
                _logger.LogInformation($"Email successfully sent to {toEmail}");
            }
            catch (Exception ex)
            {
                _logger.LogError($"Failed to send email to {toEmail}: {ex.Message}");
                // We don't throw here to prevent order placement from failing due to email issues
            }
        }
    }
}
