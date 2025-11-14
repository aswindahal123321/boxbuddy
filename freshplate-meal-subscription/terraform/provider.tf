# Specifies that we are using the AWS provider
terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

# Configure the AWS Provider with your desired region
# Terraform will use the credentials configured in your AWS CLI
provider "aws" {
  region = var.aws_region
}