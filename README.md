# Luxurisen — Curated Luxury Fashion (Portfolio Demo)

[![Live Demo](https://img.shields.io/badge/Live_Demo-luxurisen.onrender.com-C9A96E?style=for-the-badge&logo=render&logoColor=white)](https://luxurisen.onrender.com/)
[![React](https://img.shields.io/badge/React_19-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS_4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express_5-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Redis](https://img.shields.io/badge/Redis-DC382D?style=for-the-badge&logo=redis&logoColor=white)](https://redis.io/)

A full-stack, luxury fashion e-commerce portfolio demonstration engineered with the MERN stack and Redis. Designed with high-fashion editorial aesthetics, Cormorant Garamond typography, refined warm beige/charcoal/gold palettes, and robust enterprise architecture including distributed response caching and tiered rate limiting.

🔗 **Live Application URL:** [https://luxurisen.onrender.com/](https://luxurisen.onrender.com/)

> **Notice:** This project is a student portfolio and educational demonstration. No real financial transactions or commercial brand operations take place.

---

## 🌟 Key Features

### ⚡ Redis Caching & Distributed Rate Limiting
- **Sub-Millisecond Response Caching**: `GET /api/products` (5 min TTL), `GET /api/products/detail/:id` (10 min TTL), and `GET /api/reviews/:productId` (5 min TTL) are cached in Redis via `ioredis`. Responses expose `X-Cache: HIT` or `X-Cache: MISS` headers.
- **Smart Mutation Purging**: Adding products, product variants, or submitting reviews automatically clears stale cache keys using non-blocking Redis `SCAN` streams.
- **Tiered Rate Limiting**: Global API protection (200 req / 15 min per IP) and strict brute-force prevention on auth endpoints (`/api/auth/login` and `/api/auth/register` capped at 10 attempts / 15 min per IP) using `rate-limit-redis`.
- **Fault-Tolerant Fallback**: Gracefully degrades to database queries and in-memory rate limiting if Redis is unavailable.

### 🔐 Authentication & Access Control
- **Dual-Role RBAC**: Users register as either `buyer` or `seller` with strict role-based route guards (`Protected.jsx`) across both client and server.
- **Public Storefront**: Unauthenticated visitors can browse the storefront catalog (`/`) and view product details (`/product/:productId`) without forced login redirects.
- **Protected Actions**: Orders, checkout, and seller management require authentication before access.
- **Google OAuth 2.0 & JWT**: Stateless JSON Web Tokens stored in secure HTTP-only cookies alongside Google OAuth (Passport.js strategy).
- **Post-Login Routing**: Automatic role redirection sends buyers to `/` and sellers to `/seller/dashboard`.

### 🏷️ Server-Authoritative Promo Code Engine
- **Tamper-Proof Discount Calculation**: Discounts are verified and calculated strictly server-side (`couponModel` & `coupon.dao.js`), eliminating client-side price manipulation.
- **Comprehensive Business Rules**: Supports percentage discounts with max caps (e.g. `LUX80` = 80% off up to ₹2,000), fixed discounts (e.g. `FLAT500` = ₹500 off), minimum cart value constraints, expiration dates, and usage limits.
- **Atomic Usage Tracking**: Coupon redemption counts increment atomically in MongoDB only upon confirmed Razorpay payment signature verification.
- **Live Re-validation**: Active coupons automatically re-validate if the cart subtotal changes (e.g. quantity adjustments).

### 📦 Order History & Detail Manifest
- **Buyer Order History (`/orders`)**: Dedicated timeline showing past orders, date formatting, delivery status pills, item thumbnails, and price breakdowns.
- **Order Detail View (`/orders/:orderId`)**: Complete audit trail showing item snapshots, variant selections, applied coupon savings, Razorpay IDs, and shipping metadata.
- **Database Model**: `paymentModel` serves as the order record with `{ timestamps: true }` and sub-schemas for order items and applied coupon discounts.

### ✨ Luxury Design & Editorial UI
- **Dynamic Hero Slider**: 65% width luxury campaign banner with auto-slide, pause-on-hover, progress indicators, and Cormorant Garamond typography.
- **3D Depth Carousel**: Featured product drops in "The Edits" section powered by Tailwind CSS.
- **Curated Navigation & Branding**: Custom Luxurisen vector logo, gold accents, lookbook collection grid, orders manifest, and dynamic shopping bag badge count.
- **Editorial Footer & 404 Page**: Complete brand footer (`LuxurisenFooter.jsx`) with interactive newsletter subscription and a styled 404 error page (`NotFound.jsx`) with quick navigation recovery.

### 🛍️ Product Catalog & Seller Tools
- **ImageKit CDN Integration**: Multi-angle image uploads via Multer and cloud storage on ImageKit CDN.
- **Product Variants**: Full support for variant-specific pricing, stock, colors, sizes, and galleries.
- **Interactive Reviews**: Buyer rating and review submission system with real-time score aggregation.

---

## 🛠️ Tech Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 19, Vite 8, Tailwind CSS 4, React Router 7, Redux Toolkit, Axios, GSAP, react-razorpay |
| **Backend** | Node.js, Express 5, Mongoose 9, ioredis, express-rate-limit, rate-limit-redis, Passport.js, JWT, bcryptjs, Multer, ImageKit SDK, Razorpay SDK, Morgan |
| **Databases & Cache** | MongoDB (Atlas / Local), Redis (Upstash / Redis Cloud / Local) |
| **Deployment** | Render (Full-Stack Monolith with SPA fallback) / Vercel |

---

## 📁 Project Architecture

```
luxurisen/
├── backend/
│   ├── server.js               # Entry point with dynamic PORT binding for Render
│   ├── package.json            # Server scripts ("start": "node server.js")
│   ├── public/                 # Production-built static frontend assets & favicon
│   └── src/
│       ├── app.js              # Express app, global rate limiter, CORS, Passport, routes, SPA fallback
│       ├── config/             # Environment variables (config.js), MongoDB (db.js), Redis (redis.js)
│       ├── controllers/        # auth, product, cart, coupon, review
│       ├── dao/                # Data Access Objects (cart, coupon, payment, product, user)
│       ├── middlewares/        # JWT auth guard, seller guard, cacheResponse, rateLimiters
│       ├── models/             # Mongoose schemas (user, product, cart, coupon, payment, review)
│       ├── routes/             # API routes (auth, products, cart, reviews)
│       ├── scripts/            # seedCoupons.js, verify-redis-setup.js
│       ├── services/           # External integrations (ImageKit, Razorpay)
│       └── validator/          # express-validator request schemas
│
└── frontend/
    ├── index.html              # HTML entry with luxury favicon & Google Fonts
    ├── vercel.json             # Vercel SPA rewrite configuration
    ├── public/                 # Static assets, hero images & brand favicon.svg
    └── src/
        ├── app/                # App.jsx, AppLayout, router configuration, Redux store
        └── features/
            ├── auth/           # Login, Register, Protected route component, Google OAuth
            ├── cart/           # Cart page, OrderSuccess, coupon state & API services
            ├── orders/         # OrderList, OrderDetail, orders API & custom hooks
            ├── products/       # Home, ProductDetail, CreateProduct, Seller Dashboard
            └── Shared/         # Nav, LuxurisenFooter, LuxurisenLogo, HeroSlider, DepthCarousel, NotFound
```

---

## 🚀 Setup & Installation

### Prerequisites
- Node.js (v18+)
- MongoDB Atlas or local MongoDB
- Redis (Redis Cloud, Upstash, or local Redis)
- Razorpay account (Test mode key & secret)
- Google Cloud Console OAuth 2.0 credentials
- ImageKit account (Public key, private key, URL endpoint)

### 1. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the `backend/` directory:
```env
PORT=3000
NODE_ENV=development
MONGO_URI=your_mongodb_connection_string
REDIS_URI=your_redis_connection_string
JWT_SECRET=your_jwt_secret_key
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=http://localhost:3000/api/auth/google/callback
IMAGEKIT_PUBLIC_KEY=your_imagekit_public_key
IMAGEKIT_PRIVATE_KEY=your_imagekit_private_key
IMAGEKIT_URL_ENDPOINT=your_imagekit_url_endpoint
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
```

Seed test coupons:
```bash
node src/scripts/seedCoupons.js
```

Verify Redis & rate limiting setup:
```bash
node src/scripts/verify-redis-setup.js
```

Start the backend server:
```bash
npm run dev
```

---

### 2. Frontend Setup

```bash
cd frontend
npm install
```

Create a `.env` file in the `frontend/` directory:
```env
VITE_RAZORPAY_KEY_ID=your_razorpay_key_id
```

Start the Vite development server:
```bash
npm run dev
```
Client runs at **`http://localhost:5173`**.

---

## 🌐 Production Deployment Guide (Render)

The project is structured to deploy smoothly as a single full-stack service on Render:

1. **Build frontend assets**:
   ```bash
   cd frontend
   npm run build
   ```
2. **Sync build into backend**:
   Copy the generated `frontend/dist/` contents into `backend/public/`.
3. **Render Web Service Settings**:
   - **Root Directory**: `backend`
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`
   - **Environment Variables**: Add all variables from `backend/.env` (ensure `GOOGLE_CALLBACK_URL` is set to `https://luxurisen.onrender.com/api/auth/google/callback` and `NODE_ENV=production`).

---

## 📡 API Reference

### Authentication (`/api/auth`)
| Method | Endpoint | Access | Rate Limit | Description |
|---|---|---|---|---|
| `POST` | `/api/auth/register` | Public | 10 req / 15 min | Register new buyer or seller |
| `POST` | `/api/auth/login` | Public | 10 req / 15 min | Login with email and password |
| `GET` | `/api/auth/google` | Public | Global | Initiate Google OAuth 2.0 login |
| `GET` | `/api/auth/google/callback` | Public | Global | OAuth callback handler |
| `GET` | `/api/auth/me` | Private | Global | Retrieve authenticated user profile |

### Products & Catalog (`/api/products`)
| Method | Endpoint | Access | Cache TTL | Description |
|---|---|---|---|---|
| `GET` | `/api/products` | Public | 5 mins (`X-Cache`) | List all active product listings |
| `GET` | `/api/products/detail/:id` | Public | 10 mins (`X-Cache`) | Retrieve single product details |
| `POST` | `/api/products` | Seller | Invalidates Cache | Create new product with ImageKit uploads |
| `GET` | `/api/products/seller` | Seller | None (Private) | Retrieve seller's own listings |
| `POST` | `/api/products/:productId/variants` | Seller | Invalidates Cache | Add variant to an existing product |

### Reviews (`/api/reviews`)
| Method | Endpoint | Access | Cache TTL | Description |
|---|---|---|---|---|
| `GET` | `/api/reviews/:productId` | Public | 5 mins (`X-Cache`) | Get all reviews + stats for product |
| `POST` | `/api/reviews/:productId` | Buyer | Invalidates Cache | Add review for product |
| `PUT` | `/api/reviews/:reviewId` | Buyer | Invalidates Cache | Edit existing review |
| `DELETE` | `/api/reviews/:reviewId` | Buyer | Invalidates Cache | Delete existing review |

### Cart, Coupons & Orders (`/api/cart`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/cart` | Buyer | Fetch active user cart |
| `POST` | `/api/cart/add/:productId` | Buyer | Add product or variant to cart |
| `DELETE` | `/api/cart/remove/:productId` | Buyer | Remove product from cart |
| `POST` | `/api/cart/coupon/validate` | Buyer | Server-side coupon validation & discount calculation |
| `POST` | `/api/cart/payment/create/order` | Buyer | Create Razorpay order with server-discounted total |
| `POST` | `/api/cart/payment/verify/order` | Buyer | Verify payment signature & increment coupon count |
| `GET` | `/api/cart/orders` | Buyer | Fetch user order history |
| `GET` | `/api/cart/orders/:orderId` | Buyer | Fetch single order details |

---

## 📄 License
This project is for educational and portfolio demonstration purposes.
