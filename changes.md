# Project Refactoring & Compliance Report

**Project Title:** Luxurisen — Curated Luxury Fashion (Portfolio Demo)  
**Date:** August 15, 2026  
**Objective:** Refactor the MERN stack codebase from "Snitch" to "Luxurisen" to comply with hosting Acceptable Use Policies (prevent automated anti-phishing / brand impersonation flags), convert forced root-route authentication to a public storefront, and introduce prominent educational sandbox disclaimers.

---

## 1. 🏷️ Rebranding Modifications

All references to the previous trademarked brand name, hardcoded promotional codes, and domain links were systematically replaced across frontend components, backend services, assets, and documentation.

### Exact Files Modified & Changes Applied:

#### A. Brand Identity & Logo Assets
- **`frontend/public/luxurisen-logo.svg` [NEW]** & **`backend/public/luxurisen-logo.svg` [NEW]**:
  - Vector SVG emblem featuring the winged silhouette and modern lettermark in gold (`#C9A96E`).
- **`frontend/src/features/Shared/components/LuxurisenLogo.jsx` [NEW]**:
  - Reusable React logo component providing vector glyph rendering, customizable sizes, and brand styling.
- **`frontend/public/luxurisen_editorial.png` & `frontend/public/luxurisen_editorial_warm.png` [RENAMED]**:
  - Renamed from `snitch_editorial*.png` to eliminate trademarked file path strings.
- **`frontend/index.html` & `backend/public/index.html`**:
  - Updated `<title>` to `"Luxurisen — Curated Luxury Fashion (Portfolio Demo)"`.
  - Updated `<meta name="description">` to `"Luxurisen — Curated luxury fashion, menswear, tailored silhouettes, and editorial apparel collections (Portfolio Demo)."`.
  - Updated `<link rel="icon">` to point to `/luxurisen-logo.svg`.

#### B. Frontend UI & Component Branding
- **`frontend/src/features/Shared/components/Nav.jsx`**:
  - Replaced plain text brand header with `<LuxurisenLogo />`.
  - Added conditional authentication display (renders "Sign In" button when unauthenticated; maintains cart counter and navigation links).
- **`frontend/src/features/Shared/components/LuxurisenFooter.jsx` [NEW]** & **`frontend/src/features/Shared/components/SnitchFooter.jsx`**:
  - Created editorial footer with brand text `"About Luxurisen"` and copyright notice `"© {year} Luxurisen — All rights reserved"`.
  - Forwarded legacy `SnitchFooter.jsx` import to `LuxurisenFooter` for full backwards compatibility.
- **`frontend/src/features/Shared/components/Marquee.jsx`**:
  - Replaced text banner with `"Luxurisen — Refined Luxury Tailoring"`.
- **`frontend/src/features/Shared/components/DepthCarousel.jsx`**:
  - Updated accessibility `aria-label` from `"Snitch product carousel"` to `"Luxurisen product carousel"`.
- **`frontend/src/features/products/pages/Home.jsx`**:
  - Replaced footer import and usage with `<LuxurisenFooter />`.
- **`frontend/src/features/products/pages/ProductDetail.jsx`**:
  - Replaced footer brand mark and copyright notice with `"Luxurisen"` and `"© {year} Luxurisen — All rights reserved"`.
- **`frontend/src/features/products/pages/SellerProductDetails.jsx`**:
  - Updated navbar brand text from `"Snitch"` to `"Luxurisen"`.
- **`frontend/src/features/products/pages/Dashboard.jsx`**:
  - Updated seller dashboard header brand mark to `"Luxurisen"`.
- **`frontend/src/features/products/pages/CreateProduct.jsx`**:
  - Updated header brand mark to `"Luxurisen."`.
- **`frontend/src/features/orders/pages/OrderList.jsx`**:
  - Replaced footer import and usage with `<LuxurisenFooter />`.
- **`frontend/src/features/orders/pages/OrderDetail.jsx`**:
  - Updated order verification notice to `"archived in your Luxurisen client profile"`.
  - Replaced footer component with `<LuxurisenFooter />`.
- **`frontend/src/features/cart/pages/OrderSuccess.jsx`**:
  - Updated confirmation message to `"Thank you for shopping with Luxurisen."`.
  - Updated footer brand mark to `"Luxurisen"`.
- **`frontend/src/features/auth/pages/Login.jsx`**:
  - Replaced editorial image source with `/luxurisen_editorial_warm.png`.
  - Updated brand headers to `"Sign in to Luxurisen"` and `"Luxurisen."`.
- **`frontend/src/features/auth/pages/Register.jsx`**:
  - Replaced editorial image source with `/luxurisen_editorial_warm.png`.
  - Updated brand headers to `"Welcome to Luxurisen"` and `"Luxurisen."`.
- **`frontend/src/features/Shared/pages/NotFound.jsx`**:
  - Replaced footer import and usage with `<LuxurisenFooter />`.

#### C. Promo Codes & Payment Configuration
- **`frontend/src/features/cart/pages/Cart.jsx`**:
  - Updated Razorpay transaction modal store title: `name: "LUXURISEN"`.
  - Updated coupon input placeholder: `placeholder="Enter code (e.g., LUX10)"`.
  - Updated footer copyright to `"© {year} Luxurisen — All rights reserved"`.
- **`backend/src/scripts/seedCoupons.js`**:
  - Rebranded test coupon codes in MongoDB seeder from `SNITCH10` / `SNITCH80` to `LUX10` / `LUX80`.

