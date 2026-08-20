# Luxurisen — System Architecture & Functional Workflows

This document provides complete, end-to-end architectural blueprints and functional workflows for all modules in **Luxurisen**. Each workflow includes step-by-step execution logic, sequence diagrams (Mermaid), data models, and caching/security layers suitable for generating high-fidelity visual diagrams and flowcharts.

---

## Table of Contents
1. [High-Level System Architecture](#1-high-level-system-architecture)
2. [Authentication & Authorization Lifecycle](#2-authentication--authorization-lifecycle)
3. [Product Catalog & Redis Caching Pipeline](#3-product-catalog--redis-caching-pipeline)
4. [Seller Product & Variant Creation Workflow](#4-seller-product--variant-creation-workflow)
5. [Cart & Server-Side Discount Calculation Flow](#5-cart--server-side-discount-calculation-flow)
6. [Checkout & Razorpay Payment Verification Flow](#6-checkout--razorpay-payment-verification-flow)
7. [Product Reviews & Real-time Aggregation Flow](#7-product-reviews--real-time-aggregation-flow)
8. [Distributed Rate Limiting & Fault Resilience Flow](#8-distributed-rate-limiting--fault-resilience-flow)
9. [Summary of Key Files & Controllers](#9-summary-of-key-files--controllers)

---

## 1. High-Level System Architecture

```mermaid
graph TB
    subgraph Client Tier ["Frontend (React 19 + Vite + Tailwind CSS 4)"]
        UI[Storefront & Seller UI]
        ReduxStore[Redux Toolkit State]
        AxiosClient[Axios API Instance]
        UI --> ReduxStore
        ReduxStore --> AxiosClient
    end

    subgraph Security & Gateway Tier ["API Gateway & Middlewares"]
        RateLimiter[Rate Limiter: Global 200/15m, Auth 10/15m]
        AuthGuard[JWT & Role Verification Guard]
        CacheMiddleware[Redis Cache Middleware]
        AxiosClient --> RateLimiter
        RateLimiter --> AuthGuard
        AuthGuard --> CacheMiddleware
    end

    subgraph Memory & Caching Tier ["Redis Cluster / Memory Store"]
        RedisStore[(Redis: Caches & Distributed Rate Limit Store)]
        RateLimiter -.-> RedisStore
        CacheMiddleware <--> RedisStore
    end

    subgraph Backend Core Tier ["Express 5 Application Controllers"]
        AuthCtrl[Auth Controller]
        ProdCtrl[Product Controller]
        CartCtrl[Cart & Coupon Controller]
        OrderCtrl[Order & Razorpay Controller]
        ReviewCtrl[Review Controller]
        
        CacheMiddleware --> ProdCtrl
        CacheMiddleware --> ReviewCtrl
        AuthGuard --> AuthCtrl
        AuthGuard --> CartCtrl
        AuthGuard --> OrderCtrl
    end

    subgraph Storage & Cloud Tier ["Database & External Services"]
        MongoDB[(MongoDB Database)]
        CloudStorage[Image Storage / CDN]
        RazorpayGateway[Razorpay Payment API]

        AuthCtrl <--> MongoDB
        ProdCtrl <--> MongoDB
        ProdCtrl <--> CloudStorage
        CartCtrl <--> MongoDB
        OrderCtrl <--> MongoDB
        OrderCtrl <--> RazorpayGateway
        ReviewCtrl <--> MongoDB
    end
```

---

## 2. Authentication & Authorization Lifecycle

Handles dual-role registration (Buyer & Seller), encrypted credentials, Google OAuth, and secure token propagation.

### Sequence Flow
```mermaid
sequenceDiagram
    autonumber
    actor User as User (Buyer / Seller)
    participant Client as Frontend (Login / Register)
    participant RateLimit as Auth Rate Limiter (10 req / 15 min)
    participant AuthAPI as Auth Controller (Backend)
    participant DB as MongoDB (User Model)
    participant Cookie as HttpOnly Cookie Jar

    User->>Client: Enters credentials / OAuth
    Client->>RateLimit: POST /api/auth/login or /register
    RateLimit->>RateLimit: Check IP in Redis store
    alt Rate Limit Exceeded (> 10 req)
        RateLimit-->>Client: 429 Too Many Requests
    else Allowed
        RateLimit->>AuthAPI: Forward request
        AuthAPI->>DB: Query user by email
        alt Register
            AuthAPI->>AuthAPI: Bcrypt hash password (salt 10)
            AuthAPI->>DB: Create User document (role: buyer/seller)
        else Login
            AuthAPI->>AuthAPI: Compare bcrypt password hash
        end
        AuthAPI->>AuthAPI: Generate signed JWT (payload: id, role, email)
        AuthAPI->>Cookie: Set-Cookie: token (HttpOnly, Secure, SameSite)
        AuthAPI-->>Client: 200 OK { success: true, user }
        Client->>Client: Dispatch Redux setCredentials(user)
        Client->>Client: Redirect to / (Buyer) or /seller/dashboard (Seller)
    end
```

---

## 3. Product Catalog & Redis Caching Pipeline

High-speed read pipeline with response caching (`X-Cache: HIT/MISS`) and pattern-based invalidation upon write operations.

### Sequence Flow
```mermaid
sequenceDiagram
    autonumber
    actor Buyer as Buyer / Client
    participant Frontend as Storefront App
    participant Cache as Redis Cache Middleware
    participant Redis as Redis (ioredis)
    participant Controller as Product Controller
    participant DB as MongoDB

    Buyer->>Frontend: Loads collection or product detail
    Frontend->>Cache: GET /api/products or /detail/:id
    Cache->>Redis: GET cache:products:...
    
    alt Cache HIT (Key Exists)
        Redis-->>Cache: Cached JSON string
        Cache-->>Frontend: 200 OK (Header: X-Cache: HIT)
    else Cache MISS (Key Not Found)
        Cache->>Controller: Next() -> Execute controller
        Controller->>DB: Query products with filters / sorting
        DB-->>Controller: Product document(s)
        Controller->>Cache: res.json(data) intercepted
        Cache->>Redis: SETEX cache:products:... (TTL: 300s - 600s)
        Cache-->>Frontend: 200 OK (Header: X-Cache: MISS)
    end
    Frontend->>Frontend: Render dynamic catalog / hero grid
```

---

## 4. Seller Product & Variant Creation Workflow

Enables sellers to create root products, upload multiple high-resolution photos, configure variants with custom attributes (Color, Size, Fabric), and instantly purge stale caches.

### Sequence Flow
```mermaid
sequenceDiagram
    autonumber
    actor Seller as Seller
    participant UI as Seller Dashboard
    participant API as Product Router (/api/products)
    participant Upload as Multer & Cloud Storage
    participant DB as MongoDB (Product Model)
    participant Redis as Redis Cluster

    Seller->>UI: Fills Title, Desc, Price, Images & submits
    UI->>API: POST /api/products (FormData with multi-images)
    API->>Upload: Process file buffers
    Upload-->>API: Array of uploaded image URLs
    API->>DB: Insert product { title, price, images, sellerId, variants: [] }
    API->>Redis: delCacheByPattern("cache:products:*") via SCAN stream
    Redis-->>API: Flushed all matching listing caches
    API-->>UI: 201 Created { product }

    opt Add Product Variant
        Seller->>UI: Adds variant (stock, custom price, attributes, images)
        UI->>API: POST /api/products/:id/variants (FormData)
        API->>Upload: Upload variant images
        API->>DB: $push new variant into product.variants
        API->>Redis: delCacheByPattern("cache:products:*")
        API-->>UI: 201 Created { updatedProduct }
    end
```

---

## 5. Cart & Server-Side Discount Calculation Flow

Prevents price manipulation by calculating totals, caps, discounts, and minimum order validation strictly on the server.

### Process Flow
```mermaid
graph TD
    A[Buyer adds items to Shopping Bag] --> B[Client syncs items to Redux Cart]
    B --> C{Buyer applies Coupon Code?}
    C -- No --> D[Calculate Base Total: Items Sum + Shipping]
    C -- Yes --> E[POST /api/cart/apply-coupon]
    
    E --> F[Fetch Coupon from DB]
    F --> G{Is Coupon Valid & Active?}
    G -- No --> H[Return Error: Invalid / Expired Coupon]
    G -- Yes --> I{Cart Value >= minCartValue?}
    I -- No --> J[Return Error: Minimum order value not met]
    I -- Yes --> K[Calculate Discount Amount]
    
    K --> L{Discount Type?}
    L -- Percentage --> M[Apply % discount capped at maxDiscountAmount]
    L -- Flat --> N[Deduct flat amount]
    
    M --> O[Compute Net Payable = Subtotal - Discount + Tax]
    N --> O
    O --> P[Return Validated Pricing Matrix to Client]
```

---

## 6. Checkout & Razorpay Payment Verification Flow

Cryptographically secure two-step checkout with HMAC-SHA256 signature verification.

### Sequence Flow
```mermaid
sequenceDiagram
    autonumber
    actor Buyer as Buyer
    participant Client as Frontend Checkout
    participant OrderAPI as Order Controller
    participant Razorpay as Razorpay API
    participant DB as MongoDB (Order & Product Model)

    Buyer->>Client: Clicks "Proceed to Checkout"
    Client->>OrderAPI: POST /api/orders/create (Cart Items, Address, Coupon)
    OrderAPI->>OrderAPI: Verify stock & recalculate exact total server-side
    OrderAPI->>Razorpay: razorpay.orders.create({ amount, currency: 'INR' })
    Razorpay-->>OrderAPI: { id: razorpay_order_id, amount, status: 'created' }
    OrderAPI->>DB: Save initial Order (status: 'Pending', razorpayOrderId)
    OrderAPI-->>Client: { order, razorpayOrderId, key_id, amount }
    
    Client->>Buyer: Open Razorpay Checkout Modal
    Buyer->>Razorpay: Completes payment (UPI / Card / NetBanking)
    Razorpay-->>Client: Returns { razorpay_order_id, razorpay_payment_id, razorpay_signature }
    
    Client->>OrderAPI: POST /api/orders/verify-payment (payload signatures)
    OrderAPI->>OrderAPI: Generate expected signature: HMAC-SHA256(order_id + "|" + payment_id, secret)
    
    alt Signatures Match (Payment Valid)
        OrderAPI->>DB: Update Order status: 'Paid', paymentDetails
        OrderAPI->>DB: Decrement product stock inventory
        OrderAPI-->>Client: { success: true, message: 'Order placed', orderId }
        Client->>Client: Clear Cart State
        Client->>Buyer: Redirect to /orders-success
    else Signature Mismatch (Tampering / Failed)
        OrderAPI->>DB: Mark Order status: 'Failed'
        OrderAPI-->>Client: 400 Bad Request { success: false, message: 'Invalid payment signature' }
        Client->>Buyer: Display error message
    end
```

---

## 7. Product Reviews & Real-time Aggregation Flow

Allows verified buyers to review products with dynamic statistical recalibration.

### Process Flow
```mermaid
graph TD
    A[Buyer navigates to Product Page] --> B[Submits Review: rating 1-5 + comment]
    B --> C[POST /api/reviews/:productId]
    C --> D[Auth Middleware validates JWT]
    D --> E[Save Review in MongoDB]
    E --> F[MongoDB Aggregate: Compute avgRating & ratingDistribution]
    F --> G[Update Product summary rating]
    G --> H[Invalidate Redis Cache: cache:reviews:productId & cache:products:*]
    H --> I[Return updated reviews and stats to Frontend]
    I --> J[Redux dispatches setReviews & setReviewStats]
    J --> K[UI updates review breakdown live]
```

---

## 8. Distributed Rate Limiting & Fault Resilience Flow

Dual-tier protection preventing API spam, brute-force login attempts, and DDoS while guaranteeing zero-downtime if Redis is unreachable.

### Strategy Diagram
```mermaid
graph TD
    Req[Incoming HTTP Request] --> Match{Route Pattern?}
    
    Match -- "/api/auth/login" or "/register" --> AuthLimit[Auth Rate Limiter: 10 req / 15 min]
    Match -- "/api/*" (General Endpoints) --> GlobalLimit[Global Rate Limiter: 200 req / 15 min]
    
    AuthLimit --> CheckRedis{Redis Available?}
    GlobalLimit --> CheckRedis
    
    CheckRedis -- Yes --> RedisRateStore[Execute atomic INCR & EXPIRE in Redis]
    CheckRedis -- No (Offline / Reconnecting) --> MemoryFallback[Fallback to in-memory MemoryStore]
    
    RedisRateStore --> EvalLimit{Current Count <= Limit?}
    MemoryFallback --> EvalLimit
    
    EvalLimit -- Exceeded --> Reject[Return 429 Too Many Requests with Retry-After header]
    EvalLimit -- Under Limit --> Pass[Pass through to Route Controller]
```

---

## 9. Summary of Key Files & Controllers

| Module | Primary Frontend Files | Primary Backend Files | Primary Responsibilities |
| :--- | :--- | :--- | :--- |
| **Auth** | [Login.jsx](file:///c:/Users/HARSHAL/OneDrive/College%20Work/Desktop/Cohert%202.0/07-Full%20Stack%20Projects/07%20-%20Snitch/frontend/src/features/auth/pages/Login.jsx), [Register.jsx](file:///c:/Users/HARSHAL/OneDrive/College%20Work/Desktop/Cohert%202.0/07-Full%20Stack%20Projects/07%20-%20Snitch/frontend/src/features/auth/pages/Register.jsx), [Protected.jsx](file:///c:/Users/HARSHAL/OneDrive/College%20Work/Desktop/Cohert%202.0/07-Full%20Stack%20Projects/07%20-%20Snitch/frontend/src/features/auth/components/Protected.jsx) | `auth.routes.js`, `auth.controller.js`, `user.model.js` | Dual-role RBAC, bcrypt hashing, JWT issuance, cookies. |
| **Products & Variants** | [Home.jsx](file:///c:/Users/HARSHAL/OneDrive/College%20Work/Desktop/Cohert%202.0/07-Full%20Stack%20Projects/07%20-%20Snitch/frontend/src/features/products/pages/Home.jsx), [ProductDetail.jsx](file:///c:/Users/HARSHAL/OneDrive/College%20Work/Desktop/Cohert%202.0/07-Full%20Stack%20Projects/07%20-%20Snitch/frontend/src/features/products/pages/ProductDetail.jsx), [SellerProductDetails.jsx](file:///c:/Users/HARSHAL/OneDrive/College%20Work/Desktop/Cohert%202.0/07-Full%20Stack%20Projects/07%20-%20Snitch/frontend/src/features/products/pages/SellerProductDetails.jsx) | `product.routes.js`, `product.controller.js`, `product.model.js` | Catalog browsing, multi-variant inventory, image upload. |
| **Caching & Rate Limiting** | [AppLayout.jsx](file:///c:/Users/HARSHAL/OneDrive/College%20Work/Desktop/Cohert%202.0/07-Full%20Stack%20Projects/07%20-%20Snitch/frontend/src/app/AppLayout.jsx), [product.api.js](file:///c:/Users/HARSHAL/OneDrive/College%20Work/Desktop/Cohert%202.0/07-Full%20Stack%20Projects/07%20-%20Snitch/frontend/src/features/products/services/product.api.js) | `redis.js`, `cache.middleware.js`, `rateLimiter.middleware.js` | Redis response caching (`X-Cache`), invalidations, rate limiting. |
| **Cart & Coupons** | [Cart.jsx](file:///c:/Users/HARSHAL/OneDrive/College%20Work/Desktop/Cohert%202.0/07-Full%20Stack%20Projects/07%20-%20Snitch/frontend/src/features/cart/pages/Cart.jsx) | `cart.routes.js`, `coupon.controller.js`, `coupon.model.js` | Cart persistence, discount caps, price validation. |
| **Orders & Payments** | [OrderDetail.jsx](file:///c:/Users/HARSHAL/OneDrive/College%20Work/Desktop/Cohert%202.0/07-Full%20Stack%20Projects/07%20-%20Snitch/frontend/src/features/orders/pages/OrderDetail.jsx), [OrderSuccess.jsx](file:///c:/Users/HARSHAL/OneDrive/College%20Work/Desktop/Cohert%202.0/07-Full%20Stack%20Projects/07%20-%20Snitch/frontend/src/features/cart/pages/OrderSuccess.jsx) | `order.routes.js`, `order.controller.js`, `order.model.js` | Razorpay order generation, HMAC verification, inventory decrement. |
| **Reviews** | [ProductDetail.jsx](file:///c:/Users/HARSHAL/OneDrive/College%20Work/Desktop/Cohert%202.0/07-Full%20Stack%20Projects/07%20-%20Snitch/frontend/src/features/products/pages/ProductDetail.jsx) | `review.routes.js`, `review.controller.js`, `review.model.js` | Star rating distribution, reviews list, aggregation pipeline. |
