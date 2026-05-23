import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router";

/* ── Google Font injection ─────────────────────────────────────── */
const FontLink = () => (
  <link
    href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600&family=Inter:wght@300;400;500;600&display=swap"
    rel="stylesheet"
  />
);

/* ── Animated checkmark SVG ────────────────────────────────────── */
const AnimatedCheck = ({ visible }) => (
  <svg
    viewBox="0 0 52 52"
    style={{
      width: 52,
      height: 52,
      display: "block",
    }}
  >
    <circle
      cx="26"
      cy="26"
      r="24"
      fill="none"
      stroke="#C9A96E"
      strokeWidth="2"
      style={{
        strokeDasharray: 166,
        strokeDashoffset: visible ? 0 : 166,
        transition: "stroke-dashoffset 0.8s cubic-bezier(0.65, 0, 0.45, 1)",
      }}
    />
    <path
      fill="none"
      stroke="#C9A96E"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M14 27 l9 9 l16-16"
      style={{
        strokeDasharray: 48,
        strokeDashoffset: visible ? 0 : 48,
        transition:
          "stroke-dashoffset 0.5s cubic-bezier(0.65, 0, 0.45, 1) 0.7s",
      }}
    />
  </svg>
);

/* ── Subtle particle dots ───────────────────────────────────────── */
const Particles = ({ visible }) => {
  const dots = Array.from({ length: 12 }, (_, i) => {
    const angle = (i / 12) * 360;
    const distance = 90 + Math.random() * 40;
    const rad = (angle * Math.PI) / 180;
    const x = Math.cos(rad) * distance;
    const y = Math.sin(rad) * distance;
    const size = 3 + Math.random() * 4;
    const delay = Math.random() * 0.4;
    return { x, y, size, delay, angle };
  });

  return (
    <div
      style={{
        position: "absolute",
        top: "50%",
        left: "50%",
        pointerEvents: "none",
      }}
    >
      {dots.map((d, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            width: d.size,
            height: d.size,
            borderRadius: "50%",
            backgroundColor: i % 3 === 0 ? "#C9A96E" : i % 3 === 1 ? "#e4d5b7" : "#3d342c",
            transform: visible
              ? `translate(calc(${d.x}px - 50%), calc(${d.y}px - 50%)) scale(1)`
              : `translate(-50%, -50%) scale(0)`,
            opacity: visible ? 0 : 1,
            transition: `transform 0.9s cubic-bezier(0.25, 0.46, 0.45, 0.94) ${d.delay}s, opacity 0.6s ease ${0.5 + d.delay}s`,
          }}
        />
      ))}
    </div>
  );
};

/* ── Step tracker ───────────────────────────────────────────────── */
const Step = ({ label, done, active, isLast }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 0 }}>
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
      <div
        style={{
          width: 28,
          height: 28,
          borderRadius: "50%",
          border: done
            ? "none"
            : active
            ? "1.5px solid #C9A96E"
            : "1.5px solid #d5cfc8",
          backgroundColor: done ? "#C9A96E" : active ? "rgba(201,169,110,0.08)" : "transparent",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transition: "all 0.4s ease",
        }}
      >
        {done ? (
          <svg viewBox="0 0 16 16" width={12} height={12} fill="none">
            <path
              d="M3 8.5l3.5 3.5 6.5-7"
              stroke="#fff"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        ) : (
          <div
            style={{
              width: 6,
              height: 6,
              borderRadius: "50%",
              backgroundColor: active ? "#C9A96E" : "#d5cfc8",
            }}
          />
        )}
      </div>
      <span
        style={{
          fontSize: "0.5rem",
          letterSpacing: "0.15em",
          textTransform: "uppercase",
          fontFamily: "'Inter', sans-serif",
          color: done || active ? "#3d342c" : "#a09890",
          fontWeight: done || active ? 500 : 400,
          whiteSpace: "nowrap",
        }}
      >
        {label}
      </span>
    </div>
    {!isLast && (
      <div
        style={{
          width: 60,
          height: 1,
          backgroundColor: done ? "#C9A96E" : "#e4e2df",
          margin: "0 4px",
          marginBottom: 20,
          transition: "background-color 0.6s ease",
        }}
      />
    )}
  </div>
);

