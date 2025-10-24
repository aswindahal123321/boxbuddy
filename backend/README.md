# BoxBuddy Backend Starter (Express + Sequelize + MySQL)

## Prerequisites
- Node.js 20+
- MySQL 8 (local) and MySQL Workbench

## 1) Create DB & user in MySQL
Use Workbench or run:
```sql
CREATE DATABASE boxbuddy DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci;
CREATE USER 'boxuser'@'%' IDENTIFIED BY 'boxpass';
GRANT ALL PRIVILEGES ON boxbuddy.* TO 'boxuser'@'%';
FLUSH PRIVILEGES;
```

## 2) Configure env
Copy `.env.sample` → `.env` and adjust values if needed.

## 3) Install & run
```bash
npm install
npm run dev
# health check:
# GET http://localhost:4000/api/health
```

## 4) Seed dev data
```bash
npm run db:seed
# Login with email: dev@boxbuddy.local, password: password123
```

## 5) Key endpoints
- `POST /api/auth/register` { email, password, fullName }
- `POST /api/auth/login` { email, password }
- `GET  /api/products`
- `POST /api/subscriptions` (Bearer token) { productId, renewInterval }
- `GET  /api/subscriptions/my` (Bearer token)
- `POST /api/billing/charge` (Bearer token) { subscriptionId, amount_cents }
- `POST /api/fulfillment/create-shipment` (Bearer token) { subscriptionId }
- `GET  /api/fulfillment/subscription/:id` (Bearer token)

## 6) Wire your frontend
- Serve your `/frontend` folder with a simple dev server (VS Code Live Server or `python -m http.server`).
- Create `frontend/assets/js/api.js`:

```html
<script>
const API = 'http://localhost:4000';
function token(){ return localStorage.getItem('token'); }
async function api(path, opts={}){
  const headers = { 'Content-Type':'application/json', ...(opts.headers||{}) };
  if (token()) headers.Authorization = 'Bearer ' + token();
  const res = await fetch(API + path, { ...opts, headers });
  if (!res.ok) throw await res.json();
  return res.json();
}
</script>
```

- In `login.html`, call `/api/auth/login` and save the token to `localStorage`.
- In `index.html`, fetch `/api/products` and render cards.
- On subscribe buttons, `POST /api/subscriptions` with the product ID.

## 7) Troubleshooting
- If `ECONNREFUSED`, ensure MySQL is running and env matches DB credentials.
- If `Invalid token`, re-login and ensure `Authorization: Bearer <token>` header is sent.
- CORS errors: confirm backend is running on port 4000 and you are serving frontend via http (not file://).
