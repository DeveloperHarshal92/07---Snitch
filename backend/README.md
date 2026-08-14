# Snitch — Backend REST API Server

[![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express_5-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Mongoose](https://img.shields.io/badge/Mongoose_9-880000?style=for-the-badge&logo=mongoose&logoColor=white)](https://mongoosejs.com/)

RESTful API backend for **Snitch**, built with Express 5, Node.js, and MongoDB/Mongoose. Powers role-based authentication, ImageKit CDN media pipelines, server-authoritative promo codes, Razorpay order creation & signature verification, and static frontend hosting with SPA wildcard routing.

---

## 📂 Backend Architecture

```
backend/
├── server.js                   # Server entry point with dynamic process.env.PORT binding
├── package.json                # Dependencies & scripts ("start": "node server.js")
├── public/                     # Built static frontend assets served via Express
└── src/
    ├── app.js                  # Express app, middleware, CORS, routes, SPA fallback
    ├── config/                 # config.js (env validation) & db.js (Mongoose connection)
    ├── controllers/
    │   ├── auth.controller.js  # register, login, googleCallback, getMe
    │   ├── cart.controller.js  # cart CRUD, Razorpay order creation & verification, orders
    │   ├── coupon.controller.js# validateCouponController
    │   ├── product.controller.js# product CRUD, image upload, variants
    │   └── review.controller.js# product review creation
    ├── dao/                    # Data Access Objects (cart, coupon, payment, product, user)
    ├── middlewares/            # auth.middleware.js, seller guard
    ├── models/
    │   ├── cart.model.js       # Cart schema with aggregation pipeline support
    │   ├── coupon.model.js     # Coupon schema (percentage/fixed, caps, min cart, limits)
    │   ├── payment.model.js    # Order record with timestamps & coupon sub-document
    │   ├── price.schema.js     # Reusable price sub-schema
    │   ├── product.model.js    # Product & variant schemas
    │   ├── review.model.js     # Review schema
    │   └── user.model.js       # User schema with bcrypt password hashing
    ├── routes/                 # Express route modules
    ├── scripts/
    │   └── seedCoupons.js      # Seed sample test promo codes into MongoDB
    ├── services/               # imagekit.service.js, payment.service.js
    └── validator/              # express-validator schemas for auth, cart, products
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
| `node src/scripts/seedCoupons.js` | Seeds MongoDB with test coupons (`SNITCH10`, `SNITCH80`, `FLAT500`, `EXPIRED10`, `MINVALUE999`, `LIMIT1`) |

---

## ⚙️ Environment Variables

Create `.env` in `backend/`:

```env
PORT=3000
NODE_ENV=development
MONGO_URI=mongodb://localhost:27017/snitch
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
