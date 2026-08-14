# Snitch — Frontend Client

The frontend client for **Snitch**, built with React 19, Vite, Tailwind CSS 4, and Redux Toolkit. Designed with a luxury editorial aesthetic featuring Cormorant Garamond typography, refined warm beige/charcoal/gold palettes, micro-interactions, responsive carousel components, and full role-based route protection.

---

## 🎨 Design Philosophy & Theme

- **Primary Colors**: Charcoal (`#0d0d0b`, `#1a1410`), Warm Beige / Sand Canvas (`#fbf9f6`, `#f5f3f0`), Muted Taupe (`#6b6158`, `#7a6e65`), Gold Accents (`#C9A96E`).
- **Typography**:
  - Headings & Editorial Titles: `Cormorant Garamond, serif`
  - Body, Buttons, & Data: `Inter, sans-serif`
- **Responsive Layouts**: Desktop-first luxury aesthetic with full mobile/tablet responsiveness.

---

## 📂 Feature Architecture

```
src/
├── app/
│   ├── App.jsx                 # App root — handles initial auth dispatch (/api/auth/me)
│   ├── AppLayout.jsx           # Main layout containing Nav and SnitchFooter
│   ├── app.routes.jsx          # React Router definition with role-based Protected wrappers
│   └── store.js                # Redux Toolkit global store configuration
│
└── features/
    ├── auth/                   # Authentication Feature
    │   ├── components/         # Protected.jsx (Route Guard), ContinueWithGoogle.jsx
    │   ├── hooks/              # useAuth.js
    │   ├── pages/              # Login.jsx, Register.jsx
    │   ├── services/           # auth.api.js (Axios client)
    │   └── state/              # auth.slice.js
    │
    ├── cart/                   # Shopping Cart & Checkout Feature
    │   ├── hooks/              # useCart.js (add, remove, increment, validateCoupon, checkout)
    │   ├── pages/              # Cart.jsx (OrderSummary + Promo Code UI), OrderSuccess.jsx
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
        ├── components/         # Nav.jsx, SnitchFooter.jsx, HeroSlider.jsx, DepthCarousel.jsx
        └── pages/              # NotFound.jsx (Custom 404 screen)
```

---

## 🔒 Route Protection Flow

1. When a user visits the root `http://localhost:5173/`, `<Protected role="buyer">` checks authentication state.
2. If unauthenticated, the user is redirected immediately to `/login`.
3. If already logged in, visiting `/login` or `/register` automatically redirects to the storefront (`/`) or seller dashboard (`/seller/dashboard`).
4. Buyer-specific routes (`/cart`, `/orders`, `/orders/:orderId`, `/product/:productId`) and seller-specific routes (`/seller/dashboard`, `/seller/create-product`) are strictly protected.

---

## 🛠️ Scripts

| Command | Description |
|---|---|
| `npm run dev` | Starts Vite dev server with Hot Module Replacement at `http://localhost:5173` |
| `npm run build` | Compiles production assets into `dist/` |
| `npm run preview` | Locally previews production build |
| `npm run lint` | Runs ESLint to check for code quality and syntax issues |

---

## ⚙️ Environment Variables

Create `.env` in the `frontend/` directory:

```env
VITE_RAZORPAY_KEY_ID=rzp_test_your_razorpay_key_id
```
