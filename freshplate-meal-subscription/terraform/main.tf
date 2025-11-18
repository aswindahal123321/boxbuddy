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

resource "aws_dynamodb_table" "users" {
  name         = var.users_table_name_override != "" ? var.users_table_name_override : "${var.app_name}-users"
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "pk"
  range_key    = "sk"

  attribute {
    name = "pk"
    type = "S"
  }
  attribute {
    name = "sk"
    type = "S"
  }
  attribute {
    name = "gsi1pk"
    type = "S"
  } # email lookup

  global_secondary_index {
    name            = "gsi1"
    hash_key        = "gsi1pk"
    projection_type = "ALL"
  }
}

resource "aws_dynamodb_table" "orders" {
  name         = var.orders_table_name_override != "" ? var.orders_table_name_override : "${var.app_name}-orders"
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "pk"
  range_key    = "sk"

  attribute {
    name = "pk"
    type = "S"
  }
  attribute {
    name = "sk"
    type = "S"
  }
  attribute {
    name = "gsi1pk"
    type = "S"
  } # order lookup (e.g., ORDER#<id>)

  global_secondary_index {
    name            = "gsi1"
    hash_key        = "gsi1pk"
    projection_type = "ALL"
  }
}

locals {
  lambda_functions = {
    signup      = { source = "${path.module}/../backend/dist/signup.zip" }
    login       = { source = "${path.module}/../backend/dist/login.zip" }
    me          = { source = "${path.module}/../backend/dist/me.zip" }
    createOrder = { source = "${path.module}/../backend/dist/createOrder.zip" }
    listOrders  = { source = "${path.module}/../backend/dist/listOrders.zip" }
  }
}

data "aws_iam_policy_document" "lambda_assume_role" {
  statement {
    actions = ["sts:AssumeRole"]
    principals {
      type        = "Service"
      identifiers = ["lambda.amazonaws.com"]
    }
  }
}

resource "aws_iam_role" "lambda_exec" {
  name               = "${var.app_name}-lambda-role"
  assume_role_policy = data.aws_iam_policy_document.lambda_assume_role.json
}

data "aws_iam_policy_document" "lambda_permissions" {
  statement {
    actions = [
      "dynamodb:BatchGetItem",
      "dynamodb:BatchWriteItem",
      "dynamodb:DeleteItem",
      "dynamodb:GetItem",
      "dynamodb:PutItem",
      "dynamodb:Query",
      "dynamodb:Scan",
      "dynamodb:UpdateItem"
    ]
    resources = [
      aws_dynamodb_table.users.arn,
      "${aws_dynamodb_table.users.arn}/index/*",
      aws_dynamodb_table.orders.arn,
      "${aws_dynamodb_table.orders.arn}/index/*"
    ]
  }

  statement {
    actions   = ["logs:CreateLogGroup", "logs:CreateLogStream", "logs:PutLogEvents"]
    resources = ["arn:aws:logs:${var.aws_region}:*:log-group:/aws/lambda/*"]
  }
}

resource "aws_iam_role_policy" "lambda_policy" {
  role   = aws_iam_role.lambda_exec.id
  policy = data.aws_iam_policy_document.lambda_permissions.json
}

resource "aws_s3_object" "lambda_artifacts" {
  for_each = local.lambda_functions

  bucket = var.lambda_artifact_bucket
  key    = "lambda/${each.key}.zip"
  source = each.value.source
  etag   = filemd5(each.value.source)
}

resource "aws_lambda_function" "api" {
  for_each = local.lambda_functions

  function_name    = "${var.app_name}-${each.key}"
  role             = aws_iam_role.lambda_exec.arn
  runtime          = "nodejs20.x"
  handler          = "index.handler"
  source_code_hash = filebase64sha256(each.value.source)
  s3_bucket        = var.lambda_artifact_bucket
  s3_key           = aws_s3_object.lambda_artifacts[each.key].key
  architectures    = ["arm64"]
  timeout          = 10

  environment {
    variables = {
      USERS_TABLE  = aws_dynamodb_table.users.name
      ORDERS_TABLE = aws_dynamodb_table.orders.name
      JWT_SECRET   = var.jwt_secret
    }
  }
}

resource "aws_lambda_function_url" "api" {
  for_each = local.lambda_functions

  function_name      = aws_lambda_function.api[each.key].function_name
  authorization_type = "NONE"

  cors {
    allow_credentials = false
    allow_headers     = ["content-type", "authorization"]
    allow_methods     = ["GET", "POST", "OPTIONS"]
    allow_origins     = ["*"]
  }
}
