# Snitch

A full-stack e-commerce marketplace where **sellers** can list products (with image uploads and variants) and **buyers** can browse, add to cart, and pay via Razorpay. Supports both email/password and Google OAuth login.

---

## Features

- **Dual-role auth** — users register as `buyer` or `seller`; role-based route protection enforced on both frontend and backend
- **Google OAuth 2.0** — sign in via Google (Passport.js strategy, stateless JWT)
- **JWT authentication** — tokens stored in HTTP-only cookies; middleware validates on every protected route
- **Product listings** — sellers create products with title, description, price, stock, and up to 7 images per product
- **Product variants** — sellers can add variants (e.g., size/colour) with their own images, stock, and price
- **Image uploads** — images uploaded via Multer and stored on ImageKit CDN
- **Shopping cart** — buyers add/remove items and increment/decrement quantities; supports base products and variants
- **Checkout & payments** — Razorpay order creation and server-side signature verification
- **Product reviews** — buyers can leave reviews on products
- **Seller dashboard** — sellers view and manage their own product listings
- **Request validation** — all inputs validated with `express-validator` before hitting controllers

---

## Tech Stack

| Layer | Technology | Version |
|---|---|---|
| Frontend framework | React | ^19.2.4 |
| Build tool | Vite | ^8.0.4 |
| Styling | Tailwind CSS | ^4.2.2 |
| State management | Redux Toolkit + React-Redux | ^2.11.2 / ^9.2.0 |
| Routing | React Router DOM | ^7.14.0 |
| HTTP client | Axios | ^1.15.0 |
| Payments (client) | react-razorpay | ^3.0.1 |
| Backend framework | Express | ^5.2.1 |
| Database | MongoDB via Mongoose | ^9.4.1 |
| Authentication | Passport + passport-google-oauth20 | ^0.7.0 / ^2.0.0 |
| Password hashing | bcryptjs | ^3.0.3 |
| Tokens | jsonwebtoken | ^9.0.3 |
| File uploads | Multer + @imagekit/nodejs | ^2.1.1 / ^7.5.0 |
| Payments (server) | Razorpay | ^2.9.6 |
| Logging | Morgan | ^1.10.1 |

---

## Project Structure

```
07 - Snitch/
├── backend/
│   ├── server.js          # Entry point — connects DB, starts Express on port 3000
│   └── src/
│       ├── app.js         # Express app, CORS, Passport config, route mounting
│       ├── config/        # DB connection, env config
│       ├── controllers/   # auth, product, cart, review
│       ├── dao/           # Data-access layer
│       ├── middlewares/   # JWT auth, seller-only guard
│       ├── models/        # Mongoose schemas: user, product, cart, review, payment
│       ├── routes/        # auth, product, cart, review route files
│       ├── services/      # Business logic (ImageKit, Razorpay, etc.)
│       └── validator/     # express-validator rule sets
└── frontend/
    ├── index.html
    └── src/
        ├── app/           # App.jsx, AppLayout, router config, Redux store
        └── features/
            ├── auth/      # Login, Register pages + Protected route component
            ├── products/  # Home, ProductDetail, CreateProduct, Dashboard, SellerProductDetails
            └── cart/      # Cart page, OrderSuccess page
```

---

## Setup & Installation

### Prerequisites

- Node.js (v18+)
- A running MongoDB instance or Atlas cluster
- Razorpay test account
- Google Cloud OAuth 2.0 credentials
- ImageKit account

### 1. Backend

```bash
cd backend
npm install
```

Copy the env template and fill in your values (see [Environment Variables](#environment-variables)):

```bash
# create backend/.env with the variables listed below
npm run dev        # uses nodemon — hot-reloads on change
```

The API server starts at **http://localhost:3000**.

### 2. Frontend

```bash
cd frontend
npm install
```

```bash
# create frontend/.env with VITE_RAZORPAY_KEY_ID
npm run dev        # Vite dev server with HMR
```

The frontend starts at **http://localhost:5173**.

---

## Usage

| Role | Flow |
|---|---|
| Buyer | Register → Browse `/` → View product → Add to cart → Checkout with Razorpay |
| Seller | Register (role=seller) → `/seller/create-product` → manage via `/seller/dashboard` |

Both roles can sign in via `/login` or Google OAuth (`GET /api/auth/google`).

---

## Environment Variables

### `backend/.env`

| Variable | Description |
|---|---|
| `MONGO_URI` | MongoDB connection string |
| `JWT_SECRET` | Secret used to sign/verify JWTs |
| `GOOGLE_CLIENT_ID` | Google OAuth 2.0 Client ID |
| `GOOGLE_CLIENT_SECRET` | Google OAuth 2.0 Client Secret |
| `GOOGLE_CALLBACK_URL` | OAuth redirect URI (e.g. `http://localhost:5173/api/auth/google/callback`) |
| `NODE_ENV` | `development` or `production` |
| `IMAGEKIT_PRIVATE_KEY` | ImageKit private API key |
| `IMAGEKIT_PUBLIC_KEY` | ImageKit public API key |
| `IMAGEKIT_URL_ENDPOINT` | ImageKit CDN endpoint URL |
| `RAZORPAY_KEY_ID` | Razorpay API key ID |
| `RAZORPAY_KEY_SECRET` | Razorpay API key secret |

### `frontend/.env`

| Variable | Description |
|---|---|
| `VITE_RAZORPAY_KEY_ID` | Razorpay key ID exposed to the browser (use test key for dev) |

---

## Testing

> No test suite is currently configured. The backend `package.json` includes a placeholder `test` script that exits with an error.
>
> **TODO**: Add unit/integration tests for controllers and validators.

---

## API Routes (summary)

| Method | Path | Access |
|---|---|---|
| POST | `/api/auth/register` | Public |
| POST | `/api/auth/login` | Public |
| GET | `/api/auth/google` | Public |
| GET | `/api/auth/me` | Private |
| GET | `/api/products` | Public |
| GET | `/api/products/detail/:id` | Public |
| POST | `/api/products` | Seller only |
| GET | `/api/products/seller` | Seller only |
| POST | `/api/products/:productId/variants` | Seller only |
| GET | `/api/cart` | Buyer |
| POST | `/api/cart/add/:productId` | Buyer |
| DELETE | `/api/cart/remove/:productId` | Buyer |
| POST | `/api/cart/payment/create/order` | Buyer |
| POST | `/api/cart/payment/verify/order` | Buyer |
| POST | `/api/reviews` | Buyer |
