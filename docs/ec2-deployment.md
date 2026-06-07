# EC2 single-server deployment (Halo Leaf)

Deploy the **storefront**, **Medusa backend**, **PostgreSQL**, and **Redis** on one **t3.medium** EC2 instance. This is the recommended path while the client adds products, warehouse details, and Shiprocket setup in Medusa Admin.

The repo also includes a separate **CDK / Fargate + RDS** stack in `infra/aws/` for later scale-out. For now, EC2 is simpler and much cheaper.

## Architecture

```text
Internet
   │
   ▼
EC2 t3.medium (ap-south-1)
├── nginx:9001  →  React storefront (dist/)
│               →  proxy /store, /auth, /admin, /app, /carrier-tracking → backend:9000
├── backend:9000  →  Medusa v2 API + Admin (direct access)
├── postgres:16   →  order + catalog data (persistent volume)
└── redis:7       →  Medusa cache / workflows
```

**Storefront:** `http://<your-server>:9001/`  
**Backend API (direct):** `http://<your-server>:9000/`  
**Medusa Admin:** `http://<your-server>:9001/app` or `:9000/app`  
**Shiprocket webhook (later):** `http://<your-server>:9001/carrier-tracking/webhook`

Ports **9000** and **9001** are used so this stack does not conflict with other projects on 80/443.

## Coexisting with other projects on the same EC2

This stack is isolated from other apps on the host:

| Isolation | How |
|-----------|-----|
| Docker project name | `halo-leaf` (separate containers/networks/volumes) |
| Host ports | Only **9000** and **9001** — does not bind 80/443 |
| Postgres / Redis | Internal Docker network only (not exposed on host) |
| Preflight | `deploy.sh` aborts if 9000/9001 are taken by a **non-halo-leaf** process |

Install into a dedicated directory (e.g. `~/Halo-leaf`). Do **not** run `docker compose down` without `-f docker-compose.prod.yml` in that directory — it will only affect the halo-leaf project.

```bash
# Safe: only touches halo-leaf stack
cd ~/Halo-leaf
docker compose -f docker-compose.prod.yml ps
docker compose -f docker-compose.prod.yml logs backend
```

## Can a t3.medium handle this?

Yes, for launch and client onboarding:

| Resource | Limit in compose | Notes |
|----------|------------------|-------|
| RAM | ~2.7 GB for containers | 4 GB instance leaves headroom for OS |
| vCPU | 2 | Fine for moderate traffic |
| Disk | EBS 30–50 GB recommended | Postgres + Docker images |

Upgrade to **t3.large** or split DB to RDS if traffic grows.

## Estimated monthly cost (EC2 path)

| Item | Approx. (ap-south-1) |
|------|----------------------|
| t3.medium (you already have) | ~₹2,500–3,000 / $30–35 |
| EBS 40 GB gp3 | ~₹300 / $4 |
| Elastic IP (attached) | Free |
| **Total** | **~₹2,800–3,500 / month** |

Compare: CDK stack (Fargate ×2 + RDS + ElastiCache + NAT) is typically **$100+/month**.

## Prerequisites

1. **EC2** — Ubuntu 22.04 or 24.04, **t3.medium**, 40 GB gp3 root volume  
2. **Security group**
   - SSH `22` — your IP only  
   - TCP `9000` — Medusa backend (API + Admin direct)  
   - TCP `9001` — storefront (nginx)  
3. **Elastic IP** attached to the instance (optional but recommended)  
4. **Domain** (optional) — if you use a reverse proxy on 80/443 elsewhere, point it to `:9001` / `:9000`  
5. **Razorpay** test keys (live later)  
6. **Shiprocket** — leave empty until client configures warehouse (see end)

## 1. Connect and clone

```bash
ssh -i your-key.pem ubuntu@<elastic-ip>

sudo apt-get update && sudo apt-get install -y git
git clone https://github.com/<your-org>/Halo-leaf.git
cd Halo-leaf
chmod +x deploy/ec2/*.sh
./deploy/ec2/setup-ec2.sh
```

Log out and back in after setup so the `docker` group applies.

## 2. Configure environment

```bash
cp deploy/ec2/env.production.example deploy/ec2/.env
nano deploy/ec2/.env
```

Set at minimum:

| Variable | Example |
|----------|---------|
| `PUBLIC_URL` | `http://<elastic-ip>:9001` |
| `BACKEND_PORT` / `FRONTEND_PORT` | `9000` / `9001` (defaults) |
| `POSTGRES_PASSWORD` | long random string |
| `JWT_SECRET` / `COOKIE_SECRET` | `openssl rand -hex 32` each |
| `STORE_CORS` / `ADMIN_CORS` / `AUTH_CORS` | `http://<host>:9001,http://<host>:9000` |
| `VITE_API_BASE_URL` / `VITE_IMAGE_BASE_URL` | `http://<host>:9001` |
| `VITE_RAZORPAY_KEY_ID` | Razorpay key id |
| `RAZORPAY_ID` / `RAZORPAY_SECRET` | backend Razorpay keys |

