# Snitch — Luxury E-Commerce Platform

A full-stack modern MERN e-commerce application inspired by luxury fashion aesthetics. **Sellers** can list curated products, upload multi-angle assets to ImageKit, and manage inventory/variants. **Buyers** authenticate, browse editorial collections, apply verified promotional coupons, checkout via Razorpay, and track past orders.

---

## 🌟 Key Features

### 🔐 Authentication & Access Control
- **Dual-Role Architecture** — Users register as `buyer` or `seller` with role-based route guards (`Protected.jsx`) on both frontend and backend.
- **Root Route Protection** — Unauthenticated visitors opening `localhost:5173` are immediately routed to `/login`, returning to the storefront or seller dashboard upon successful sign-in.
- **Google OAuth 2.0 & JWT** — Stateless JWT authentication stored in HTTP-only cookies alongside Google OAuth (Passport.js).

### 🏷️ Server-Authoritative Promo Code & Coupon Engine
- **Server-Side Validation** — Coupon discounts are calculated strictly on the backend (`couponModel` & `coupon.dao.js`), eliminating client-side tampering.
- **Rich Business Rules** — Supports percentage discounts with max caps, fixed amounts, expiration dates, minimum cart value thresholds, and usage limits.
- **Secure Razorpay Integration** — Razorpay orders and payment database records reflect server-verified discounted amounts; coupon usage counters increment atomically only upon confirmed payment verification.

### 📦 Order History & Detail Tracking
- **Order Manifest** — Dedicated buyer order history page (`/orders`) and comprehensive detail view (`/orders/:orderId`).
- **Complete Audit Trail** — Tracks item snapshots, variant selections, coupon savings, payment IDs, delivery addresses, and real-time order statuses.

### ✨ Luxury Design & Editorial UI
- **Dynamic Hero Slider** — Auto-sliding high-resolution campaign banner with smooth transitions, progress indicators, and interactive pause-on-hover controls.
- **3D Depth Carousel** — Custom visual component styled with Tailwind CSS for featured product drops in "The Edits" section.
- **Curated Navigation & Footer** — Navbar with matching lookbook collection, order manifest, and dynamic shopping bag badge; editorial footer with newsletter subscription and brand links.
- **Custom 404 Experience** — Styled error screen with quick navigation recovery.

### 🛍️ Product & Catalog Management
- **ImageKit CDN Integration** — High-speed asset processing and multi-image uploads via Multer.
- **Product Variants** — Flexible variant architecture supporting unique prices, SKUs, colors, sizes, and variant-specific galleries.
- **Interactive Reviews** — Buyer product rating and review submission system.

---

## 🛠️ Tech Stack

| Layer | Technology | Description |
|---|---|---|
| **Frontend** | React 19, Vite 8, Tailwind CSS 4 | Fast, modern client framework and styling |
| **State Management** | Redux Toolkit, React-Redux | Global store for auth, cart, and catalog state |
| **Routing** | React Router 7 | Client-side routing with role-based protection |
| **Payments (Client)** | react-razorpay | Razorpay checkout integration |
| **Backend** | Node.js, Express 5 | High-performance RESTful API server |
| **Database** | MongoDB, Mongoose 9 | Object data modeling for users, products, carts, coupons, and orders |
| **Authentication** | Passport.js, JWT, bcryptjs | Secure password hashing, OAuth 2.0, and token verification |
| **File Storage** | Multer, ImageKit Node SDK | Cloud image upload and CDN delivery |
| **Payments (Server)** | Razorpay SDK | Server-side order creation and cryptographic signature verification |

---

## 📁 Repository Structure

```
07 - Snitch/
├── backend/
│   ├── server.js               # Server entry point — DB connection & Express listener
│   └── src/
│       ├── app.js              # Express app configuration, CORS, cookies, routes
│       ├── config/             # Environment variables & MongoDB connection
│       ├── controllers/        # auth, product, cart, coupon, review controllers
│       ├── dao/                # Data Access Objects (cart, coupon, payment, product, user)
│       ├── middlewares/        # JWT auth guard, seller guard
│       ├── models/             # Mongoose schemas (user, product, cart, coupon, payment, review)
│       ├── routes/             # API routes (auth, products, cart, reviews)
│       ├── scripts/            # Database seeding scripts (seedCoupons.js)
│       ├── services/           # External services (ImageKit, Razorpay)
│       └── validator/          # express-validator request validation schemas
└── frontend/
    ├── index.html
    ├── public/                 # Static campaign imagery & local assets
    └── src/
        ├── app/                # App entry, AppLayout, router definition, Redux store
        └── features/
            ├── auth/           # Login, Register, Protected route component
            ├── cart/           # Cart page, OrderSuccess, coupon state & API services
            ├── orders/         # OrderList, OrderDetail, orders API & custom hooks
            ├── products/       # Home, ProductDetail, CreateProduct, Seller Dashboard
            └── Shared/         # Nav, SnitchFooter, HeroSlider, DepthCarousel, NotFound
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- MongoDB Atlas or local MongoDB
- Razorpay account (Test mode key & secret)
- Google Cloud Console OAuth credentials
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
MONGO_URI=mongodb://localhost:27017/snitch
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

Start the backend server:
```bash
npm run dev
```
Backend API will run at **`http://localhost:3000`**.

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
Frontend will run at **`http://localhost:5173`**.

---

## 📡 API Reference Overview

### Authentication (`/api/auth`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/api/auth/register` | Public | Register new buyer or seller |
| `POST` | `/api/auth/login` | Public | Login with email and password |
| `GET` | `/api/auth/google` | Public | Initiate Google OAuth 2.0 login |
| `GET` | `/api/auth/me` | Private | Retrieve authenticated user profile |

### Products & Catalog (`/api/products`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/products` | Public | List all active product listings |
| `GET` | `/api/products/detail/:id` | Public | Retrieve single product details |
| `POST` | `/api/products` | Seller | Create new product with ImageKit uploads |
| `GET` | `/api/products/seller` | Seller | Retrieve seller's own listings |
| `POST` | `/api/products/:productId/variants` | Seller | Add variant to an existing product |

### Cart & Checkout (`/api/cart`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/cart` | Buyer | Fetch active user cart |
| `POST` | `/api/cart/add/:productId` | Buyer | Add product or variant to cart |
| `DELETE` | `/api/cart/remove/:productId` | Buyer | Remove product from cart |
| `POST` | `/api/cart/coupon/validate` | Buyer | Validate coupon against current cart total |
| `POST` | `/api/cart/payment/create/order` | Buyer | Create Razorpay order with server discount |
| `POST` | `/api/cart/payment/verify/order` | Buyer | Verify Razorpay payment signature & confirm |
| `GET` | `/api/cart/orders` | Buyer | Fetch user order history |
| `GET` | `/api/cart/orders/:orderId` | Buyer | Fetch single order details |
