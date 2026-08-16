import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useOrders } from "../hooks/useOrders";
import LuxurisenFooter from "../../Shared/components/LuxurisenFooter";

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
    currency: currency || "INR",
    maximumFractionDigits: 0,
  }).format(amount);

/* ── Status Badge Component ───────────────────────────────────── */
const StatusBadge = ({ status }) => {
  const s = (status || "pending").toLowerCase();

  if (s === "completed") {
    return (
      <span className="inline-flex items-center px-2.5 py-1 text-[0.55rem] font-medium tracking-[0.14em] uppercase rounded-full border bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/25">
        Confirmed ✓
      </span>
    );
  } else if (s === "failed") {
    return (
      <span className="inline-flex items-center px-2.5 py-1 text-[0.55rem] font-medium tracking-[0.14em] uppercase rounded-full border bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/25">
        Failed
      </span>
    );
  }

  return (
    <span className="inline-flex items-center px-2.5 py-1 text-[0.55rem] font-medium tracking-[0.14em] uppercase rounded-full border bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/25">
      Pending
    </span>
  );
};

/* ── Format ID nicely ─────────────────────────────────────────── */
const formatOrderId = (id) => {
  if (!id) return "—";
  const str = String(id);
  return str.length > 16 ? `${str.slice(0, 8)}…${str.slice(-6)}` : str;
};

/* ── Format Date nicely ───────────────────────────────────────── */
const formatDate = (dateStr) => {
  if (!dateStr) return "Recent Order";
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return "Recent Order";
    return d.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  } catch {
    return "Recent Order";
  }
};

