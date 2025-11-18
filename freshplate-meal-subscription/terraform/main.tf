####################################################
# FRONTEND HOSTING (MANUAL S3 + CLOUDFRONT)
####################################################


# CloudFront Origin Access Identity (OAI)
resource "aws_cloudfront_origin_access_identity" "oai" {
  comment = "OAI for ${var.app_name} frontend bucket"
}

resource "aws_cloudfront_distribution" "s3_distribution" {

  origin {
    # Use regional S3 endpoint for reliability
    domain_name = "${var.frontend_bucket_name}.s3.amazonaws.com"

    origin_id = "S3Origin-${var.frontend_bucket_name}"

    s3_origin_config {
      origin_access_identity = aws_cloudfront_origin_access_identity.oai.cloudfront_access_identity_path
    }
  }

  enabled             = true
  is_ipv6_enabled     = true
  default_root_object = "index.html"
  price_class         = "PriceClass_All"

  default_cache_behavior {
    target_origin_id = "S3Origin-${var.frontend_bucket_name}"

    allowed_methods = ["GET", "HEAD"]
    cached_methods  = ["GET", "HEAD"]

    viewer_protocol_policy = "redirect-to-https"

    forwarded_values {
      query_string = false
      cookies {
        forward = "none"
      }
    }
  }

  # Required for SPA apps (React / Vite)
  custom_error_response {
    error_code            = 404
    response_code         = 200
    response_page_path    = "/index.html"
    error_caching_min_ttl = 0
  }

  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }

  # Use default CloudFront SSL certificate
  viewer_certificate {
    cloudfront_default_certificate = true
  }
}