/* ── Info row ───────────────────────────────────────────────────── */
const InfoRow = ({ label, value, mono }) => (
  <div
    style={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "12px 0",
      borderBottom: "1px solid #f0ede9",
    }}
  >
    <span
      style={{
        fontSize: "0.6rem",
        letterSpacing: "0.12em",
        textTransform: "uppercase",
        color: "#a09890",
        fontFamily: "'Inter', sans-serif",
      }}
    >
      {label}
    </span>
    <span
      style={{
        fontSize: "0.75rem",
        fontFamily: mono ? "'Courier New', monospace" : "'Inter', sans-serif",
        color: "#1a1410",
        fontWeight: 500,
        letterSpacing: mono ? "0.04em" : "normal",
      }}
    >
      {value}
    </span>
  </div>
);

/* ── Main page ─────────────────────────────────────────────────── */
const OrderItemRow = ({ item, currency }) => {
  const product = item.product || {};
  const thumb = product.images?.[0]?.url;
  let variantAttrs = "";
  if (item.variant && Array.isArray(product.variants)) {
    const v = product.variants.find((v) => v._id === item.variant);
    if (v) {
      variantAttrs = Object.entries(v.attributes || {})
        .map(([k, val]) => `${val}`)
        .join(" / ");
    }
  }

  const price = item.price?.amount || product.price?.amount || 0;
  const qty = item.quantity || 1;

  const fmt = (val) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: currency || 'INR' }).format(val);

  return (
    <div style={{ display: 'flex', gap: '16px', padding: '12px 0', borderBottom: '1px solid #f0ede9' }}>
      <div style={{ width: '64px', height: '80px', backgroundColor: '#f0ede9', borderRadius: '2px', overflow: 'hidden', flexShrink: 0 }}>
        {thumb && <img src={thumb} alt={product.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
      </div>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '4px' }}>
        <h4 style={{ margin: 0, fontFamily: "'Cormorant Garamond', serif", fontSize: '1rem', fontWeight: 400, color: '#1a1410' }}>
          {product.title}
        </h4>
        {variantAttrs && (
          <p style={{ margin: 0, fontSize: '0.6rem', color: '#6b6158', fontFamily: "'Inter', sans-serif", textTransform: 'uppercase' }}>
            {variantAttrs}
          </p>
        )}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto' }}>
          <span style={{ fontSize: '0.65rem', color: '#6b6158', fontFamily: "'Inter', sans-serif" }}>Qty: {qty}</span>
          <span style={{ fontSize: '0.75rem', color: '#1a1410', fontFamily: "'Inter', sans-serif", fontWeight: 500 }}>
            {fmt(price * qty)}
          </span>
        </div>
      </div>
    </div>
  );
};

const OrderSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { state } = location;
  const { cartItems = [], summary = {} } = state || {};

  const queryParams = new URLSearchParams(location.search);
  const orderId = queryParams.get("order_id");

  const [checkVisible, setCheckVisible] = useState(false);
  const [contentVisible, setContentVisible] = useState(false);
  const [particleVisible, setParticleVisible] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setParticleVisible(true), 200);
    const t2 = setTimeout(() => setCheckVisible(true), 300);
    const t3 = setTimeout(() => setContentVisible(true), 700);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, []);

  // Format orderId nicely
  const displayId = orderId
    ? orderId.length > 20
      ? `${orderId.slice(0, 10)}…${orderId.slice(-8)}`
      : orderId
    : "—";

  const estimatedDate = (() => {
    const d = new Date();
    d.setDate(d.getDate() + 5);
    return d.toLocaleDateString("en-IN", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  })();

  return (
    <>
      <FontLink />

      {/* ── Page background ── */}
      <div
        style={{
          minHeight: "100vh",
          backgroundColor: "#fbf9f6",
          fontFamily: "'Inter', sans-serif",
          color: "#0d0d0b",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "40px 20px",
        }}
      >
        {/* ── Hero card ── */}
        <div
          style={{
            width: "100%",
            maxWidth: 520,
            opacity: 1,
          }}
        >
          {/* ── Icon block ── */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              marginBottom: 48,
              position: "relative",
            }}
          >
            {/* Ambient glow ring */}
            <div
              style={{
                position: "absolute",
                width: 140,
                height: 140,
                borderRadius: "50%",
                background:
                  "radial-gradient(circle, rgba(201,169,110,0.18) 0%, transparent 70%)",
                transform: checkVisible ? "scale(1)" : "scale(0)",
                transition: "transform 1s cubic-bezier(0.34, 1.56, 0.64, 1) 0.2s",
              }}
            />

            {/* Particles */}
            <Particles visible={particleVisible} />

            {/* Check circle */}
            <div
              style={{
                width: 80,
                height: 80,
                borderRadius: "50%",
                backgroundColor: "#fff",
                border: "1px solid #e8e2d8",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 4px 24px rgba(201,169,110,0.12), 0 1px 4px rgba(0,0,0,0.04)",
                position: "relative",
                zIndex: 1,
                transform: checkVisible ? "scale(1)" : "scale(0.6)",
                transition:
                  "transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) 0.2s",
              }}
            >
              <AnimatedCheck visible={checkVisible} />
            </div>

            {/* Headline */}
            <div
              style={{
                marginTop: 28,
                textAlign: "center",
                opacity: contentVisible ? 1 : 0,
                transform: contentVisible ? "translateY(0)" : "translateY(12px)",
                transition: "opacity 0.6s ease, transform 0.6s ease",
              }}
            >
              <h1
                style={{
                  margin: "0 0 8px",
                  fontSize: "clamp(1.4rem, 4vw, 1.9rem)",
                  fontWeight: 500,
                  letterSpacing: "0.04em",
                  color: "#1a1410",
                  fontFamily: "'Cormorant Garamond', serif",
                }}
              >
                Order Confirmed
              </h1>
              <p
                style={{
                  margin: 0,
                  fontSize: "0.72rem",
                  color: "#7a6e65",
                  letterSpacing: "0.06em",
                  fontFamily: "'Inter', sans-serif",
                  lineHeight: 1.6,
                }}
              >
                Thank you for shopping with Snitch.
                <br />
                Your order is on its way.
              </p>
            </div>
          </div>

          {/* ── Step tracker ── */}
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "flex-start",
              marginBottom: 40,
              opacity: contentVisible ? 1 : 0,
              transform: contentVisible ? "translateY(0)" : "translateY(10px)",
              transition: "opacity 0.6s ease 0.1s, transform 0.6s ease 0.1s",
            }}
          >
            <Step label="Order Placed" done active={false} isLast={false} />
            <Step label="Processing" done={false} active isLast={false} />
            <Step label="Shipped" done={false} active={false} isLast={false} />
            <Step label="Delivered" done={false} active={false} isLast />
          </div>

          {/* ── Details card ── */}
          <div
            style={{
              backgroundColor: "#fff",
              border: "1px solid #e8e2d8",
              borderRadius: 4,
              padding: "28px 32px",
              marginBottom: 24,
              opacity: contentVisible ? 1 : 0,
              transform: contentVisible ? "translateY(0)" : "translateY(10px)",
              transition: "opacity 0.6s ease 0.15s, transform 0.6s ease 0.15s",
            }}
          >
            <p
              style={{
                margin: "0 0 16px",
                fontSize: "0.55rem",
                letterSpacing: "0.3em",
                textTransform: "uppercase",
                color: "#a09890",
                fontFamily: "'Inter', sans-serif",
              }}
            >
              Order Details
            </p>

            {orderId && (
              <InfoRow label="Order ID" value={displayId} mono />
            )}
            <InfoRow label="Status" value="Confirmed ✓" />
            <InfoRow label="Estimated Delivery" value={estimatedDate} />
            {!summary.total && (
              <InfoRow label="Shipping" value="Standard — Free" />
            )}

            {/* Items Summary */}
            {cartItems.length > 0 && (
              <div style={{ marginTop: '24px', marginBottom: '8px' }}>
                <p
                  style={{
                    margin: "0 0 12px",
                    fontSize: "0.55rem",
                    letterSpacing: "0.3em",
                    textTransform: "uppercase",
                    color: "#a09890",
                    fontFamily: "'Inter', sans-serif",
                  }}
                >
                  Items
                </p>
                <div style={{ borderTop: '1px solid #f0ede9' }}>
                  {cartItems.map((item) => (
                    <OrderItemRow key={item._id || Math.random()} item={item} currency={summary.currency} />
                  ))}
                </div>
              </div>
            )}

            {/* Price Summary */}
            {summary.total !== undefined && (
              <div style={{ marginTop: '16px', borderTop: '1px solid #e8e2d8', paddingTop: '8px' }}>
                <InfoRow label="Subtotal" value={new Intl.NumberFormat('en-IN', { style: 'currency', currency: summary.currency || 'INR' }).format(summary.subtotal)} />
                {summary.couponDiscount > 0 && (
                  <InfoRow label="Discount" value={`-${new Intl.NumberFormat('en-IN', { style: 'currency', currency: summary.currency || 'INR' }).format(summary.couponDiscount)}`} />
                )}
                <InfoRow label="Shipping" value={summary.shipping === 0 ? "Free" : new Intl.NumberFormat('en-IN', { style: 'currency', currency: summary.currency || 'INR' }).format(summary.shipping)} />
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '12px', paddingTop: '16px', borderTop: '1px dashed #e8e2d8' }}>
                  <span style={{ fontSize: '0.65rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#1a1410', fontFamily: "'Inter', sans-serif", fontWeight: 600 }}>Total</span>
                  <span style={{ fontSize: '0.9rem', color: '#1a1410', fontFamily: "'Inter', sans-serif", fontWeight: 600 }}>{new Intl.NumberFormat('en-IN', { style: 'currency', currency: summary.currency || 'INR' }).format(summary.total)}</span>
                </div>
              </div>
            )}

            {/* Confirmation note */}
            <div
              style={{
                marginTop: 20,
                padding: "12px 14px",
                backgroundColor: "rgba(201,169,110,0.06)",
                border: "1px dashed rgba(201,169,110,0.35)",
                borderRadius: 2,
                display: "flex",
                gap: 10,
                alignItems: "flex-start",
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="#C9A96E"
                style={{ width: 15, height: 15, flexShrink: 0, marginTop: 1 }}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75"
                />
              </svg>
              <p
                style={{
                  margin: 0,
                  fontSize: "0.65rem",
                  color: "#6b5e50",
                  fontFamily: "'Inter', sans-serif",
                  lineHeight: 1.6,
                  letterSpacing: "0.02em",
                }}
              >
                A confirmation email has been sent to your registered address.
                You'll receive tracking updates once your order ships.
              </p>
            </div>
          </div>

          {/* ── CTA buttons ── */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 12,
              opacity: contentVisible ? 1 : 0,
              transform: contentVisible ? "translateY(0)" : "translateY(10px)",
              transition: "opacity 0.6s ease 0.2s, transform 0.6s ease 0.2s",
            }}
          >
            <button
              onClick={() => navigate("/")}
              style={{
                width: "100%",
                padding: "14px 0",
                backgroundColor: "#1a1410",
                color: "#fbf9f6",
                border: "none",
                borderRadius: 2,
                cursor: "pointer",
                fontSize: "0.6rem",
                letterSpacing: "0.25em",
                textTransform: "uppercase",
                fontFamily: "'Inter', sans-serif",
                fontWeight: 500,
                transition: "background-color 0.2s ease, transform 0.15s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "#3d342c";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "#1a1410";
              }}
              onMouseDown={(e) => {
                e.currentTarget.style.transform = "scale(0.985)";
              }}
              onMouseUp={(e) => {
                e.currentTarget.style.transform = "scale(1)";
              }}
            >
              Continue Shopping
            </button>

            <button
              onClick={() => navigate("/cart")}
              style={{
                width: "100%",
                padding: "13px 0",
                backgroundColor: "transparent",
                color: "#3d342c",
                border: "1px solid #d5cfc8",
                borderRadius: 2,
                cursor: "pointer",
                fontSize: "0.6rem",
                letterSpacing: "0.25em",
                textTransform: "uppercase",
                fontFamily: "'Inter', sans-serif",
                fontWeight: 400,
                transition: "border-color 0.2s ease, color 0.2s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "#1a1410";
                e.currentTarget.style.color = "#0d0d0b";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "#d5cfc8";
                e.currentTarget.style.color = "#3d342c";
              }}
            >
              View Cart
            </button>
          </div>

          {/* ── Brand watermark ── */}
          <p
            style={{
              textAlign: "center",
              marginTop: 40,
              fontSize: "0.65rem",
              letterSpacing: "0.3em",
              textTransform: "uppercase",
              fontFamily: "'Cormorant Garamond', serif",
              color: "#C9A96E",
              opacity: contentVisible ? 0.8 : 0,
              transition: "opacity 0.8s ease 0.3s",
            }}
          >
            Snitch
          </p>
        </div>
      </div>
    </>
  );
};

export default OrderSuccess;