Leave **Shiprocket** blank for now. Add after warehouse + products exist.

## 3. Deploy

```bash
./deploy/ec2/deploy.sh
./deploy/ec2/post-deploy.sh
```

Create admin user when prompted:

```bash
docker compose -f docker-compose.prod.yml exec backend npx medusa user \
  -e admin@haloleaf.com -p 'YourSecurePassword'
```

## 4. HTTPS (optional)

With custom ports, Let's Encrypt on 80/443 is usually handled by a **separate reverse proxy** (nginx/Caddy on the host) that forwards to `:9001` and `:9000`. If you only use IP + ports for now, skip TLS until you add a domain proxy.

If you later terminate TLS on a host proxy listening on 443:

```nginx
location / {
  proxy_pass http://127.0.0.1:9001;
}
```

Update `PUBLIC_URL`, CORS, and `VITE_*` URLs to your `https://` domain after that.

## 5. Client setup in Medusa Admin (after deploy)

Do this **before** turning on Shiprocket auto-fulfillment:

1. **Stock location** — warehouse name, full address, **pincode** (required for shipping quotes)  
2. **Products** — variants, INR prices, images  
3. **Weight & dimensions** on each variant (grams + mm in Admin; needed for Shiprocket later)  
4. **Inventory** — levels at the warehouse location  
5. **Publishable API key** — Settings → Publishable API Keys → attach sales channel  
   - Copy key to `VITE_MEDUSA_PUBLISHABLE_KEY` in `deploy/ec2/.env`  
   - Re-run `./deploy/ec2/deploy.sh`  
6. **Shipping options** — keep **manual** provider for launch  
7. **Payments** — enable Razorpay on India region  

Run the checklist in `docs/production-smoke-test.md`.

## 6. Shiprocket (after client data is ready)

When warehouse and products are in Admin:

1. Add to `deploy/ec2/.env`:
   - `SHIPROCKET_EMAIL`, `SHIPROCKET_PASSWORD`
   - `SHIPROCKET_PICKUP_LOCATION` = nickname in Shiprocket dashboard  
   - `DEFAULT_PICKUP_PINCODE` = warehouse pincode  
2. Restart backend:  
   `docker compose -f docker-compose.prod.yml restart backend`  
3. In Admin: enable **shiprocket** fulfillment provider on India region  
4. Create/edit shipping option to use **shiprocket** provider (or keep manual + live quotes from checkout)  
5. Webhook in Shiprocket: `http://<host>:9001/carrier-tracking/webhook` with `SHIPROCKET_WEBHOOK_SECRET`

## Day-2 operations

| Task | Command |
|------|---------|
| View logs | `docker compose -f docker-compose.prod.yml logs -f backend` |
| Restart all | `docker compose -f docker-compose.prod.yml restart` |
| Update code | `git pull && ./deploy/ec2/deploy.sh` |
| DB backup | `docker compose -f docker-compose.prod.yml exec postgres pg_dump -U medusa medusa > backup.sql` |
| Migrations | `docker compose -f docker-compose.prod.yml exec backend npx medusa db:migrate` |

## Backups (recommended)

1. **EBS snapshot** — weekly on the instance volume (AWS Console or Lifecycle Manager)  
2. **Postgres dump** — daily cron to S3:

```bash
# Example cron — adjust paths and S3 bucket
0 2 * * * cd /home/ubuntu/Halo-leaf && docker compose -f docker-compose.prod.yml exec -T postgres pg_dump -U medusa medusa | gzip > /tmp/medusa-$(date +\%F).sql.gz
```

## Troubleshooting

| Symptom | Fix |
|---------|-----|
| 502 on `/store/*` | `docker compose -f docker-compose.prod.yml logs backend` |
| CORS errors | CORS must list both `:9001` and `:9000` if you use Admin on either port |
| Empty storefront API | Rebuild after setting `VITE_MEDUSA_PUBLISHABLE_KEY` |
| Out of memory | `free -h` — consider t3.large or reduce backend memory limit |
| Admin blank at `/app` | Ensure nginx proxies `/app` with WebSocket headers (already in config) |

## Alternative: CDK / Fargate deploy

For multi-AZ production later, use `docs/aws-deployment.md` and `infra/aws/`. Not required for initial client onboarding on your EC2 box.

## Related docs

- `docs/production-smoke-test.md` — post-deploy checklist  
- `docs/aws-deployment.md` — scaled AWS (S3 + CloudFront + Fargate + RDS)  
- `backend/README.md` — Shiprocket weight/dimensions note
