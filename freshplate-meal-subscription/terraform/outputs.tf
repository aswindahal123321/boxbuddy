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
