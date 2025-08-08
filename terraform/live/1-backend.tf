terraform {
  backend "s3" {
    bucket               = "notification-service-tfstate"
    dynamodb_table       = "notification-service-tfstate-locks"
    encrypt              = true
    key                  = "terraform.tfstate"
    region               = "eu-west-3"
    workspace_key_prefix = "workspaces"
  }
}
