## AWS Deployment Runbook

> **Using a single EC2 instance (t3.medium)?** See **[docs/ec2-deployment.md](./ec2-deployment.md)** — cheaper and simpler while the client adds products and warehouse data. This document covers the **scaled** CDK path (Fargate + RDS + CloudFront).

This repo deploys as a split production system:

- **Frontend:** Vite static site uploaded to S3 and served through CloudFront.
- **Backend:** Medusa container on ECS Fargate behind an Application Load Balancer.
- **Database:** RDS PostgreSQL.
- **Cache:** ElastiCache Redis.
- **Secrets:** AWS Secrets Manager.

The AWS CDK scaffold lives in `infra/aws/`.

## 1. Local Verification Before Deploy

From the repo root:

```bash
npm ci
npm run lint
npm run build

cd backend
npm ci
npm run build
```

If the Medusa module schema changed, start local Postgres first:

```bash
docker compose up -d
cd backend
npx medusa db:generate order_action_request
npx medusa db:migrate
```

## 2. CDK Bootstrap And Deploy

```bash
cd infra/aws
npm install
npm run build
npx cdk bootstrap aws://ACCOUNT_ID/ap-south-1
npm run deploy
```

The stack outputs:

- `BackendUrl`
- `FrontendBucketName`
- `FrontendDistributionId`
- `FrontendUrl`

## 3. Backend Secrets

After the CDK stack creates the secret named `halo-leaf/medusa/app`, update it with real values:

- `DATABASE_URL`: `postgres://medusa:<password>@<rds-endpoint>:5432/medusa`
- `JWT_SECRET`: long random production secret
- `COOKIE_SECRET`: long random production secret
- `STRIPE_API_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `RAZORPAY_ID`
- `RAZORPAY_SECRET`
- `RAZORPAY_ACCOUNT`
- `RAZORPAY_WEBHOOK_SECRET`
- `RAPIDSHYP_TOKEN` (optional)

Restart the ECS service after changing secrets.

## 4. Frontend Build Variables

Set these in GitHub environment variables/secrets or your build host:

- `VITE_API_BASE_URL`: Medusa backend URL
- `VITE_IMAGE_BASE_URL`: usually same as backend URL unless you use a CDN
- `VITE_MEDUSA_PUBLISHABLE_KEY`: Medusa Admin → Settings → Publishable API Keys
- `VITE_STRIPE_PUBLISHABLE_KEY`
- `VITE_RAZORPAY_KEY_ID`
- `VITE_MEDUSA_REGION_ID` (optional)
- `VITE_SHOP_NAME` (optional)

## 5. Medusa Admin Setup

1. Run migrations against RDS:

   ```bash
   npx medusa db:migrate
   ```

2. Seed/import products, categories, prices, stock, regions, and shipping options.
3. Create a publishable API key and attach the relevant sales channel.
4. Enable Stripe and Razorpay payment providers on the production region.
5. Confirm each product has at least one purchasable variant and price in the production region currency.

## 6. Payment Webhooks

Configure provider dashboards to call the deployed backend over HTTPS.

- Stripe webhook: use the Medusa Stripe provider webhook endpoint for your installed provider version and set `STRIPE_WEBHOOK_SECRET`.
- Razorpay webhook: configure the plugin route documented by `medusa-plugin-razorpay-v2` and set `RAZORPAY_WEBHOOK_SECRET`.

Use test mode first, then switch backend/frontend keys together for live mode.

## 7. CORS

Set backend env values to the deployed frontend domain:

- `STORE_CORS=https://<cloudfront-or-custom-domain>`
- `ADMIN_CORS=https://<admin-domain>`
- `AUTH_CORS=https://<cloudfront-or-custom-domain>`

Do not use `*` for production CORS after initial smoke testing.

## 8. GitHub Actions

- `.github/workflows/ci.yml` runs frontend lint/build, backend build, and CDK synth.
- `.github/workflows/deploy.yml` deploys CDK and uploads the frontend to S3.

Required GitHub configuration:

- Secret: `AWS_DEPLOY_ROLE_ARN`
- Secret: `VITE_MEDUSA_PUBLISHABLE_KEY`
- Secret: `VITE_STRIPE_PUBLISHABLE_KEY`
- Secret: `VITE_RAZORPAY_KEY_ID`
- Variable: `AWS_REGION`
- Variable: `VITE_API_BASE_URL`
- Variable: `VITE_IMAGE_BASE_URL`
- Variable: `FRONTEND_BUCKET_NAME`
- Variable: `FRONTEND_DISTRIBUTION_ID`

## 9. Production Smoke Test

Run this after every deploy:

1. Open frontend.
2. Browse products and category pages.
3. Open a product detail page.
4. Check delivery pincode.
5. Add product to cart.
6. Increment/decrement/remove cart quantity.
7. Sign up or sign in.
8. Add/select address.
9. Prepare payment.
10. Complete Stripe test payment.
11. Complete Razorpay test payment.
12. Confirm order details page loads.
13. Open Profile → My Orders.
14. Create cancel/return/exchange/support-note requests.
15. Confirm requests are visible on order details.

## 10. Rollback

- Frontend: redeploy the previous CloudFront/S3 artifact.
- Backend: roll ECS service back to the previous task definition.
- Database: do not roll back schema without a tested migration rollback; use snapshots for recovery.
- Payments: keep provider dashboards in test mode until the entire smoke test passes.

