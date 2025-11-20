# Kubernetes Deployment

These manifests deploy the Express version of the backend on any Kubernetes cluster.

## Files

- `backend-deployment.yaml` – runs two replicas of the container image and injects required environment variables.
- `backend-service.yaml` – exposes the Deployment via a LoadBalancer (or NodePort if your cluster lacks a load balancer).
- `backend-secret.yaml` – stores the JWT secret. Replace the placeholder `change-me` value.

## Usage

1. Build and push the container image from `freshplate-meal-subscription/backend`:
   ```bash
   docker build -t <account>.dkr.ecr.<region>.amazonaws.com/freshplate-backend:latest .
   docker push <account>.dkr.ecr.<region>.amazonaws.com/freshplate-backend:latest
   ```
2. Update `backend-deployment.yaml` with the pushed image URI and DynamoDB table names (`USERS_TABLE`, `ORDERS_TABLE`, `PRODUCTS_TABLE`). Make sure the secret includes both `jwtSecret` and `adminBypassToken`.
3. Apply the resources:
   ```bash
   kubectl apply -f infrastructure/k8s/backend-secret.yaml
   kubectl apply -f infrastructure/k8s/backend-deployment.yaml
   kubectl apply -f infrastructure/k8s/backend-service.yaml
   ```
4. Retrieve the external IP from `kubectl get svc freshplate-backend` and use it as `VITE_EXPRESS_BASE_URL` in the frontend.
