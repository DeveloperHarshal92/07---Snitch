import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useCart } from "../hooks/useCart";
import { removeFromCart, setItems } from "../state/cart.slice";
import { useNavigate } from "react-router";

/* ── Google Fonts ─────────────────────────────────────────────── */
const FontLink = () => (
  <link
    href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=Inter:wght@300;400;500;600&display=swap"
    rel="stylesheet"
  />
);

/* ── Currency formatter ───────────────────────────────────────── */
const fmt = (amount, currency = "INR") =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(amount);

/* ── CartItemRow ──────────────────────────────────────────────── */
const CartItemRow = ({ item, idx, onRemove, removing, onQtyChange }) => {
  const [visible, setVisible] = useState(false);
  const [hovered, setHovered] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), idx * 90 + 100);
    return () => clearTimeout(t);
  }, [idx]);

  const product = item.product ?? {};
  /* price = snapshotted price at time of adding to cart (the "display price") */
  const price = item.price ?? product.price ?? { amount: 0, currency: "INR" };
  const quantity = item.quantity ?? 1;

  /* Pick the first image from product images array */
  const thumb = product.images?.[0]?.url ?? null;

  /* Resolve the matched variant (if any) to get correct stock */
  const matchedVariant = item.variant
    ? ((product.variants ?? []).find((v) => v._id === item.variant) ?? null)
    : null;

  /* Variant attributes label */
  const variantAttrs = matchedVariant?.attributes
    ? Object.entries(matchedVariant.attributes)
        .map(([k, v]) => `${k.replace(/_\d+$/, "")}: ${v}`)
        .join(" · ")
    : item.variant
      ? "Variant Selected"
      : null;

  /* Stock: prefer variant-level stock, fall back to product-level */
  const stock =
    matchedVariant != null ? (matchedVariant.stock ?? 0) : (product.stock ?? 0);
  const isOutOfStock = stock === 0;

  /* ── Discount / Price-change system ────────────────────────────
   * Compares:
   *   cartPrice    = price.amount  (snapshotted when item was added)
   *   currentPrice = live price from variant/product (what seller set now)
   *
   * If currentPrice < cartPrice  → seller lowered price  → show savings
   * If currentPrice > cartPrice  → seller raised price   → warn user
   * ─────────────────────────────────────────────────────────────── */
  const cartPrice = price.amount;
  const currentPrice =
    (matchedVariant?.price?.amount != null
      ? matchedVariant.price.amount
      : product.price?.amount) ?? cartPrice;

  const priceDiff = cartPrice - currentPrice; // positive = saving, negative = increase
  const hasPriceChanged = Math.abs(priceDiff) > 0;
  const isPriceDrop = priceDiff > 0;
  const isPriceHike = priceDiff < 0;
  const discountPct = isPriceDrop
    ? Math.round((priceDiff / cartPrice) * 100)
    : 0;
  const hikePct = isPriceHike
    ? Math.round((Math.abs(priceDiff) / cartPrice) * 100)
    : 0;

  /* Use the live (current) price for line total so totals stay accurate */
  const effectiveUnitPrice = currentPrice;
  const lineTotal = effectiveUnitPrice * quantity;

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        opacity: removing ? 0 : visible ? 1 : 0,
        transform: removing
          ? "translateX(-20px)"
          : visible
            ? "translateY(0)"
            : "translateY(18px)",
        transition: removing
          ? "opacity 0.35s ease, transform 0.35s ease"
          : `opacity 0.5s ease ${idx * 0.07}s, transform 0.5s ease ${idx * 0.07}s`,
        borderBottom: "1px solid #e4e2df",
        padding: "28px 0",
        display: "flex",
        gap: "20px",
        alignItems: "flex-start",
      }}
    >
      {/* Product image */}
      <div
        onClick={() => navigate(`/product/${product._id}`)}
        style={{
          width: "96px",
          height: "120px",
          flexShrink: 0,
          backgroundColor: "#f0ede9",
          borderRadius: "2px",
          overflow: "hidden",
          cursor: "pointer",
          position: "relative",
        }}
      >
        {thumb ? (
          <img
            src={thumb}
            alt={product.title}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              transition: "transform 0.55s ease",
              transform: hovered ? "scale(1.06)" : "scale(1)",
            }}
          />
        ) : (
          <div
            style={{
              width: "100%",
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1}
              stroke="#d0c5b5"
              style={{ width: 28, height: 28 }}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
              />
            </svg>
          </div>
        )}

        {/* Out of stock overlay */}
        {isOutOfStock && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              backgroundColor: "rgba(251,249,246,0.7)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <span
              style={{
                fontSize: "0.5rem",
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                color: "#c0392b",
                fontFamily: "'Inter', sans-serif",
                fontWeight: 500,
                backgroundColor: "rgba(255,255,255,0.9)",
                padding: "3px 6px",
                borderRadius: "1px",
              }}
            >
              Out of Stock
            </span>
          </div>
        )}
      </div>

      {/* Product details */}
      <div
        style={{
          flex: 1,
          minWidth: 0,
          display: "flex",
          flexDirection: "column",
          gap: "6px",
        }}
      >
        {/* Title */}
        <h3
          onClick={() => navigate(`/product/${product._id}`)}
          style={{
            margin: 0,
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: "clamp(1rem, 2vw, 1.2rem)",
            fontWeight: 400,
            lineHeight: 1.25,
            color: "#0d0d0b",
            cursor: "pointer",
            transition: "color 0.2s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "#C9A96E")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "#0d0d0b")}
        >
          {product.title ?? "—"}
        </h3>

        {/* Variant */}
        {variantAttrs && (
          <p
            style={{
              margin: 0,
              fontSize: "0.6rem",
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              color: "#6b6158",
              fontFamily: "'Inter', sans-serif",
            }}
          >
            {variantAttrs}
          </p>
        )}

        {/* Stock badge */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            marginTop: "2px",
          }}
        >
          <span
            style={{
              fontSize: "0.55rem",
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              fontFamily: "'Inter', sans-serif",
              color: isOutOfStock ? "#c0392b" : "#4a7c59",
            }}
          >
            {isOutOfStock ? "Out of stock" : `${stock} in stock`}
          </span>

          {/* Tags */}
          {["Authentic", "Easy Returns"].map((tag) => (
            <span
              key={tag}
              style={{
                fontSize: "0.5rem",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                padding: "2px 6px",
                borderRadius: "1px",
                backgroundColor: "#f0ede9",
                color: "#6b6158",
                fontFamily: "'Inter', sans-serif",
              }}
            >
              {tag}
            </span>
          ))}
        </div>

        {/* ── Discount badge (price dropped) ── */}
        {isPriceDrop && (
          <div style={{ marginTop: "4px" }}>
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "4px",
                backgroundColor: "rgba(74, 124, 89, 0.1)",
                color: "#4a7c59",
                fontSize: "0.5rem",
                fontFamily: "'Inter', sans-serif",
                fontWeight: 600,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                padding: "3px 8px",
                borderRadius: "2px",
                border: "1px solid rgba(74,124,89,0.25)",
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                style={{ width: 10, height: 10 }}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 6h.008v.008H6V6z"
                />
              </svg>
              You save {discountPct}%
            </span>
          </div>
        )}

        {/* Qty row */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            marginTop: "8px",
          }}
        >
          <span
            style={{
              fontSize: "0.6rem",
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: "#6b6158",
              fontFamily: "'Inter', sans-serif",
            }}
          >
            Qty
          </span>

          {/* Stepper */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              border: "1px solid #e4e2df",
              borderRadius: "2px",
              overflow: "hidden",
            }}
          >
            {/* Decrease */}
            <button
              id={`qty-dec-${item._id}`}
              onClick={() =>
                onQtyChange(
                  { productId: product._id, variantId: item.variant },
                  quantity - 1,
                )
              }
              disabled={quantity <= 1}
              style={{
                width: "32px",
                height: "32px",
                border: "none",
                borderRight: "1px solid #e4e2df",
                backgroundColor: quantity <= 1 ? "#f5f3f0" : "#fbf9f6",
                cursor: quantity <= 1 ? "not-allowed" : "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: quantity <= 1 ? "#c4bdb5" : "#3d342c",
                fontSize: "1rem",
                fontWeight: 300,
                transition: "background-color 0.15s, color 0.15s",
                flexShrink: 0,
              }}
              onMouseEnter={(e) => {
                if (quantity > 1)
                  e.currentTarget.style.backgroundColor = "#f0ede9";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor =
                  quantity <= 1 ? "#f5f3f0" : "#fbf9f6";
              }}
            >
              −
            </button>

            {/* Count */}
            <span
              style={{
                padding: "0 16px",
                fontSize: "0.8rem",
                fontFamily: "'Inter', sans-serif",
                color: "#0d0d0b",
                fontWeight: 500,
                backgroundColor: "#f5f3f0",
                height: "32px",
                display: "flex",
                alignItems: "center",
                minWidth: "36px",
                justifyContent: "center",
                userSelect: "none",
              }}
            >
              {quantity}
            </span>

            {/* Increase */}
            <button
              id={`qty-inc-${item._id}`}
              onClick={() =>
                onQtyChange(
                  { productId: product._id, variantId: item.variant },
                  quantity + 1,
                )
              }
              disabled={stock > 0 && quantity >= stock}
              style={{
                width: "32px",
                height: "32px",
                border: "none",
                borderLeft: "1px solid #e4e2df",
                backgroundColor:
                  stock > 0 && quantity >= stock ? "#f5f3f0" : "#fbf9f6",
                cursor:
                  stock > 0 && quantity >= stock ? "not-allowed" : "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: stock > 0 && quantity >= stock ? "#c4bdb5" : "#3d342c",
                fontSize: "1rem",
                fontWeight: 300,
                transition: "background-color 0.15s, color 0.15s",
                flexShrink: 0,
              }}
              onMouseEnter={(e) => {
                if (!(stock > 0 && quantity >= stock))
                  e.currentTarget.style.backgroundColor = "#f0ede9";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor =
                  stock > 0 && quantity >= stock ? "#f5f3f0" : "#fbf9f6";
              }}
            >
              +
            </button>
          </div>

          {/* Max stock hint */}
          {stock > 0 && stock <= 5 && (
            <span
              style={{
                fontSize: "0.55rem",
                letterSpacing: "0.1em",
                color: "#b7791f",
                fontFamily: "'Inter', sans-serif",
              }}
            >
              Only {stock} left
            </span>
          )}
        </div>
      </div>

      {/* Price + remove */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-end",
          gap: "8px",
          flexShrink: 0,
        }}
      >
        {/* ── Price hike badge ── */}
        {isPriceHike && (
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "4px",
              backgroundColor: "rgba(192, 57, 43, 0.08)",
              color: "#c0392b",
              fontSize: "0.5rem",
              fontFamily: "'Inter', sans-serif",
              fontWeight: 600,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              padding: "3px 8px",
              borderRadius: "2px",
              border: "1px solid rgba(192,57,43,0.2)",
            }}
          >
            {/* Up arrow */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2.5}
              stroke="currentColor"
              style={{ width: 9, height: 9 }}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4.5 15.75l7.5-7.5 7.5 7.5"
              />
            </svg>
            Price up {hikePct}%
          </span>
        )}

        {/* ── Line total (current price) ── */}
        <span
          style={{
            fontSize: "1.1rem",
            fontWeight: 500,
            color: isPriceHike ? "#c0392b" : "#C9A96E",
            fontFamily: "'Inter', sans-serif",
            letterSpacing: "0.01em",
            transition: "color 0.3s",
          }}
        >
          {fmt(lineTotal, price.currency)}
        </span>

        {/* ── Strikethrough original (snapshotted) price if changed ── */}
        {hasPriceChanged && (
          <span
            style={{
              fontSize: "0.65rem",
              color: "#a89e94",
              fontFamily: "'Inter', sans-serif",
              letterSpacing: "0.05em",
              textDecoration: "line-through",
            }}
          >
            {fmt(cartPrice * quantity, price.currency)}
          </span>
        )}

        {/* Remove button */}
        <button
          id={`cart-remove-${item._id}`}
          onClick={() =>
            onRemove({ productId: product._id, variantId: item.variant })
          }
          disabled={removing}
          style={{
            background: "none",
            border: "none",
            cursor: removing ? "not-allowed" : "pointer",
            display: "flex",
            alignItems: "center",
            gap: "5px",
            color: "#6b6158",
            fontSize: "0.55rem",
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            fontFamily: "'Inter', sans-serif",
            padding: 0,
            opacity: removing ? 0.4 : 1,
            transition: "color 0.2s, opacity 0.2s",
          }}
          onMouseEnter={(e) => {
            if (!removing) e.currentTarget.style.color = "#c0392b";
          }}
          onMouseLeave={(e) => (e.currentTarget.style.color = "#6b6158")}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            style={{ width: 13, height: 13 }}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
            />
          </svg>
          Remove
        </button>
      </div>
    </div>
  );
};

