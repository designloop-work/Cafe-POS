# ☕ CaféPOS — Point of Sale System

A full-stack POS system for cafés and restaurants with real-time order management, kitchen display, customer self-ordering via QR code, and analytics dashboard.

**Live Demo:**
- Frontend: [pos-cafe.netlify.app](https://pos-cafe.netlify.app)
- Backend API: [pos-9ye6.onrender.com](https://pos-9ye6.onrender.com)
- API Docs: [pos-9ye6.onrender.com/docs](https://pos-9ye6.onrender.com/docs)

---

## ✨ Features

- **Admin Dashboard** — analytics, revenue charts, product/table/staff management
- **Staff Interface** — table selection, order taking, cash & UPI payment processing
- **Kitchen Display** — real-time order status screen for kitchen staff
- **Customer TV Screen** — live order status display for customers (`/display/customer`)
- **QR Self-Ordering** — customers scan table QR code and order directly from their phone
- **Real-time Updates** — WebSocket-based live sync across all connected clients
- **Role-based Access** — Admin and Staff roles with protected routes

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, Vite, Tailwind CSS, Framer Motion |
| Backend | FastAPI, Uvicorn, Python 3.11 |
| Database | MongoDB (Motor async driver) |
| Auth | JWT (PyJWT) + bcrypt (passlib) |
| Real-time | WebSockets |
| Deployment | Netlify (frontend) + Render (backend) |

---

## 📁 Project Structure

```
POS/
├── backend/
│   ├── app/
│   │   ├── core/          # config, database, utils
│   │   ├── models/        # enums (UserRole, OrderStatus, etc.)
│   │   ├── routes/        # auth, tables, products, orders, kitchen, analytics, public
│   │   ├── schemas/       # Pydantic request/response models
│   │   ├── services/      # order business logic
│   │   ├── websockets/    # connection manager
│   │   └── main.py        # app entry point
│   ├── requirements.txt
│   ├── runtime.txt
│   ├── seed.py            # sample products & orders
│   └── seed_admin.py      # creates first admin user
│
├── frontend/
│   ├── src/
│   │   ├── components/    # AdminLayout, StaffLayout, Modal, Button, Skeleton
│   │   ├── context/       # AuthContext, OrderContext
│   │   ├── pages/         # admin/, staff/, Login, Signup, CustomerDisplay, TableMenu
│   │   ├── services/      # api.js (axios), socket.js (websocket)
│   │   └── utils/         # helpers, toast, upi
│   └── vite.config.js
│
├── render.yaml            # Render deployment config
└── README.md
```

---

## 🚀 Local Development

### Prerequisites
- Python 3.11+
- Node.js 18+
- MongoDB (local or Atlas)

### Backend

```bash
cd backend
pip install -r requirements.txt
```

Create `backend/.env`:
```env
MONGO_URL=mongodb://localhost:27017
MONGO_DB=pos_cafe
SECRET_KEY=your-secret-key-min-32-chars
ADMIN_REGISTER_SECRET=your-admin-secret
ACCESS_TOKEN_EXPIRE_MINUTES=480
ALLOWED_ORIGINS=http://localhost:5173
```

```bash
uvicorn app.main:app --reload --port 8000
```

### Frontend

```bash
cd frontend
npm install
```

Create `frontend/.env`:
```env
VITE_API_URL=http://localhost:8000
VITE_WS_URL=ws://localhost:8000/ws/orders
```

```bash
npm run dev
```

### Seed the database

```bash
cd backend
python seed_admin.py   # creates admin user
python seed.py         # adds sample products and orders
```

### Access

| Service | URL |
|---|---|
| Frontend | http://localhost:5173 |
| Backend | http://localhost:8000 |
| API Docs | http://localhost:8000/docs |

---

## 🌐 Deployment

### Backend — Render

| Setting | Value |
|---|---|
| Runtime | Python |
| Root Directory | `backend` |
| Build Command | `pip install -r requirements.txt` |
| Start Command | `uvicorn app.main:app --host 0.0.0.0 --port $PORT` |

**Environment Variables:**

| Key | Value |
|---|---|
| `PYTHON_VERSION` | `3.11.9` |
| `MONGO_URL` | MongoDB Atlas connection string |
| `MONGO_DB` | `pos_cafe` |
| `SECRET_KEY` | random 32+ char string |
| `ALLOWED_ORIGINS` | your Netlify frontend URL |

### Frontend — Netlify

| Setting | Value |
|---|---|
| Base Directory | `frontend` |
| Build Command | `npm run build` |
| Publish Directory | `frontend/dist` |

**Environment Variables:**

| Key | Value |
|---|---|
| `VITE_API_URL` | `https://your-backend.onrender.com` |
| `VITE_WS_URL` | `wss://your-backend.onrender.com/ws/orders` |

> ⚠️ Vite bakes env vars at build time. Always trigger a fresh deploy after changing them.

---

## 📱 Pages & Routes

| URL | Description | Auth |
|---|---|---|
| `/login` | Login page | Public |
| `/signup` | Staff registration | Public |
| `/display/customer` | TV screen — order status | Public |
| `/display/staff` | Staff-facing display | Public |
| `/menu/:tableId` | Customer self-order (QR target) | Public |
| `/admin/dashboard` | Admin overview & stats | Admin |
| `/admin/tables` | Table management + QR codes | Admin |
| `/admin/products` | Product management | Admin |
| `/admin/orders` | Order history | Admin |
| `/admin/analytics` | Revenue & sales charts | Admin |
| `/admin/staff` | Staff management | Admin |
| `/staff/tables` | Table selection grid | Staff |
| `/staff/order` | Order taking + payment | Staff |
| `/staff/payments` | Payment history | Staff |

---

## 🔌 API Reference

### Auth
```
POST /auth/register    — create staff account
POST /auth/login       — returns JWT token
POST /auth/promote     — change user role (admin only)
```

### Core (auth required)
```
GET  /tables/                  — list tables
POST /tables/                  — create table
GET  /products/                — list products
POST /products/                — create product
GET  /orders/                  — list orders
POST /orders/                  — create order
PATCH /orders/{id}/status      — update order status
GET  /kitchen/orders           — preparing orders
GET  /analytics/overview       — stats summary
```

### Public (no auth)
```
GET  /public/table/{tableId}   — table info
GET  /public/products          — available products
POST /public/orders            — customer self-order
```

### WebSocket
```
ws://your-backend/ws/orders

Messages:
  { "type": "NEW_ORDER",    "data": <order> }
  { "type": "UPDATE_ORDER", "data": <order> }
```

---

## 👥 User Roles

**Admin** — full access to dashboard, analytics, product/table/staff management

**Staff** — table selection, order creation, payment processing, payment history

**Customer** — scans QR code at table, browses menu, places order (no account needed)

---

## 💳 Payment Methods

- **Cash** — staff enters received amount, app calculates change
- **UPI** — QR code generated from order total, customer scans with any UPI app

---

## 📺 TV Display Setup

Open `/display/customer` on a TV or monitor in your café. It shows:
- Left column — orders being prepared (blue)
- Right column — orders ready to collect (green)
- Live clock and real-time WebSocket updates
- No login required

---

## License

MIT