/* ── Order Card ───────────────────────────────────────────────── */
const OrderCard = ({ order, idx }) => {
  const navigate = useNavigate();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), idx * 60 + 50);
    return () => clearTimeout(t);
  }, [idx]);

  const items = order.orderItems || [];
  const itemCount = items.reduce((acc, it) => acc + (it.quantity || 1), 0);
  const totalAmount = order.price?.amount || 0;
  const currency = order.price?.currency || "INR";
  const dateText = formatDate(order.createdAt);
  const orderIdText = formatOrderId(order.razorpay?.orderId || order._id);

  const previewImages = items
    .map((it) => it.images?.[0]?.url)
    .filter(Boolean)
    .slice(0, 4);

  return (
    <div
      onClick={() => navigate(`/orders/${order._id}`)}
      className="group relative bg-white dark:bg-[#141210] border border-[#e8e2d8] dark:border-[#292522] p-6 sm:p-7 rounded-lg cursor-pointer transition-all duration-300 hover:border-[#C9A96E] dark:hover:border-[#C9A96E] hover:shadow-lg shadow-sm"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(16px)",
        transition: `opacity 0.5s ease ${idx * 0.05}s, transform 0.5s ease ${idx * 0.05}s, border-color 0.3s, box-shadow 0.3s`,
      }}
    >
      {/* Top row: ID, Date, Status */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-[#f0ede9] dark:border-[#292522]">
        <div className="flex items-center gap-3">
          <div>
            <span className="text-[0.55rem] tracking-[0.2em] uppercase block text-[#a09890] dark:text-[#78716c] font-medium font-sans">
              Order ID
            </span>
            <span className="text-[0.8rem] font-medium text-[#1a1410] dark:text-[#fbf9f6] tracking-[0.03em] font-mono">
              {orderIdText}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right">
            <span className="text-[0.55rem] tracking-[0.2em] uppercase block text-[#a09890] dark:text-[#78716c] font-medium font-sans">
              Date Placed
            </span>
            <span className="text-[0.75rem] font-medium text-[#3d342c] dark:text-[#d6d3d1] font-sans">
              {dateText}
            </span>
          </div>
          <StatusBadge status={order.status} />
        </div>
      </div>

      {/* Middle row: Thumbnail gallery & Item summary */}
      <div className="py-5 flex flex-wrap items-center justify-between gap-4">
        {/* Thumbnails */}
        <div className="flex items-center gap-3 overflow-hidden">
          {previewImages.length > 0 ? (
            <div className="flex items-center gap-2.5">
              {previewImages.map((src, i) => (
                <div
                  key={i}
                  className="w-14 h-16 sm:w-16 sm:h-20 bg-[#f0ede9] dark:bg-[#1f1c19] rounded overflow-hidden flex-shrink-0 border border-[#e8e2d8] dark:border-[#292522]"
                >
                  <img
                    src={src}
                    alt="Product preview"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
              ))}
              {items.length > 4 && (
                <div className="w-14 h-16 sm:w-16 sm:h-20 bg-[#f5f3f0] dark:bg-[#1c1916] border border-[#e8e2d8] dark:border-[#292522] rounded flex items-center justify-center flex-shrink-0 text-[0.65rem] text-[#6b6158] dark:text-[#a8a29e] font-medium">
                  +{items.length - 4}
                </div>
              )}
            </div>
          ) : (
            <div className="w-14 h-16 sm:w-16 sm:h-20 bg-[#f0ede9] dark:bg-[#1f1c19] rounded flex items-center justify-center text-[#a09890]">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                className="w-6 h-6 stroke-[1.2]"
              >
                <path d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Z" />
              </svg>
            </div>
          )}

          <div className="flex flex-col gap-1 min-w-[120px]">
            <p className="text-xs sm:text-sm text-[#1a1410] dark:text-[#fbf9f6] font-medium m-0 line-clamp-1 font-sans">
              {items[0]?.title || "Purchased Items"}
            </p>
            <p className="text-[0.65rem] text-[#7a6e65] dark:text-[#a8a29e] m-0 font-sans">
              {itemCount} {itemCount === 1 ? "item" : "items"} in package
            </p>
          </div>
        </div>

        {/* Total & Action link */}
        <div className="flex items-center gap-6 self-end sm:self-auto">
          <div className="text-right">
            <span className="text-[0.55rem] tracking-[0.2em] uppercase block text-[#a09890] dark:text-[#78716c] font-medium font-sans">
              Total
            </span>
            <span className="text-base font-semibold text-[#1a1410] dark:text-[#fbf9f6] font-sans">
              {fmt(totalAmount, currency)}
            </span>
          </div>

          <div className="flex items-center gap-1 text-[0.65rem] font-medium tracking-[0.15em] uppercase text-[#1a1410] dark:text-[#fbf9f6] group-hover:text-[#C9A96E] dark:group-hover:text-[#C9A96E] transition-colors duration-200 font-sans">
            <span>Details</span>
            <svg
              viewBox="0 0 20 20"
              fill="currentColor"
              className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1"
            >
              <path
                fillRule="evenodd"
                d="M3 10a.75.75 0 0 1 .75-.75h10.638L10.23 5.29a.75.75 0 1 1 1.04-1.08l5.5 5.25a.75.75 0 0 1 0 1.08l-5.5 5.25a.75.75 0 1 1-1.04-1.08l4.158-3.96H3.75A.75.75 0 0 1 3 10Z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ── OrderList Main Page ──────────────────────────────────────── */
const OrderList = () => {
  const navigate = useNavigate();
  const { handleGetOrders, loading, error } = useOrders();
  const [orders, setOrders] = useState([]);
  const [pageLoaded, setPageLoaded] = useState(false);

  useEffect(() => {
    handleGetOrders()
      .then((res) => {
        setOrders(res || []);
      })
      .catch((err) => {
        console.error(err);
      })
      .finally(() => {
        setPageLoaded(true);
      });
  }, []);

  return (
    <>
      <FontLink />
      <div className="min-h-screen bg-[#fbf9f6] dark:bg-[#0a0908] text-[#0d0d0b] dark:text-[#fbf9f6] transition-colors duration-300 flex flex-col justify-between font-sans">
        <div className="max-w-[1100px] w-full mx-auto px-6 sm:px-8 pt-10 pb-20 flex-1">
          {/* Header section */}
          <div className="mb-10 pb-6 border-b border-[#e8e2d8] dark:border-[#292522]">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="text-[0.6rem] tracking-[0.25em] uppercase font-medium mb-1 text-[#C9A96E]">
                  Client Archive
                </p>
                <h1
                  className="m-0 font-light text-3xl sm:text-5xl text-[#0d0d0b] dark:text-white leading-tight"
                  style={{ fontFamily: "'Cormorant Garamond', serif" }}
                >
                  Order History
                </h1>
              </div>
              <p className="text-xs text-[#7a6e65] dark:text-[#a8a29e] font-light max-w-[340px] leading-relaxed">
                Review your acquired pieces, verification records, and delivery
                tracking.
              </p>
            </div>
          </div>

          {/* Loading state */}
          {loading && !pageLoaded && (
            <div className="flex flex-col gap-4">
              {[1, 2, 3].map((n) => (
                <div
                  key={n}
                  className="bg-white dark:bg-[#141210] border border-[#e8e2d8] dark:border-[#292522] p-6 rounded-lg animate-pulse h-36 flex flex-col justify-between"
                >
                  <div className="flex justify-between">
                    <div className="w-36 h-4 bg-[#f0ede9] dark:bg-[#1f1c19] rounded" />
                    <div className="w-20 h-4 bg-[#f0ede9] dark:bg-[#1f1c19] rounded" />
                  </div>
                  <div className="flex gap-3">
                    <div className="w-14 h-16 bg-[#f0ede9] dark:bg-[#1f1c19] rounded" />
                    <div className="w-14 h-16 bg-[#f0ede9] dark:bg-[#1f1c19] rounded" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Error banner */}
          {error && !loading && (
            <div className="p-4 mb-6 bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-xs rounded">
              {error}
            </div>
          )}

          {/* Empty state */}
          {!loading && pageLoaded && orders.length === 0 && (
            <div className="bg-white dark:bg-[#141210] border border-[#e8e2d8] dark:border-[#292522] rounded-lg p-12 sm:p-16 text-center flex flex-col items-center justify-center max-w-[620px] mx-auto shadow-sm">
              <div className="w-16 h-16 rounded-full flex items-center justify-center mb-6 bg-[#C9A96E]/10">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#C9A96E"
                  strokeWidth="1.5"
                  className="w-8 h-8"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007Z"
                  />
                </svg>
              </div>

              <h2
                className="text-2xl sm:text-3xl font-light text-[#0d0d0b] dark:text-white m-0 mb-3"
                style={{ fontFamily: "'Cormorant Garamond', serif" }}
              >
                No Orders Placed Yet
              </h2>

              <p className="text-xs text-[#7a6e65] dark:text-[#a8a29e] leading-relaxed max-w-[380px] mb-8 font-light">
                You have not placed any orders yet. Discover our latest seasonal
                edits, curated essentials, and signature silhouettes.
              </p>

              <button
                onClick={() => navigate("/")}
                className="px-8 py-3.5 text-[0.65rem] tracking-[0.22em] uppercase font-semibold bg-[#0d0d0b] dark:bg-[#fbf9f6] text-[#fbf9f6] dark:text-[#0d0d0b] rounded-full transition-all duration-300 hover:bg-[#C9A96E] hover:text-[#0d0d0b] dark:hover:bg-[#C9A96E] dark:hover:text-[#0d0d0b] shadow-sm cursor-pointer"
              >
                Explore Collection
              </button>
            </div>
          )}

          {/* Orders list */}
          {!loading && orders.length > 0 && (
            <div className="flex flex-col gap-5">
              {orders.map((order, idx) => (
                <OrderCard key={order._id} order={order} idx={idx} />
              ))}
            </div>
          )}
        </div>

        <LuxurisenFooter />
      </div>
    </>
  );
};

export default OrderList;
