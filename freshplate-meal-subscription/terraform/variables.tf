variable "aws_region" {
  description = "The AWS region to deploy resources in."
  type        = string
  default     = "us-east-1"
}

variable "app_name" {
  description = "The name of the application, used for naming resources."
  type        = string
  default     = "boxbuddy"
}

variable "admin_email" {
  description = "The email address for the initial admin user in Cognito."
  type        = string
  # IMPORTANT: Change this to a real email you can access.
  default     = "admin@example.com"
}