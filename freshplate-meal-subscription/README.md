<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/1T9mVuWqLgn7_Jmtrayp4I2j3dyQWrlci

## Run Locally

**Prerequisites:** Node.js 20+, npm

1. Install dependencies: `npm install`
2. Duplicate `.env.example` to `.env.local` and fill in the Lambda Function URLs that Terraform prints (`terraform output lambda_function_urls`). If you run the Express API (Docker/K8s), set `VITE_EXPRESS_BASE_URL` instead.
3. Start the app: `npm run dev`

## Backend (Lambdas + Express)

```
cd freshplate-meal-subscription/backend
npm install
npm run build
for fn in signup login me createOrder listOrders; do \
  zip -jr "dist/${fn}.zip" "dist/${fn}"; \
done
```

- Use `npm run start:server` to run the Express API locally (uses the same DynamoDB tables).
- `Dockerfile` builds the Express API container; see `infrastructure/k8s/` for manifests.

## Terraform (S3 + CloudFront + DynamoDB + Lambda)

```
cd freshplate-meal-subscription/terraform
terraform init
terraform apply \
  -var="frontend_bucket_name=<existing-bucket>" \
  -var="lambda_artifact_bucket=<existing-bucket>" \
  -var="jwt_secret=<random-string>"
```

Outputs:
- `cloudfront_domain` – CDN URL serving the Vite build (sync `dist/` to your bucket).
- `lambda_function_urls` – map of public endpoints for each handler; copy them into `.env.local`.
- `users_table_name` / `orders_table_name` – DynamoDB resources for IAM policies and Kubernetes deployments.

## Docker & Kubernetes

```
cd freshplate-meal-subscription/backend
docker build -t <account>.dkr.ecr.<region>.amazonaws.com/freshplate-backend:latest .
docker push <account>.dkr.ecr.<region>.amazonaws.com/freshplate-backend:latest
```

Then apply the manifests:

```
kubectl apply -f infrastructure/k8s/backend-secret.yaml   # set jwtSecret
kubectl apply -f infrastructure/k8s/backend-deployment.yaml
kubectl apply -f infrastructure/k8s/backend-service.yaml
```

Update the Deployment with your image URI and table names. The Service exposes port 80 -> 8080; use the external IP as the API base URL when not relying on Lambda Function URLs.
