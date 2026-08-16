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
    className="w-12 h-12 block"
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
    <div className="absolute top-1/2 left-1/2 pointer-events-none">
      {dots.map((d, i) => (
        <div
          key={i}
          className="absolute rounded-full"
          style={{
            width: d.size,
            height: d.size,
            backgroundColor:
              i % 3 === 0 ? "#C9A96E" : i % 3 === 1 ? "#e4d5b7" : "#3d342c",
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
  <div className="flex items-center">
    <div className="flex flex-col items-center gap-1.5">
      <div
        className={`w-7 h-7 rounded-full flex items-center justify-center transition-all duration-300 ${
          done
            ? "bg-[#C9A96E] border-none"
            : active
              ? "border border-[#C9A96E] bg-[#C9A96E]/10"
              : "border border-[#d5cfc8] dark:border-[#38332e] bg-transparent"
        }`}
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
            className={`w-1.5 h-1.5 rounded-full ${
              active ? "bg-[#C9A96E]" : "bg-[#d5cfc8] dark:bg-[#38332e]"
            }`}
          />
        )}
      </div>
      <span
        className={`text-[0.5rem] tracking-[0.15em] uppercase font-sans whitespace-nowrap ${
          done || active
            ? "text-[#3d342c] dark:text-[#fbf9f6] font-medium"
            : "text-[#a09890] dark:text-[#78716c] font-normal"
        }`}
      >
        {label}
      </span>
    </div>
    {!isLast && (
      <div
        className={`w-10 sm:w-14 h-[1px] mx-1 -mt-4 transition-colors duration-500 ${
          done ? "bg-[#C9A96E]" : "bg-[#e4e2df] dark:bg-[#292522]"
        }`}
      />
    )}
  </div>
);

/* ── Info row ───────────────────────────────────────────────────── */
const InfoRow = ({ label, value, mono }) => (
  <div className="flex justify-between items-center py-3 border-b border-[#f0ede9] dark:border-[#292522]">
    <span className="text-[0.6rem] tracking-[0.12em] uppercase text-[#a09890] dark:text-[#78716c] font-medium font-sans">
      {label}
    </span>
    <span
      className={`text-xs font-medium text-[#1a1410] dark:text-[#fbf9f6] ${
        mono ? "font-mono tracking-wider" : "font-sans"
      }`}
    >
      {value}
    </span>
  </div>
);

/* ── Order Item Row ───────────────────────────────────────────── */
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
  const fmt = (val) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: currency || "INR",
    }).format(val);

  return (
    <div className="flex gap-4 py-3 border-b border-[#f0ede9] dark:border-[#292522]">
      <div className="w-14 h-16 bg-[#f0ede9] dark:bg-[#1f1c19] rounded overflow-hidden flex-shrink-0 border border-[#e8e2d8] dark:border-[#292522]">
        {thumb && (
          <img
            src={thumb}
            alt={product.title}
            className="w-full h-full object-cover"
          />
        )}
      </div>
      <div className="flex-1 flex flex-col justify-between">
        <h4
          className="m-0 text-sm md:text-base font-light text-[#1a1410] dark:text-[#fbf9f6] leading-snug"
          style={{ fontFamily: "'Cormorant Garamond', serif" }}
        >
          {product.title}
        </h4>
        {variantAttrs && (
          <p className="m-0 text-[0.6rem] text-[#6b6158] dark:text-[#a8a29e] uppercase font-sans">
            {variantAttrs}
          </p>
        )}
        <div className="flex justify-between items-center mt-1 font-sans">
          <span className="text-xs text-[#6b6158] dark:text-[#a8a29e]">
            Qty: {qty}
          </span>
          <span className="text-xs font-semibold text-[#1a1410] dark:text-[#fbf9f6]">
            {fmt(price * qty)}
          </span>
        </div>
      </div>
    </div>
  );
};