/* ── OrderSummary ─────────────────────────────────────────────── */
const OrderSummary = ({ cartItems, visible }) => {
  const navigate = useNavigate();
  const [couponCode, setCouponCode] = useState("");
  const [isCouponApplied, setIsCouponApplied] = useState(false);
  const [couponError, setCouponError] = useState("");

  const handleApplyCoupon = () => {
    if (!couponCode.trim()) return;
    if (couponCode.trim().toUpperCase() === "SNITCH10") {
      setIsCouponApplied(true);
      setCouponError("");
    } else {
      setIsCouponApplied(false);
      setCouponError("Invalid coupon code");
    }
  };

  const removeCoupon = () => {
    setCouponCode("");
    setIsCouponApplied(false);
    setCouponError("");
  };

  const subtotal = cartItems.reduce((acc, item) => {
    const product = item.product ?? {};
    const matchedVariant = item.variant
      ? ((product.variants ?? []).find((v) => v._id === item.variant) ?? null)
      : null;
    /* Use live current price (same logic as CartItemRow) */
    const liveAmount =
      (matchedVariant?.price?.amount != null
        ? matchedVariant.price.amount
        : product.price?.amount) ??
      item.price?.amount ??
      0;
    return acc + liveAmount * (item.quantity ?? 1);
  }, 0);

  /* Total savings = sum of (cartPrice - currentPrice) * qty for items where price dropped */
  const totalSavings = cartItems.reduce((acc, item) => {
    const product = item.product ?? {};
    const matchedVariant = item.variant
      ? ((product.variants ?? []).find((v) => v._id === item.variant) ?? null)
      : null;
    const cartPrice = item.price?.amount ?? 0;
    const livePrice =
      (matchedVariant?.price?.amount != null
        ? matchedVariant.price.amount
        : product.price?.amount) ?? cartPrice;
    const saving = (cartPrice - livePrice) * (item.quantity ?? 1);
    return acc + (saving > 0 ? saving : 0);
  }, 0);

  const hasSavings = totalSavings > 0;

  const currency =
    cartItems[0]?.price?.currency ??
    cartItems[0]?.product?.price?.currency ??
    "INR";

  const shippingThreshold = 999;
  const shippingFree = subtotal >= shippingThreshold;
  const shipping = shippingFree ? 0 : 99;

  const couponDiscount = isCouponApplied ? Math.round(subtotal * 0.1) : 0;
  const total = Math.max(0, subtotal + shipping - couponDiscount);

  const progressPct = Math.min((subtotal / shippingThreshold) * 100, 100);

  return (
    <aside
      style={{
        width: "320px",
        flexShrink: 0,
        alignSelf: "flex-start",
        position: "sticky",
        top: "88px",
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(20px)",
        transition: "opacity 0.6s ease 0.3s, transform 0.6s ease 0.3s",
      }}
    >
      <div
        style={{
          border: "1px solid #e4e2df",
          borderRadius: "2px",
          padding: "28px",
          backgroundColor: "#fbf9f6",
        }}
      >
        {/* Title */}
        <p
          style={{
            margin: "0 0 24px",
            fontSize: "0.6rem",
            letterSpacing: "0.28em",
            textTransform: "uppercase",
            color: "#6b6158",
            fontFamily: "'Inter', sans-serif",
          }}
        >
          Order Summary
        </p>

        {/* Free shipping progress */}
        {!shippingFree && (
          <div style={{ marginBottom: "24px" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "8px",
              }}
            >
              <span
                style={{
                  fontSize: "0.55rem",
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  color: "#6b6158",
                  fontFamily: "'Inter', sans-serif",
                }}
              >
                Add {fmt(shippingThreshold - subtotal, currency)} for free
                shipping
              </span>
            </div>
            <div
              style={{
                height: "2px",
                backgroundColor: "#e4e2df",
                borderRadius: "1px",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  height: "100%",
                  width: `${progressPct}%`,
                  backgroundColor: "#C9A96E",
                  borderRadius: "1px",
                  transition: "width 0.6s ease",
                }}
              />
            </div>
          </div>
        )}

        {shippingFree && (
          <div
            style={{
              marginBottom: "20px",
              padding: "10px 12px",
              backgroundColor: "rgba(74,124,89,0.08)",
              borderRadius: "2px",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="#4a7c59"
              style={{ width: 14, height: 14, flexShrink: 0 }}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
              />
            </svg>
            <span
              style={{
                fontSize: "0.55rem",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: "#4a7c59",
                fontFamily: "'Inter', sans-serif",
              }}
            >
              You've unlocked free shipping!
            </span>
          </div>
        )}

        {/* Line items */}
        <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
            }}
          >
            <span
              style={{
                fontSize: "0.65rem",
                letterSpacing: "0.08em",
                color: "#3d342c",
                fontFamily: "'Inter', sans-serif",
              }}
            >
              Subtotal ({cartItems.length}{" "}
              {cartItems.length === 1 ? "item" : "items"})
            </span>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-end",
                gap: "2px",
              }}
            >
              {hasSavings && (
                <span
                  style={{
                    fontSize: "11px",
                    color: "gray",
                    textDecoration: "line-through",
                    fontFamily: "'Inter', sans-serif",
                  }}
                >
                  {fmt(subtotal + totalSavings, currency)}
                </span>
              )}
              <span
                style={{
                  fontSize: "14px",
                  fontWeight: 600,
                  color: "black",
                  fontFamily: "'Inter', sans-serif",
                }}
              >
                {fmt(subtotal, currency)}
              </span>
              {hasSavings && (
                <span
                  style={{
                    fontSize: "11px",
                    color: "#4a7c59",
                    fontFamily: "'Inter', sans-serif",
                    marginTop: "2px",
                  }}
                >
                  ✓ Saving {fmt(totalSavings, currency)}
                </span>
              )}
            </div>
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <span
              style={{
                fontSize: "0.65rem",
                letterSpacing: "0.08em",
                color: "#3d342c",
                fontFamily: "'Inter', sans-serif",
              }}
            >
              Shipping
            </span>
            <span
              style={{
                fontSize: "0.8rem",
                fontWeight: shippingFree ? 400 : 500,
                color: shippingFree ? "#4a7c59" : "#0d0d0b",
                fontFamily: "'Inter', sans-serif",
              }}
            >
              {shippingFree ? "Free" : fmt(shipping, currency)}
            </span>
          </div>

          {/* Divider */}
          <div style={{ borderTop: "1px solid #e4e2df", margin: "4px 0" }} />

          {/* Promo Code Input Section (Moved Above Total) */}
          <div style={{ margin: "4px 0" }}>
            <p
              style={{
                margin: "0 0 12px",
                fontSize: "11px",
                letterSpacing: "0.4px",
                textTransform: "uppercase",
                color: "gray",
                fontFamily: "'Inter', sans-serif",
                fontWeight: 500,
              }}
            >
              Have a promo code?
            </p>
            {!isCouponApplied ? (
              <div style={{ display: "flex", gap: "8px" }}>
                <input
                  type="text"
                  placeholder="Enter code (e.g., SNITCH10)"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                  style={{
                    flex: 1,
                    padding: "10px 12px",
                    fontSize: "0.75rem",
                    fontFamily: "'Inter', sans-serif",
                    border: `1px solid ${couponError ? "#c0392b" : "#e4e2df"}`,
                    borderRadius: "2px",
                    outline: "none",
                    backgroundColor: "#fff",
                  }}
                />
                <button
                  onClick={handleApplyCoupon}
                  style={{
                    padding: "0 20px",
                    backgroundColor: "#3d342c",
                    color: "#fff",
                    border: "none",
                    borderRadius: "2px",
                    cursor: "pointer",
                    fontSize: "0.65rem",
                    textTransform: "uppercase",
                    letterSpacing: "0.1em",
                    fontFamily: "'Inter', sans-serif",
                    transition: "background-color 0.2s",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.backgroundColor = "#0d0d0b")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.backgroundColor = "#3d342c")
                  }
                >
                  Apply
                </button>
              </div>
            ) : (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "10px 12px",
                  backgroundColor: "rgba(74, 124, 89, 0.08)",
                  border: "1px dashed rgba(74, 124, 89, 0.4)",
                  borderRadius: "2px",
                }}
              >
                <div
                  style={{ display: "flex", alignItems: "center", gap: "8px" }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="#4a7c59"
                    style={{ width: 14, height: 14 }}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                    />
                  </svg>
                  <span
                    style={{
                      fontSize: "0.7rem",
                      fontFamily: "'Inter', sans-serif",
                      color: "#4a7c59",
                      fontWeight: 500,
                      letterSpacing: "0.05em",
                    }}
                  >
                    {couponCode} Applied
                  </span>
                </div>
                <button
                  onClick={removeCoupon}
                  style={{
                    background: "none",
                    border: "none",
                    padding: 0,
                    fontSize: "0.6rem",
                    color: "#6b6158",
                    textDecoration: "underline",
                    cursor: "pointer",
                    fontFamily: "'Inter', sans-serif",
                  }}
                >
                  Remove
                </button>
              </div>
            )}
            {couponError && (
              <p
                style={{
                  margin: "6px 0 0",
                  fontSize: "0.6rem",
                  color: "#c0392b",
                  fontFamily: "'Inter', sans-serif",
                }}
              >
                {couponError}
              </p>
            )}
          </div>

          {/* Coupon Discount Row (if applied) */}
          {isCouponApplied && (
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <span
                style={{
                  fontSize: "0.65rem",
                  letterSpacing: "0.08em",
                  color: "#4a7c59",
                  fontFamily: "'Inter', sans-serif",
                }}
              >
                Coupon ({couponCode})
              </span>
              <span
                style={{
                  fontSize: "0.8rem",
                  fontWeight: 500,
                  color: "#4a7c59",
                  fontFamily: "'Inter', sans-serif",
                }}
              >
                -{fmt(couponDiscount, currency)}
              </span>
            </div>
          )}

          {/* Divider */}
          <div style={{ borderTop: "1px solid #e4e2df", margin: "4px 0" }} />

          {/* Total */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <span
              style={{
                fontSize: "0.7rem",
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color: "#0d0d0b",
                fontFamily: "'Inter', sans-serif",
                fontWeight: 500,
              }}
            >
              Total
            </span>
            <span
              style={{
                fontSize: "1.1rem",
                fontWeight: 600,
                color: "#C9A96E",
                fontFamily: "'Inter', sans-serif",
              }}
            >
              {fmt(total, currency)}
            </span>
          </div>
          <p
            style={{
              margin: "-6px 0 0",
              fontSize: "0.55rem",
              letterSpacing: "0.1em",
              color: "#6b6158",
              fontFamily: "'Inter', sans-serif",
              textAlign: "right",
            }}
          >
            incl. of all taxes
          </p>
        </div>

        {/* Checkout button */}
        <button
          id="btn-checkout"
          className="cart-checkout-btn"
          style={{
            marginTop: "24px",
            width: "100%",
            padding: "16px",
            backgroundColor: "#0d0d0b",
            color: "#fbf9f6",
            border: "none",
            borderRadius: "2px",
            cursor: "pointer",
            fontSize: "0.65rem",
            letterSpacing: "0.22em",
            textTransform: "uppercase",
            fontFamily: "'Inter', sans-serif",
            fontWeight: 500,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
            transition: "background-color 0.3s, color 0.3s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = "#C9A96E";
            e.currentTarget.style.color = "#0d0d0b";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "#0d0d0b";
            e.currentTarget.style.color = "#fbf9f6";
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            style={{ width: 15, height: 15 }}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z"
            />
          </svg>
          Proceed to Checkout
        </button>

        {/* Continue shopping */}
        <button
          onClick={() => navigate("/")}
          style={{
            marginTop: "12px",
            width: "100%",
            padding: "12px",
            backgroundColor: "transparent",
            color: "#3d342c",
            border: "1px solid #e4e2df",
            borderRadius: "2px",
            cursor: "pointer",
            fontSize: "0.6rem",
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            fontFamily: "'Inter', sans-serif",
            transition: "border-color 0.2s, color 0.2s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = "#3d342c";
            e.currentTarget.style.color = "#0d0d0b";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = "#e4e2df";
            e.currentTarget.style.color = "#3d342c";
          }}
        >
          Continue Shopping
        </button>

        {/* Trust badges */}
        <div
          style={{
            marginTop: "20px",
            paddingTop: "20px",
            borderTop: "1px solid #e4e2df",
            display: "flex",
            justifyContent: "center",
            gap: "20px",
          }}
        >
          {[
            {
              icon: (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  style={{ width: 14, height: 14 }}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z"
                  />
                </svg>
              ),
              label: "Secure",
            },
            {
              icon: (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  style={{ width: 14, height: 14 }}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M8.25 18.75a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 0 1-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 0 0-3.213-9.193 2.056 2.056 0 0 0-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 0 0-10.026 0 1.106 1.106 0 0 0-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12"
                  />
                </svg>
              ),
              label: "Fast Ship",
            },
            {
              icon: (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  style={{ width: 14, height: 14 }}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99"
                  />
                </svg>
              ),
              label: "Easy Return",
            },
          ].map(({ icon, label }) => (
            <div
              key={label}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "5px",
                color: "#6b6158",
              }}
            >
              {icon}
              <span
                style={{
                  fontSize: "0.5rem",
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  fontFamily: "'Inter', sans-serif",
                }}
              >
                {label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
};

/* ── Loading Skeleton ─────────────────────────────────────────── */
const LoadingSkeleton = () => (
  <div
    className="max-w-[1200px] mx-auto px-6 lg:px-12 py-12"
    style={{ display: "flex", gap: "48px", alignItems: "flex-start" }}
  >
    {/* Cart items skeleton */}
    <div
      style={{ flex: 1, display: "flex", flexDirection: "column", gap: "0" }}
    >
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          style={{
            display: "flex",
            gap: "20px",
            padding: "28px 0",
            borderBottom: "1px solid #e4e2df",
          }}
        >
          <div
            className="animate-pulse"
            style={{
              width: "96px",
              height: "120px",
              flexShrink: 0,
              backgroundColor: "#e4e2df",
              borderRadius: "2px",
            }}
          />
          <div
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              gap: "10px",
              paddingTop: "4px",
            }}
          >
            <div
              className="animate-pulse"
              style={{
                height: "18px",
                width: "60%",
                backgroundColor: "#e4e2df",
                borderRadius: "2px",
              }}
            />
            <div
              className="animate-pulse"
              style={{
                height: "10px",
                width: "30%",
                backgroundColor: "#e4e2df",
                borderRadius: "2px",
              }}
            />
            <div
              className="animate-pulse"
              style={{
                height: "10px",
                width: "20%",
                backgroundColor: "#e4e2df",
                borderRadius: "2px",
                marginTop: "8px",
              }}
            />
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-end",
              gap: "12px",
            }}
          >
            <div
              className="animate-pulse"
              style={{
                height: "22px",
                width: "80px",
                backgroundColor: "#e4e2df",
                borderRadius: "2px",
              }}
            />
            <div
              className="animate-pulse"
              style={{
                height: "10px",
                width: "50px",
                backgroundColor: "#e4e2df",
                borderRadius: "2px",
              }}
            />
          </div>
        </div>
      ))}
    </div>
    {/* Summary skeleton */}
    <div style={{ width: "320px", flexShrink: 0 }}>
      <div
        style={{
          border: "1px solid #e4e2df",
          borderRadius: "2px",
          padding: "28px",
        }}
      >
        {[0, 1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="animate-pulse"
            style={{
              height: i === 3 ? "1px" : "14px",
              width: i === 0 ? "50%" : "100%",
              backgroundColor: i === 3 ? "#e4e2df" : "#e4e2df",
              borderRadius: "2px",
              marginBottom: "16px",
            }}
          />
        ))}
        <div
          className="animate-pulse"
          style={{
            height: "48px",
            width: "100%",
            backgroundColor: "#e4e2df",
            borderRadius: "2px",
          }}
        />
      </div>
    </div>
  </div>
);

