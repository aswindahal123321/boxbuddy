<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/1T9mVuWqLgn7_Jmtrayp4I2j3dyQWrlci

## Run Locally

**Prerequisites:** Node.js 20+, npm

1. Install dependencies: `npm install`
2. Duplicate `.env.example` to `.env.local` and set:
   - `VITE_EXPRESS_BASE_URL` to the URL where your Express API runs (Cloud9 preview, EC2, Kubernetes, etc.).
   - `VITE_ADMIN_TOKEN` to the same value as `ADMIN_BYPASS_TOKEN` on the backend (defaults to `admin-local-token`).
3. Start the app: `npm run dev`

## Backend (Express API)

```
cd freshplate-meal-subscription/backend
npm install
npm run build
```

Set environment variables before running:
```
export USERS_TABLE=boxbuddy-users
export ORDERS_TABLE=boxbuddy-orders
export PRODUCTS_TABLE=boxbuddy-products
export JWT_SECRET=<random-string>
export ADMIN_BYPASS_TOKEN=admin-local-token   # must match VITE_ADMIN_TOKEN
export ADMIN_BYPASS_EMAIL=admin@gmail.com
npm run start:server
```

- Ensure the DynamoDB tables (`boxbuddy-users`, `boxbuddy-orders`) exist once in your AWS account—after that the API populates them automatically via signup/admin flows.
- `Dockerfile` builds the Express API container; deploy it anywhere that has DynamoDB permissions (EC2, ECS, EKS, etc.).
- Edit the Kubernetes manifests under `infrastructure/k8s/` to point at your ECR image and table names.

## Terraform (S3 + CloudFront only)

```
cd freshplate-meal-subscription/terraform
terraform init
terraform apply -var="frontend_bucket_name=<existing-bucket>"
```

Outputs:
- `cloudfront_domain` – CDN URL serving the Vite build (sync `dist/` to your bucket).
- `cloudfront_oai` – add this identity to the S3 bucket policy so CloudFront can read files.

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

Update the Deployment with your image URI, table names, JWT secret, and set `ADMIN_BYPASS_TOKEN`/`ADMIN_BYPASS_EMAIL` env vars. The Service exposes port 80 -> 8080; use the external IP as the API base URL in `.env.local`.

## DynamoDB Tables

Create these tables once (PAY_PER_REQUEST):
- `boxbuddy-users` with `pk` (HASH), `sk` (RANGE), and GSI `gsi1pk` for email lookup.
- `boxbuddy-orders` with `pk`, `sk`, and GSI `gsi1pk` for order lookup.
- `boxbuddy-products` with `pk` (HASH = `PRODUCT`) and `sk` (`PRODUCT#<id>`). No GSI required initially.

The Express API automatically stores users, orders, subscriptions, and products in these tables.
