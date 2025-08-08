locals {
  common_tags = {
    Provisioner = "Terraform"
    Workspace   = terraform.workspace
    Scope       = var.project_name
  }

  # Merge common tags with environment-specific tags
  tags = merge(local.common_tags, var.environment_specific_tag[terraform.workspace])

  prefix = "${terraform.workspace}-${var.project_name}"
}