/* ── Empty State ──────────────────────────────────────────────── */
const EmptyCart = ({ navigate }) => {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 80);
    return () => clearTimeout(t);
  }, []);

  return (
    <div
      style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "96px 24px",
        gap: "20px",
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(24px)",
        transition: "opacity 0.6s ease, transform 0.6s ease",
      }}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={0.75}
        stroke="#d0c5b5"
        style={{ width: 64, height: 64 }}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007Z"
        />
      </svg>

      <div
        style={{
          textAlign: "center",
          display: "flex",
          flexDirection: "column",
          gap: "8px",
        }}
      >
        <h2
          style={{
            margin: 0,
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: "clamp(1.8rem, 4vw, 2.6rem)",
            fontWeight: 300,
            color: "#0d0d0b",
            lineHeight: 1.15,
          }}
        >
          Your bag is empty
        </h2>
        <p
          style={{
            margin: 0,
            fontSize: "0.75rem",
            color: "#6b6158",
            fontFamily: "'Inter', sans-serif",
            fontWeight: 300,
            lineHeight: 1.7,
            maxWidth: "320px",
          }}
        >
          Explore the collection and add pieces you love.
        </p>
      </div>

      <button
        id="btn-explore-collection"
        onClick={() => navigate("/")}
        style={{
          marginTop: "8px",
          padding: "14px 40px",
          backgroundColor: "#0d0d0b",
          color: "#fbf9f6",
          border: "none",
          borderRadius: "2px",
          cursor: "pointer",
          fontSize: "0.65rem",
          letterSpacing: "0.22em",
          textTransform: "uppercase",
          fontFamily: "'Inter', sans-serif",
          fontWeight: 500,
          transition: "background-color 0.3s, color 0.3s",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = "#C9A96E";
          e.currentTarget.style.color = "#0d0d0b";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = "#0d0d0b";
          e.currentTarget.style.color = "#fbf9f6";
        }}
      >
        Explore Collection
      </button>
    </div>
  );
};

