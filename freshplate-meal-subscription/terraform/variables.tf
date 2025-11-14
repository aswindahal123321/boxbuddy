####################################################
# GLOBAL VARIABLES
####################################################

variable "aws_region" {
  description = "AWS region where all resources will be deployed."
  type        = string
  default     = "us-east-1"

  validation {
    condition     = length(var.aws_region) > 0
    error_message = "AWS region cannot be empty."
  }
}

variable "app_name" {
  description = "Application name used for naming AWS resources."
  type        = string
  default     = "boxbuddy"

  validation {
    condition     = can(regex("^[a-zA-Z0-9-]+$", var.app_name))
    error_message = "app_name may only contain letters, numbers, and hyphens."
  }
}

variable "admin_email" {
  description = "Email address of the initial Cognito admin user."
  type        = string
  default     = "admin@example.com"

  validation {
    condition     = can(regex("^[^@]+@[^@]+\\.[^@]+$", var.admin_email))
    error_message = "admin_email must be a valid email address."
  }
}

####################################################
# MANUAL S3 BUCKET NAME (No Terraform creation)
####################################################

variable "frontend_bucket_name" {
  description = "Name of the manually created S3 bucket used for hosting the frontend."
  type        = string

  # No default — must be provided when running terraform apply
  # Example: terraform apply -var=\"frontend_bucket_name=boxbuddy-frontend-manual\"

  validation {
    condition     = can(regex("^[a-z0-9.-]+$", var.frontend_bucket_name))
    error_message = "frontend_bucket_name must contain only lowercase letters, numbers, dots, and hyphens (S3 bucket naming rules)."
  }
}
