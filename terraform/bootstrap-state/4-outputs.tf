output "bucket" {
  description = "The name of the S3 bucket hosting the website"
  value       = aws_s3_bucket.terraform_state.id
}

output "dynamodb_table" {
  description = "The name of the DynamoDB table"
  value       = aws_dynamodb_table.terraform_locks.name
}
