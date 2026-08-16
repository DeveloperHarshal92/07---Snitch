# Luxurisen — Frontend Client Application (Portfolio Demo)

[![Live Demo](https://img.shields.io/badge/Live_Demo-luxurisen.onrender.com-C9A96E?style=for-the-badge&logo=render&logoColor=white)](https://luxurisen.onrender.com/)
[![React](https://img.shields.io/badge/React_19-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite_8-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS_4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Redux Toolkit](https://img.shields.io/badge/Redux_Toolkit-764ABC?style=for-the-badge&logo=redux&logoColor=white)](https://redux-toolkit.js.org/)

The frontend client for **Luxurisen**, built with React 19, Vite, Tailwind CSS 4, and Redux Toolkit. Engineered around a luxury editorial aesthetic featuring Cormorant Garamond typography, refined warm beige/charcoal/gold palettes, micro-interactions, responsive carousel components, server-authoritative promo codes, and role-based route protection.

🔗 **Live Application URL:** [https://luxurisen.onrender.com/](https://luxurisen.onrender.com/)

---

## 🎨 Design System & Theme Tokens

- **Palette**:
  - Primary Dark: `#0d0d0b`, `#1a1410`
  - Canvas / Background: `#fbf9f6`, `#f5f3f0`
  - Accent Gold: `#C9A96E`, `#DFBA73`
  - Muted Text / Borders: `#6b6158`, `#7a6e65`, `#e4e2df`, `#d0c5b5`
- **Typography**:
  - Headings & Editorial Titles: `Cormorant Garamond, serif`
  - Body, Buttons, & Numerical Data: `Inter, sans-serif`
- **Components**:
  - Luxury Brand Vector Logo (`LuxurisenLogo.jsx` and `public/luxurisen-logo.svg`).
  - Interactive auto-sliding Hero Slider (65% viewport width) with pause-on-hover.
  - 3D Depth Carousel for featured collection edits.
  - Navbar with matching lookbook grid icon, orders manifest, and dynamic shopping bag badge.
  - Editorial LuxurisenFooter with newsletter subscription.
  - Custom 404 Not Found recovery view.

---

## 📂 Feature Architecture

```
frontend/src/
├── app/
│   ├── App.jsx                 # App root — handles initial auth dispatch (/api/auth/me)
│   ├── AppLayout.jsx           # Main layout containing dismissible demo banner and Nav
│   ├── app.routes.jsx          # React Router definition with public storefront & protected routes
│   └── store.js                # Redux Toolkit global store configuration
│
└── features/
    ├── auth/                   # Authentication Feature
    │   ├── components/         # Protected.jsx (Route Guard), ContinueWithGoogle.jsx
    │   ├── hooks/              # useAuth.js
    │   ├── pages/              # Login.jsx, Register.jsx
    │   ├── services/           # auth.api.js (Axios instance with withCredentials)
    │   └── state/              # auth.slice.js
    │
    ├── cart/                   # Shopping Cart & Checkout Feature
    │   ├── hooks/              # useCart.js (add, remove, increment, validateCoupon, checkout)
    │   ├── pages/              # Cart.jsx (OrderSummary + Promo Code UI + Test Warning), OrderSuccess.jsx
    │   ├── services/           # cart.api.js
    │   └── state/              # cart.slice.js
    │
    ├── orders/                 # Order History Feature
    │   ├── hooks/              # useOrders.js
    │   ├── pages/              # OrderList.jsx, OrderDetail.jsx
    │   └── services/           # orders.api.js
    │
    ├── products/               # Product Catalog & Seller Dashboard
    │   ├── hooks/              # useProducts.js
    │   ├── pages/              # Home.jsx, ProductDetail.jsx, CreateProduct.jsx, Dashboard.jsx
    │   └── services/           # products.api.js
    │
    └── Shared/                 # Shared Reusable UI Components
        ├── components/         # Nav.jsx, LuxurisenLogo.jsx, LuxurisenFooter.jsx, HeroSlider.jsx, DepthCarousel.jsx
        └── pages/              # NotFound.jsx (Custom 404 screen)
```

---

## 🔒 Route Protection Architecture

- **Public Storefront (`/` & `/product/:productId`)**: Accessible by all unauthenticated visitors for browsing.
- **Post-Login Routing**:
  - `buyer` role redirects to `/`
  - `seller` role redirects to `/seller/dashboard`
- **Reverse Auth Protection**: Authenticated users visiting `/login` or `/register` are automatically forwarded to their respective home/dashboard.
- **Buyer & Seller Protected Routes**:
  - Buyer-only: `/cart`, `/orders`, `/orders/:orderId`, `/orders-success`
  - Seller-only: `/seller/dashboard`, `/seller/create-product`, `/seller/product/:productId`

---

## 🛠️ Scripts & Tooling

| Command | Description |
|---|---|
| `npm run dev` | Launches the Vite dev server with Hot Module Replacement at `http://localhost:5173` |
| `npm run build` | Bundles and optimizes production assets into the `dist/` directory |
| `npm run preview` | Locally serves and previews the production build |
| `npm run lint` | Analyzes code quality using ESLint |

---

## ⚙️ Environment Configuration

Create a `.env` file in the `frontend/` directory:

```env
VITE_RAZORPAY_KEY_ID=rzp_test_your_razorpay_key_id
```

For Vercel deployment, [`vercel.json`](file:///c:/Users/HARSHAL/OneDrive/College%20Work/Desktop/Cohert%202.0/07-Full%20Stack%20Projects/07%20-%20Snitch/frontend/vercel.json) is provided with SPA rewrite rules to ensure seamless routing on page refreshes.
