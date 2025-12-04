####################################################
# TERRAFORM PROVIDER REQUIREMENTS
####################################################

terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

####################################################
# AWS PROVIDER CONFIGURATION
####################################################

provider "aws" {
  region = var.aws_region

  # Still valid in AWS Academy VocLabs
  skip_requesting_account_id = true
}
