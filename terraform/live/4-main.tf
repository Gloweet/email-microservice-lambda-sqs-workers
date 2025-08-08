resource "aws_secretsmanager_secret" "RESEND_API_KEY" {
  name = "${local.prefix}-resend-api-key"
}
resource "aws_secretsmanager_secret_version" "RESEND_API_KEY" {
  secret_id     = aws_secretsmanager_secret.RESEND_API_KEY.id
  secret_string = var.resend_api_key
}
