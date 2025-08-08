output "secret_resend_api_key_name" {
  description = "Resend API key for notification service"
  value       = aws_secretsmanager_secret.RESEND_API_KEY.name
}
