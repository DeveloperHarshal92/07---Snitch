# Luxurisen — Backend REST API Server (Portfolio Demo)

[![Live Demo](https://img.shields.io/badge/Live_Demo-luxurisen.onrender.com-C9A96E?style=for-the-badge&logo=render&logoColor=white)](https://luxurisen.onrender.com/)
[![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express_5-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Redis](https://img.shields.io/badge/Redis-DC382D?style=for-the-badge&logo=redis&logoColor=white)](https://redis.io/)
[![Mongoose](https://img.shields.io/badge/Mongoose_9-880000?style=for-the-badge&logo=mongoose&logoColor=white)](https://mongoosejs.com/)

RESTful API backend for **Luxurisen**, built with Express 5, Node.js, MongoDB/Mongoose, and Redis. Powers role-based authentication, ImageKit CDN media pipelines, server-authoritative promo codes, distributed Redis response caching & rate limiting, Razorpay order creation & signature verification, and static frontend hosting with SPA wildcard routing.

🔗 **Live Application URL:** [https://luxurisen.onrender.com/](https://luxurisen.onrender.com/)

---

## 🚀 Performance & Scalability (Redis)

- **Distributed Response Caching**:
  - `GET /api/products`: Cached for 5 minutes (`cache:products:all*`).
  - `GET /api/products/detail/:id`: Cached for 10 minutes (`cache:products:detail*`).
  - `GET /api/reviews/:productId`: Cached for 5 minutes (`cache:reviews*`).
  - Response headers include `X-Cache: HIT` / `X-Cache: MISS`.
  - **Automated Cache Invalidation**: Product creation/variant additions automatically invalidate `cache:products:*`, and review actions invalidate `cache:reviews:*`.
- **Distributed Tiered Rate Limiting**:
  - **Global Limiter**: 200 requests / 15 minutes per IP across `/api` routes with `rate-limit-redis`.
  - **Strict Auth Limiter**: 10 requests / 15 minutes per IP on `/api/auth/login` and `/api/auth/register` to prevent brute-force attacks.
- **Graceful Fallback**: If Redis is not configured or temporarily unreachable, caching seamlessly falls through to the database and rate limiting falls back to in-memory mode without server downtime.

---

## 📂 Backend Architecture

```
backend/
├── server.js                   # Server entry point with dynamic process.env.PORT binding
├── package.json                # Dependencies & scripts ("start": "node server.js")
├── public/                     # Built static frontend assets served via Express
└── src/
    ├── app.js                  # Express app, global rate limiter, CORS, routes, SPA fallback
    ├── config/                 # config.js, db.js (MongoDB), redis.js (ioredis client & helpers)
    ├── controllers/
    │   ├── auth.controller.js  # register, login, googleCallback, getMe
    │   ├── cart.controller.js  # cart CRUD, Razorpay order creation & verification, orders
    │   ├── coupon.controller.js# validateCouponController
    │   ├── product.controller.js# product CRUD, image upload, variants, cache invalidation
    │   └── review.controller.js# review CRUD & cache invalidation
    ├── dao/                    # Data Access Objects (cart, coupon, payment, product, user)
    ├── middlewares/            # auth.middleware.js, cache.middleware.js, rateLimiter.middleware.js
    ├── models/
    │   ├── cart.model.js       # Cart schema with aggregation pipeline support
    │   ├── coupon.model.js     # Coupon schema (percentage/fixed, caps, min cart, limits)
    │   ├── payment.model.js    # Order record with timestamps & coupon sub-document
    │   ├── price.schema.js     # Reusable price sub-schema
    │   ├── product.model.js    # Product & variant schemas
    │   ├── review.model.js     # Review schema
    │   └── user.model.js       # User schema with bcrypt password hashing
    ├── routes/                 # Express route modules (auth, cart, product, review)
    ├── scripts/
    │   ├── seedCoupons.js      # Seed sample test promo codes into MongoDB
    │   └── verify-redis-setup.js # Automated verification for Redis cache & rate limiting
    ├── services/               # storage.service.js, payment.service.js
    └── validator/              # express-validator schemas for auth, cart, products, reviews
```

---

## 🏷️ Coupon Engine Business Rules

Implemented in `coupon.dao.js`:
- **Percentage Discounts**: Computes percentage off with optional maximum discount cap (`maxDiscountAmount`).
- **Fixed Discounts**: Applies flat price reduction capped at cart total.
- **Constraints**: Enforces active status, expiration date check, minimum cart value threshold (`minCartValue`), and usage limits (`usageLimit`).
- **Atomic Increment**: `usedCount` increments atomically via `$inc` only when Razorpay payment signature verification succeeds.

---

## 🛠️ Scripts

| Command | Description |
|---|---|
| `npm run start` | Starts production server using `node server.js` |
| `npm run dev` | Starts development server with Nodemon hot-reloading |
| `node src/scripts/seedCoupons.js` | Seeds MongoDB with test coupons (`LUX10`, `LUX80`, `FLAT500`, `EXPIRED10`, etc.) |
| `node src/scripts/verify-redis-setup.js` | Runs automated test suite for Redis connection, caching hits/misses, and rate limiting |

---

## ⚙️ Environment Variables

Create `.env` in `backend/`:

```env
PORT=3000
NODE_ENV=development
MONGO_URI=mongodb://localhost:27017/luxurisen
REDIS_URI=redis://default:password@host:port
JWT_SECRET=your_jwt_secret_key
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=http://localhost:3000/api/auth/google/callback
IMAGEKIT_PUBLIC_KEY=your_imagekit_public_key
IMAGEKIT_PRIVATE_KEY=your_imagekit_private_key
IMAGEKIT_URL_ENDPOINT=https://ik.imagekit.io/your_id
RAZORPAY_KEY_ID=rzp_test_your_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
```