#### D. Backend Services & Documentation
- **`backend/src/services/storage.service.js`**:
  - Changed default ImageKit cloud upload folder to `folder = "Luxurisen"`.
- **`backend/src/routes/auth.routes.js` & `backend/src/controllers/auth.controller.js`**:
  - Removed hardcoded legacy domain URL fallbacks (`https://snitch-w2cn.onrender.com/`), replacing with standard dynamic `process.env.CLIENT_URL || "/"` fallbacks.
- **`README.md`**, **`frontend/README.md`**, **`backend/README.md`**:
  - Updated all project documentation, architecture diagrams, coupon references, and titles to `"Luxurisen — Curated Luxury Fashion (Portfolio Demo)"`.

---

## 2. 🚦 Routing & Storefront Access Modifications

Previously, unauthenticated visitors attempting to view the root route (`/`) were immediately intercepted by `<Protected role="buyer">` and redirected to `/login`. Automated hosting scanners flag forced authentication on root routes coupled with checkout flows as potential credential harvesting/phishing.

### Exact Files Modified & Changes Applied:

- **`frontend/src/app/app.routes.jsx`**:
  - **Before:**
    ```jsx
    {
      path: "/",
      element: (
        <Protected role="buyer">
          <Home />
        </Protected>
      ),
    },
    {
      path: "/product/:productId",
      element: (
        <Protected role="buyer">
          <ProductDetail />
        </Protected>
      ),
    },
    ```
  - **After:**
    ```jsx
    {
      path: "/",
      element: <Home />,
    },
    {
      path: "/product/:productId",
      element: <ProductDetail />,
    },
    ```
  - **Outcome:** The landing page (`/`) and catalog item view (`/product/:productId`) are now completely public for guest visitors to inspect the e-commerce portfolio without prior authentication.
  - **Protected Boundary:** Sensitive user actions remain guarded behind `<Protected role="buyer">` or `<Protected role="seller">`:
    - `/cart` (Shopping bag)
    - `/orders` & `/orders/:orderId` (Order manifest)
    - `/orders-success` (Post-checkout verification)
    - `/seller/dashboard` & `/seller/create-product` (Seller admin portal)

---

## 3. 🛡️ Educational Sandbox & Test Mode Disclaimers

To explicitly communicate that the application is a non-commercial educational portfolio project, visible disclaimer UI components were added to the application header and checkout modal.

### Exact Files Modified & UI Placements:

#### A. Global Dismissible Demo Banner
- **`frontend/src/app/AppLayout.jsx`**:
  - Added a prominent, styled notification bar at the very top of all application views:
    ```jsx
    <aside
      role="region"
      aria-label="Portfolio Demo Notice"
      className="w-full bg-[#1b1917] text-[#fbf9f6] px-4 py-2 text-xs flex items-center justify-between border-b border-[#332e2a] select-none"
    >
      <div className="flex-1 flex items-center justify-center gap-2 text-center">
        <span className="inline-block px-1.5 py-0.5 rounded text-[0.62rem] font-semibold tracking-wider uppercase bg-[#C9A96E] text-[#0d0d0b]">
          Demo
        </span>
        <span className="text-[0.7rem] md:text-xs font-normal tracking-wide text-[#e7e5e4]">
          Student Portfolio Demo — Not a Real Store. No real transactions are processed.
        </span>
      </div>
      <button
        onClick={() => setShowBanner(false)}
        aria-label="Dismiss banner"
        className="text-[#a8a29e] hover:text-[#fbf9f6] p-1 cursor-pointer transition-colors"
      >
        {/* Close Icon */}
      </button>
    </aside>
    ```

#### B. Payment Test-Mode Warning Notice
- **`frontend/src/features/cart/pages/Cart.jsx`**:
  - Added an alert callout directly adjacent to the `"Proceed to Checkout"` button:
    ```jsx
    <div
      style={{
        marginTop: "10px",
        padding: "8px 12px",
        backgroundColor: "#fef3c7",
        border: "1px solid #fde68a",
        borderRadius: "2px",
        display: "flex",
        alignItems: "center",
        gap: "8px",
      }}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 20 20"
        fill="#b45309"
        style={{ width: 15, height: 15, flexShrink: 0 }}
      >
        <path
          fillRule="evenodd"
          d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z"
          clipRule="evenodd"
        />
      </svg>
      <span
        style={{
          fontSize: "0.65rem",
          color: "#92400e",
          fontFamily: "'Inter', sans-serif",
          fontWeight: 500,
          lineHeight: 1.3,
        }}
      >
        Test Mode Only. Do not enter real payment details.
      </span>
    </div>
    ```

---

## 4. ⚙️ Build Verification & Deployment Status

- **Frontend Compilation:**  
  Executed `npm run build` in `/frontend`:
  - **Tooling:** Vite 8.0.8 & Rollup
  - **Status:** **Success (Exit Code 0)**
  - **Bundle Output:**
    - `dist/index.html` (1.07 kB)
    - `dist/assets/index-D0u4b_ui.css` (41.96 kB)
    - `dist/assets/index-Z_ZKxQqd.js` (542.29 kB)
- **Static Asset Synchronization:**  
  The built assets in `frontend/dist/` were synced directly into `backend/public/` to ensure the Node/Express monolith serves the updated bundle under SPA wildcard fallback routing.
- **Git Commit:**  
  All changes staged and committed under message:  
  `"chore: rebrand to generic portfolio and remove forced root login to comply with hosting policies"`.
