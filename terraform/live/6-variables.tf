variable "project_name" {
  description = "Project name"
  type        = string
  default     = "notification-service"
}

variable "region" {
  description = "AWS Region"
  type        = map(string)
  default = {
    prod = "eu-west-3"
    stg  = "eu-west-3"
    dev  = "eu-west-3"
  }
}

variable "environment_specific_tag" {
  description = "Environment specific tags"
  type        = map(map(string))
  default = {
    prod = {}
    stg  = {}
    dev  = {}
  }
}

variable "resend_api_key" {
  description = "Resend API key"
  type        = string
}