/* ── Main OrderSuccess ─────────────────────────────────────────── */
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

  const fmt = (val) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: summary.currency || "INR",
    }).format(val || 0);

  return (
    <>
      <FontLink />

      {/* ── Page background ── */}
      <div className="min-h-screen bg-[#fbf9f6] dark:bg-[#0a0908] text-[#0d0d0b] dark:text-[#fbf9f6] transition-colors duration-300 font-sans flex flex-col items-center justify-center p-6 sm:p-10">
        {/* ── Hero card ── */}
        <div className="w-full max-w-[520px]">
          {/* ── Icon block ── */}
          <div className="flex flex-col items-center mb-10 relative">
            {/* Ambient glow ring */}
            <div
              className={`absolute w-36 h-36 rounded-full transition-transform duration-1000 ${
                checkVisible ? "scale-100" : "scale-0"
              }`}
              style={{
                background:
                  "radial-gradient(circle, rgba(201,169,110,0.2) 0%, transparent 70%)",
              }}
            />

            {/* Particles */}
            <Particles visible={particleVisible} />

            {/* Check circle */}
            <div
              className={`w-20 h-20 rounded-full bg-white dark:bg-[#141210] border border-[#e8e2d8] dark:border-[#292522] flex items-center justify-center shadow-lg relative z-10 transition-transform duration-700 ${
                checkVisible ? "scale-100" : "scale-50"
              }`}
            >
              <AnimatedCheck visible={checkVisible} />
            </div>

            {/* Headline */}
            <div
              className={`mt-7 text-center transition-all duration-700 ${
                contentVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-4"
              }`}
            >
              <h1
                className="m-0 mb-2 text-3xl sm:text-4xl font-light text-[#1a1410] dark:text-white"
                style={{ fontFamily: "'Cormorant Garamond', serif" }}
              >
                Order Confirmed
              </h1>
              <p className="m-0 text-xs text-[#7a6e65] dark:text-[#a8a29e] leading-relaxed font-light">
                Thank you for shopping with Luxurisen.
                <br />
                Your order is being prepared with utmost care.
              </p>
            </div>
          </div>

          {/* ── Step tracker ── */}
          <div
            className={`flex justify-center items-start mb-8 transition-all duration-700 ${
              contentVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-4"
            }`}
          >
            <Step label="Order Placed" done active={false} isLast={false} />
            <Step label="Processing" done={false} active isLast={false} />
            <Step label="Shipped" done={false} active={false} isLast={false} />
            <Step label="Delivered" done={false} active={false} isLast />
          </div>

          {/* ── Details card ── */}
          <div
            className={`bg-white dark:bg-[#141210] border border-[#e8e2d8] dark:border-[#292522] rounded-lg p-6 sm:p-8 mb-6 shadow-sm transition-all duration-700 ${
              contentVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-4"
            }`}
          >
            <p className="m-0 mb-4 text-[0.55rem] tracking-[0.3em] uppercase text-[#a09890] dark:text-[#78716c] font-medium">
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
              <div className="mt-6 mb-2">
                <p className="m-0 mb-3 text-[0.55rem] tracking-[0.3em] uppercase text-[#a09890] dark:text-[#78716c] font-medium">
                  Items In Package ({cartItems.length})
                </p>
                <div className="border-t border-[#f0ede9] dark:border-[#292522]">
                  {cartItems.map((item, i) => (
                    <OrderItemRow
                      key={item._id || i}
                      item={item}
                      currency={summary.currency}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Price Summary */}
            {summary.total !== undefined && (
              <div className="mt-4 border-t border-[#e8e2d8] dark:border-[#292522] pt-2">
                <InfoRow label="Subtotal" value={fmt(summary.subtotal)} />
                {summary.couponDiscount > 0 && (
                  <InfoRow
                    label="Discount"
                    value={`-${fmt(summary.couponDiscount)}`}
                  />
                )}
                <InfoRow
                  label="Shipping"
                  value={summary.shipping === 0 ? "Free" : fmt(summary.shipping)}
                />
                <div className="flex justify-between items-center mt-3 pt-3 border-t border-dashed border-[#e8e2d8] dark:border-[#292522]">
                  <span className="text-[0.65rem] tracking-[0.15em] uppercase font-semibold text-[#1a1410] dark:text-[#fbf9f6]">
                    Total Paid
                  </span>
                  <span className="text-base font-semibold text-[#1a1410] dark:text-[#C9A96E]">
                    {fmt(summary.total)}
                  </span>
                </div>
              </div>
            )}

            {/* Confirmation note */}
            <div className="mt-5 p-3.5 bg-[#C9A96E]/10 border border-[#C9A96E]/30 rounded flex gap-2.5 items-start">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="#C9A96E"
                className="w-4 h-4 flex-shrink-0 mt-0.5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75"
                />
              </svg>
              <p className="m-0 text-xs text-[#6b5e50] dark:text-[#d6d3d1] leading-relaxed font-light">
                A confirmation receipt has been generated. You will receive
                tracking updates as your items move through delivery.
              </p>
            </div>
          </div>

          {/* ── CTA buttons ── */}
          <div
            className={`flex flex-col gap-3 transition-all duration-700 ${
              contentVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-4"
            }`}
          >
            <button
              onClick={() => navigate("/")}
              className="w-full py-4 bg-[#0d0d0b] dark:bg-[#fbf9f6] text-[#fbf9f6] dark:text-[#0d0d0b] text-[0.65rem] tracking-[0.25em] uppercase font-semibold rounded-full hover:bg-[#C9A96E] hover:text-[#0d0d0b] dark:hover:bg-[#C9A96E] dark:hover:text-[#0d0d0b] transition-all cursor-pointer shadow-sm"
            >
              Continue Shopping
            </button>

            <button
              onClick={() => navigate("/orders")}
              className="w-full py-3.5 bg-transparent text-[#3d342c] dark:text-[#d6d3d1] border border-[#d5cfc8] dark:border-[#38332e] text-[0.65rem] tracking-[0.25em] uppercase font-semibold rounded-full hover:border-[#0d0d0b] dark:hover:border-white hover:text-[#0d0d0b] dark:hover:text-white transition-all cursor-pointer"
            >
              View Order History
            </button>
          </div>

          {/* ── Brand watermark ── */}
          <p
            className={`text-center mt-8 text-[0.7rem] tracking-[0.3em] uppercase text-[#C9A96E] transition-opacity duration-700 ${
              contentVisible ? "opacity-90" : "opacity-0"
            }`}
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            Luxurisen
          </p>
        </div>
      </div>
    </>
  );
};

export default OrderSuccess;