/* ── Cart ─────────────────────────────────────────────────────── */
const Cart = () => {
  const cartItems = useSelector((state) => state.cart.items);
  const {
    handleGetCart,
    handleRemoveFromCart,
    handleIncrementCartItem,
    handleDecrementCartItem,
  } = useCart();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(true);
  const [visible, setVisible] = useState(false);
  const [removingIds, setRemovingIds] = useState(new Set());

  useEffect(() => {
    handleGetCart().finally(() => {
      setIsLoading(false);
      setTimeout(() => setVisible(true), 60);
    });
  }, []);

  const handleRemove = async ({ productId, variantId }) => {
    // Find the itemId for local state manipulation
    const item = cartItems.find((i) => {
      const matchProduct =
        i.product?._id === productId || i.product === productId;
      const matchVariant = variantId ? i.variant === variantId : !i.variant;
      return matchProduct && matchVariant;
    });
    const itemId = item?._id;

    if (itemId) setRemovingIds((prev) => new Set([...prev, itemId]));
    try {
      await handleRemoveFromCart({ productId, variantId });
      // Let handleGetCart (called by handleRemoveFromCart) sync Redux,
      // but also locally dispatch for immediate visual feedback if desired
      if (itemId) dispatch(removeFromCart(itemId));
    } catch (err) {
      console.error(err);
    } finally {
      if (itemId) {
        setTimeout(() => {
          setRemovingIds((prev) => {
            const next = new Set(prev);
            next.delete(itemId);
            return next;
          });
        }, 380);
      }
    }
  };

  const handleQtyChange = async ({ productId, variantId }, newQty) => {
    if (newQty < 1) return;

    // Find current qty to know if it's inc or dec
    const item = cartItems.find((i) => {
      const matchProduct =
        i.product?._id === productId || i.product === productId;
      const matchVariant = variantId ? i.variant === variantId : !i.variant;
      return matchProduct && matchVariant;
    });
    if (!item) return;
    const itemId = item._id;

    const delta = newQty - item.quantity;
    if (delta === 0) return;

    // Optimistic UI update
    const updated = cartItems.map((cartItem) =>
      cartItem._id === itemId ? { ...cartItem, quantity: newQty } : cartItem,
    );
    dispatch(setItems(updated));

    try {
      if (delta > 0) {
        // Increment
        for (let i = 0; i < delta; i++) {
          await handleIncrementCartItem({ productId, variantId });
        }
      } else {
        // Decrement
        for (let i = 0; i < Math.abs(delta); i++) {
          await handleDecrementCartItem({ productId, variantId });
        }
      }
    } catch (err) {
      console.error(err);
      // Revert on error (could be refetched by handleGetCart again as a fallback)
      handleGetCart();
    }
  };

  return (
    <>
      <FontLink />
      <div
        style={{
          minHeight: "100vh",
          backgroundColor: "#fbf9f6",
          fontFamily: "'Inter', sans-serif",
          color: "#0d0d0b",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Loading */}
        {isLoading && <LoadingSkeleton />}

        {/* Empty cart */}
        {!isLoading && cartItems.length === 0 && (
          <EmptyCart navigate={navigate} />
        )}

        {/* Cart content */}
        {!isLoading && cartItems.length > 0 && (
          <main
            style={{
              maxWidth: "1200px",
              margin: "0 auto",
              padding: "48px 32px 96px",
              width: "100%",
              boxSizing: "border-box",
              flex: 1,
            }}
          >
            {/* Page header */}
            <div
              style={{
                opacity: visible ? 1 : 0,
                transform: visible ? "translateY(0)" : "translateY(16px)",
                transition: "opacity 0.55s ease, transform 0.55s ease",
                marginBottom: "40px",
              }}
            >
              {/* Breadcrumb */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  marginBottom: "16px",
                }}
              >
                <button
                  onClick={() => navigate("/")}
                  style={{
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    fontSize: "0.6rem",
                    letterSpacing: "0.2em",
                    textTransform: "uppercase",
                    color: "#6b6158",
                    fontFamily: "'Inter', sans-serif",
                    padding: 0,
                  }}
                >
                  Collection
                </button>
                <span style={{ fontSize: "0.6rem", color: "#d0c5b5" }}>/</span>
                <span
                  style={{
                    fontSize: "0.6rem",
                    letterSpacing: "0.2em",
                    textTransform: "uppercase",
                    color: "#3d342c",
                    fontFamily: "'Inter', sans-serif",
                  }}
                >
                  Your Bag
                </span>
              </div>

              <h1
                style={{
                  margin: 0,
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: "clamp(2rem, 5vw, 3.2rem)",
                  fontWeight: 300,
                  lineHeight: 1.08,
                  color: "#0d0d0b",
                }}
              >
                Your Bag
              </h1>
              <p
                style={{
                  margin: "8px 0 0",
                  fontSize: "0.7rem",
                  color: "#6b6158",
                  fontFamily: "'Inter', sans-serif",
                  fontWeight: 300,
                }}
              >
                {cartItems.length} {cartItems.length === 1 ? "item" : "items"}{" "}
                selected
              </p>
            </div>

            {/* Two-column layout */}
            <div
              style={{
                display: "flex",
                gap: "48px",
                alignItems: "flex-start",
                flexWrap: "wrap",
              }}
            >
              {/* LEFT: Cart items list */}
              <div style={{ flex: 1, minWidth: "280px" }}>
                {/* Column header */}
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr auto",
                    paddingBottom: "12px",
                    borderBottom: "1px solid #e4e2df",
                    opacity: visible ? 1 : 0,
                    transition: "opacity 0.5s ease 0.15s",
                  }}
                >
                  <span
                    style={{
                      fontSize: "0.55rem",
                      letterSpacing: "0.2em",
                      textTransform: "uppercase",
                      color: "#6b6158",
                      fontFamily: "'Inter', sans-serif",
                    }}
                  >
                    Product
                  </span>
                  <span
                    style={{
                      fontSize: "0.55rem",
                      letterSpacing: "0.2em",
                      textTransform: "uppercase",
                      color: "#6b6158",
                      fontFamily: "'Inter', sans-serif",
                    }}
                  >
                    Total
                  </span>
                </div>

                {/* Items */}
                {cartItems.map((item, idx) => (
                  <CartItemRow
                    key={item._id}
                    item={item}
                    idx={idx}
                    onRemove={handleRemove}
                    removing={removingIds.has(item._id)}
                    onQtyChange={handleQtyChange}
                  />
                ))}
              </div>

              {/* RIGHT: Order summary */}
              <OrderSummary cartItems={cartItems} visible={visible} />
            </div>
          </main>
        )}

        {/* Footer */}
        <footer
          style={{
            borderTop: "1px solid #e4e2df",
            maxWidth: "1200px",
            width: "100%",
            margin: "0 auto",
            padding: "40px 32px",
            boxSizing: "border-box",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "16px",
          }}
        >
          <span
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: "0.9rem",
              letterSpacing: "0.35em",
              textTransform: "uppercase",
              color: "#C9A96E",
            }}
          >
            Snitch
          </span>
          <p
            style={{
              margin: 0,
              fontSize: "0.6rem",
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              color: "#6b6158",
              fontFamily: "'Inter', sans-serif",
            }}
          >
            © {new Date().getFullYear()} Snitch — All rights reserved
          </p>
        </footer>
      </div>
    </>
  );
};

export default Cart;
