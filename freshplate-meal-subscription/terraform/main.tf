# --- FRONTEND HOSTING (S3 & CLOUDFRONT) ---

# Create an S3 bucket to store the static files of the React app.
# It's configured to be private, accessible only by CloudFront.
resource "aws_s3_bucket" "frontend" {
  bucket = "${var.app_name}-frontend-bucket-${random_id.bucket_id.hex}"
}

# A random suffix to ensure the S3 bucket name is globally unique.
resource "random_id" "bucket_id" {
  byte_length = 8
}

# CloudFront needs an identity to securely access the private S3 bucket.
resource "aws_cloudfront_origin_access_identity" "oai" {
  comment = "OAI for ${var.app_name} frontend bucket"
}

# Bucket policy allowing CloudFront to read objects.
resource "aws_s3_bucket_policy" "frontend_policy" {
  bucket = aws_s3_bucket.frontend.id
  policy = jsonencode({
    Version = "2012-10-17",
    Statement = [
      {
        Effect    = "Allow",
        Principal = { "AWS" : aws_cloudfront_origin_access_identity.oai.iam_arn },
        Action    = "s3:GetObject",
        Resource  = "${aws_s3_bucket.frontend.arn}/*"
      }
    ]
  })
}

# The CloudFront distribution that serves the app.
resource "aws_cloudfront_distribution" "s3_distribution" {
  origin {
    domain_name = aws_s3_bucket.frontend.bucket_regional_domain_name
    origin_id   = "S3-${aws_s3_bucket.frontend.id}"

    s3_origin_config {
      origin_access_identity = aws_cloudfront_origin_access_identity.oai.cloudfront_access_identity_path
    }
  }

  enabled             = true
  is_ipv6_enabled     = true
  default_root_object = "index.html"

  default_cache_behavior {
    allowed_methods  = ["GET", "HEAD", "OPTIONS"]
    cached_methods   = ["GET", "HEAD"]
    target_origin_id = "S3-${aws_s3_bucket.frontend.id}"
    viewer_protocol_policy = "redirect-to-https"

    forwarded_values {
      query_string = false
      cookies {
        forward = "none"
      }
    }
  }

  # Redirects all 404s to index.html for client-side routing.
  custom_error_response {
    error_code            = 404
    response_code         = 200
    response_page_path    = "/index.html"
    error_caching_min_ttl = 10
  }

  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }

  viewer_certificate {
    cloudfront_default_certificate = true
  }
}

# --- FRONTEND HOSTING (S3 & CLOUDFRONT) ---

# Create an S3 bucket to store the static files of the React app.
# It's configured to be private, accessible only by CloudFront.
resource "aws_s3_bucket" "frontend" {
  bucket = "${var.app_name}-frontend-bucket-${random_id.bucket_id.hex}"
}

# A random suffix to ensure the S3 bucket name is globally unique.
resource "random_id" "bucket_id" {
  byte_length = 8
}

# CloudFront needs an identity to securely access the private S3 bucket.
resource "aws_cloudfront_origin_access_identity" "oai" {
  comment = "OAI for ${var.app_name} frontend bucket"
}

# Bucket policy allowing CloudFront to read objects.
resource "aws_s3_bucket_policy" "frontend_policy" {
  bucket = aws_s3_bucket.frontend.id
  policy = jsonencode({
    Version = "2012-10-17",
    Statement = [
      {
        Effect    = "Allow",
        Principal = { "AWS" : aws_cloudfront_origin_access_identity.oai.iam_arn },
        Action    = "s3:GetObject",
        Resource  = "${aws_s3_bucket.frontend.arn}/*"
      }
    ]
  })
}

# The CloudFront distribution that serves the app.
resource "aws_cloudfront_distribution" "s3_distribution" {
  origin {
    domain_name = aws_s3_bucket.frontend.bucket_regional_domain_name
    origin_id   = "S3-${aws_s3_bucket.frontend.id}"

    s3_origin_config {
      origin_access_identity = aws_cloudfront_origin_access_identity.oai.cloudfront_access_identity_path
    }
  }

  enabled             = true
  is_ipv6_enabled     = true
  default_root_object = "index.html"

  default_cache_behavior {
    allowed_methods  = ["GET", "HEAD", "OPTIONS"]
    cached_methods   = ["GET", "HEAD"]
    target_origin_id = "S3-${aws_s3_bucket.frontend.id}"
    viewer_protocol_policy = "redirect-to-https"

    forwarded_values {
      query_string = false
      cookies {
        forward = "none"
      }
    }
  }

  # Redirects all 404s to index.html for client-side routing.
  custom_error_response {
    error_code            = 404
    response_code         = 200
    response_page_path    = "/index.html"
    error_caching_min_ttl = 10
  }

  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }

  viewer_certificate {
    cloudfront_default_certificate = true
  }
}


# --- AUTHENTICATION (COGNITO) ---

resource "aws_cognito_user_pool" "user_pool" {
  name = "${var.app_name}-user-pool"

  # Users can sign up with an email, which will also be their username.
  username_attributes = ["email"]

  # Define password strength requirements.
  password_policy {
    minimum_length    = 8
    require_lowercase = true
    require_numbers   = true
    require_symbols   = true
    require_uppercase = true
  }

  # Configuration for email verification.
  auto_verified_attributes = ["email"]
}

# A client that the React app will use to interact with the User Pool.
resource "aws_cognito_user_pool_client" "user_pool_client" {
  name = "${var.app_name}-app-client"
  user_pool_id = aws_cognito_user_pool.user_pool.id

  # Important: No secret is generated for a public client (like a browser app).
  generate_secret = false

  # Allow explicit authentication flows.
  explicit_auth_flows = ["ALLOW_USER_PASSWORD_AUTH", "ALLOW_REFRESH_TOKEN_AUTH"]
}

# (Optional) Create a group for administrators within the user pool.
resource "aws_cognito_user_group" "admins" {
  name         = "Admins"
  user_pool_id = aws_cognito_user_pool.user_pool.id
  description  = "Group for BoxBuddy administrators"
}

# (Optional) Create the initial admin user.
# NOTE: The password will be temporary. You'll need to reset it on first login.
resource "aws_cognito_user" "admin_user" {
  user_pool_id = aws_cognito_user_pool.user_pool.id
  username     = var.admin_email

  attributes = {
    email          = var.admin_email
    email_verified = true
  }
}

# (Optional) Add the initial admin user to the Admins group.
resource "aws_cognito_user_in_group" "admin_user_in_group" {
  user_pool_id = aws_cognito_user_pool.user_pool.id
  group_name   = aws_cognito_user_group.admins.name
  username     = aws_cognito_user.admin_user.username
}


# --- DATABASE (DYNAMODB) ---

resource "aws_dynamodb_table" "users_table" {
  name           = "${var.app_name}-Users"
  billing_mode   = "PAY_PER_REQUEST"
  hash_key       = "id"

  attribute {
    name = "id"
    type = "S" # S for String
  }
}

resource "aws_dynamodb_table" "meals_table" {
  name           = "${var.app_name}-Meals"
  billing_mode   = "PAY_PER_REQUEST"
  hash_key       = "id"

  attribute {
    name = "id"
    type = "S"
  }
}

resource "aws_dynamodb_table" "orders_table" {
  name           = "${var.app_name}-Orders"
  billing_mode   = "PAY_PER_REQUEST"
  hash_key       = "id"

  attribute {
    name = "id"
    type = "S"
  }
}