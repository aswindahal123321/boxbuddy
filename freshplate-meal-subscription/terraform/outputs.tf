####################################################
# OUTPUTS
####################################################

# CloudFront distribution domain
output "cloudfront_domain" {
  description = "The domain name of the CloudFront distribution"
  value       = aws_cloudfront_distribution.s3_distribution.domain_name
}

# CloudFront distribution ID
output "cloudfront_distribution_id" {
  description = "ID of the CloudFront distribution (needed if deleting)"
  value       = aws_cloudfront_distribution.s3_distribution.id
}

# Origin Access Identity (OAI)
output "cloudfront_oai" {
  description = "CloudFront Origin Access Identity to be used in S3 bucket policy"
  value       = aws_cloudfront_origin_access_identity.oai.cloudfront_access_identity_path
}

output "users_table_name" {
  description = "DynamoDB table storing user profiles"
  value       = aws_dynamodb_table.users.name
}

output "orders_table_name" {
  description = "DynamoDB table storing orders and subscriptions"
  value       = aws_dynamodb_table.orders.name
}

output "lambda_role_arn" {
  description = "IAM role assumed by Lambda functions"
  value       = aws_iam_role.lambda_exec.arn
}

output "lambda_function_urls" {
  description = "Public function URLs for each Lambda handler"
  value       = { for name, url in aws_lambda_function_url.api : name => url.function_url }
}
