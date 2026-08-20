import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import { useOrders } from "../hooks/useOrders";
import { useAuth } from "../../auth/hooks/useAuth";
import LuxurisenFooter from "../../Shared/components/LuxurisenFooter";
import ThemeToggle from "../../Shared/components/ThemeToggle";

/* ── Google Fonts ─────────────────────────────────────────────── */
const FontLink = () => (
  <link
    href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600&family=Inter:wght@300;400;500;600&display=swap"
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

/* ── Status Badge ─────────────────────────────────────────────── */
const StatusBadge = ({ status }) => {
  const s = (status || "pending").toLowerCase();

  if (s === "completed") {
    return (
      <span className="inline-flex items-center px-3 py-1 text-[0.6rem] font-medium tracking-[0.14em] uppercase rounded-full border bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/25">
        Confirmed ✓
      </span>
    );
  } else if (s === "failed") {
    return (
      <span className="inline-flex items-center px-3 py-1 text-[0.6rem] font-medium tracking-[0.14em] uppercase rounded-full border bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/25">
        Payment Failed
      </span>
    );
  }

  return (
    <span className="inline-flex items-center px-3 py-1 text-[0.6rem] font-medium tracking-[0.14em] uppercase rounded-full border bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/25">
      Pending Payment
    </span>
  );
};

/* ── Step Tracker ─────────────────────────────────────────────── */
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
        className={`text-[0.5rem] tracking-[0.15em] uppercase whitespace-nowrap font-sans ${
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

/* ── Info Row ─────────────────────────────────────────────────── */
const InfoRow = ({ label, value, mono, action }) => (
  <div className="flex justify-between items-center py-3 border-b border-[#f0ede9] dark:border-[#292522]">
    <span className="text-[0.6rem] tracking-[0.14em] uppercase text-[#a09890] dark:text-[#78716c] font-medium font-sans">
      {label}
    </span>
    <div className="flex items-center gap-2">
      <span
        className={`text-xs font-medium text-[#1a1410] dark:text-[#fbf9f6] ${
          mono ? "font-mono tracking-wider" : "font-sans"
        }`}
      >
        {value}
      </span>
      {action}
    </div>
  </div>
);

/* ── Seller Order Item Row ────────────────────────────────────── */
const SellerOrderItemRow = ({ item, currency }) => {
  const thumb = item.images?.[0]?.url;
  const price = item.price?.amount || 0;
  const qty = item.quantity || 1;

  return (
    <div className="flex gap-4 py-4 border-b border-[#f0ede9] dark:border-[#292522]">
      <div className="w-16 h-20 bg-[#f0ede9] dark:bg-[#1f1c19] rounded overflow-hidden flex-shrink-0 border border-[#e8e2d8] dark:border-[#292522]">
        {thumb ? (
          <img
            src={thumb}
            alt={item.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-[#a09890]">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              className="w-6 h-6 stroke-1"
            >
              <path d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Z" />
            </svg>
          </div>
        )}
      </div>
      <div className="flex-1 flex flex-col justify-between">
        <div>
          <h4
            className="m-0 text-base font-light text-[#1a1410] dark:text-[#fbf9f6] leading-snug"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            {item.title}
          </h4>
          {item.description && (
            <p className="m-0 mt-0.5 text-[0.62rem] text-[#7a6e65] dark:text-[#a8a29e] line-clamp-1 font-sans">
              {item.description}
            </p>
          )}
        </div>
        <div className="flex justify-between items-center mt-2 font-sans">
          <span className="text-xs text-[#6b6158] dark:text-[#a8a29e]">
            Quantity: {qty} &times; {fmt(price, currency)}
          </span>
          <span className="text-xs font-semibold text-[#1a1410] dark:text-[#fbf9f6]">
            {fmt(price * qty, currency)}
          </span>
        </div>
      </div>
    </div>
  );
};

/* ── SellerOrderDetail Main Component ─────────────────────────── */
const SellerOrderDetail = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { handleLogout } = useAuth();
  const { handleGetSellerOrderDetails, loading, error } = useOrders();
  const [order, setOrder] = useState(null);
  const [pageLoaded, setPageLoaded] = useState(false);

  const onLogoutClick = async () => {
    await handleLogout();
    navigate("/login");
  };

  useEffect(() => {
    if (orderId) {
      handleGetSellerOrderDetails(orderId)
        .then((res) => {
          setOrder(res);
        })
        .catch((err) => {
          console.error("Error fetching seller order detail:", err);
        })
        .finally(() => {
          setPageLoaded(true);
        });
    }
  }, [orderId]);

  const currency = order?.price?.currency || "INR";
  const items = order?.orderItems || [];
  const isCompleted = order?.status === "completed";

  const orderDate = order?.createdAt
    ? new Date(order.createdAt).toLocaleDateString("en-IN", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "—";

  const buyer = order?.buyer || order?.user || {};
  const sellerSubtotal =
    order?.sellerSubtotal ??
    items.reduce(
      (sum, it) => sum + (it.price?.amount || 0) * (it.quantity || 1),
      0
    );

  return (
    <>
      <FontLink />
      <div className="min-h-screen bg-[#fbf9f6] dark:bg-[#0a0908] text-[#0d0d0b] dark:text-[#fbf9f6] transition-colors duration-300 flex flex-col justify-between font-sans">
        <div>
          {/* Header */}
          <header className="sticky top-0 z-40 flex items-center justify-between px-6 sm:px-12 py-4 border-b border-[#e4e2df] dark:border-[#292522] bg-[#fbf9f6]/90 dark:bg-[#0a0908]/90 backdrop-blur-md">
            <span
              className="text-sm tracking-[0.35em] uppercase select-none cursor-pointer text-[#C9A96E]"
              onClick={() => navigate("/")}
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
            >
              Luxurisen
            </span>

            <nav className="hidden md:flex items-center gap-8">
              <button
                onClick={() => navigate("/seller/dashboard")}
                className="text-[10px] tracking-[0.2em] uppercase font-medium text-[#6b6158] dark:text-[#a8a29e] hover:text-[#0d0d0b] dark:hover:text-white transition-colors duration-200 cursor-pointer bg-transparent border-none"
              >
                Products
              </button>
              <button
                onClick={() => navigate("/seller/orders")}
                className="text-[10px] tracking-[0.2em] uppercase font-medium text-[#C9A96E] border-b border-[#C9A96E] pb-0.5 cursor-pointer bg-transparent"
              >
                Customer Orders
              </button>
              <button
                onClick={() => navigate("/seller/create-product")}
                className="text-[10px] tracking-[0.2em] uppercase font-medium text-[#6b6158] dark:text-[#a8a29e] hover:text-[#0d0d0b] dark:hover:text-white transition-colors duration-200 cursor-pointer bg-transparent border-none"
              >
                New Listing
              </button>
            </nav>

            <div className="flex items-center gap-3">
              <ThemeToggle />
              <button
                onClick={onLogoutClick}
                className="flex items-center gap-1.5 px-3 py-2 text-[10px] tracking-[0.18em] uppercase border border-[#e4e2df] dark:border-[#292522] text-[#6b6158] dark:text-[#a8a29e] hover:border-[#0d0d0b] dark:hover:border-white hover:text-[#0d0d0b] dark:hover:text-white rounded-full transition-colors duration-200 cursor-pointer bg-transparent"
              >
                <span>Sign Out</span>
              </button>
            </div>
          </header>

          {/* Main */}
          <main className="max-w-[800px] w-full mx-auto px-6 sm:px-8 pt-8 pb-20 flex-1">
            {/* Back button */}
            <button
              onClick={() => navigate("/seller/orders")}
              className="flex items-center gap-2 mb-8 text-[0.65rem] tracking-[0.18em] uppercase font-medium bg-transparent border-none cursor-pointer text-[#6b6158] dark:text-[#a8a29e] hover:text-[#0d0d0b] dark:hover:text-white transition-colors duration-200"
            >
              <svg
                viewBox="0 0 20 20"
                fill="currentColor"
                className="w-4 h-4 rotate-180"
              >
                <path
                  fillRule="evenodd"
                  d="M3 10a.75.75 0 0 1 .75-.75h10.638L10.23 5.29a.75.75 0 1 1 1.04-1.08l5.5 5.25a.75.75 0 0 1 0 1.08l-5.5 5.25a.75.75 0 1 1-1.04-1.08l4.158-3.96H3.75A.75.75 0 0 1 3 10Z"
                  clipRule="evenodd"
                />
              </svg>
              <span>Back to Customer Orders</span>
            </button>

            {/* Loading state */}
            {loading && !pageLoaded && (
              <div className="bg-white dark:bg-[#141210] border border-[#e8e2d8] dark:border-[#292522] rounded-lg p-8 sm:p-10 animate-pulse flex flex-col gap-6">
                <div className="w-48 h-6 bg-[#f0ede9] dark:bg-[#1f1c19] rounded" />
                <div className="w-full h-12 bg-[#f0ede9] dark:bg-[#1f1c19] rounded" />
                <div className="w-full h-32 bg-[#f0ede9] dark:bg-[#1f1c19] rounded" />
              </div>
            )}

            {/* Error state */}
            {!loading && pageLoaded && (!order || error) && (
              <div className="bg-white dark:bg-[#141210] border border-[#e8e2d8] dark:border-[#292522] rounded-lg p-12 text-center flex flex-col items-center shadow-sm">
                <h2
                  className="text-2xl sm:text-3xl font-light text-[#0d0d0b] dark:text-white m-0 mb-3"
                  style={{ fontFamily: "'Cormorant Garamond', serif" }}
                >
                  Order Record Not Found
                </h2>
                <p className="text-xs text-[#7a6e65] dark:text-[#a8a29e] mb-6 max-w-[360px]">
                  This order could not be located or does not contain items from your catalogue.
                </p>
                <button
                  onClick={() => navigate("/seller/orders")}
                  className="px-7 py-3 text-[0.65rem] tracking-[0.2em] uppercase font-semibold bg-[#0d0d0b] dark:bg-[#fbf9f6] text-[#fbf9f6] dark:text-[#0d0d0b] rounded-full transition-all hover:bg-[#C9A96E] hover:text-[#0d0d0b] dark:hover:bg-[#C9A96E] dark:hover:text-[#0d0d0b] cursor-pointer"
                >
                  View All Orders
                </button>
              </div>
            )}

            {/* Order Content */}
            {!loading && order && (
              <div className="flex flex-col gap-6">
                {/* Title */}
                <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-[#e8e2d8] dark:border-[#292522]">
                  <div>
                    <p className="text-[0.6rem] tracking-[0.25em] uppercase font-medium mb-1 text-[#C9A96E]">
                      Order Fulfillment
                    </p>
                    <h1
                      className="m-0 font-light text-2xl sm:text-4xl text-[#0d0d0b] dark:text-white leading-tight"
                      style={{ fontFamily: "'Cormorant Garamond', serif" }}
                    >
                      Customer Order Details
                    </h1>
                  </div>
                  <StatusBadge status={order.status} />
                </div>

                {/* Status bar */}
                {isCompleted ? (
                  <div className="bg-white dark:bg-[#141210] border border-[#e8e2d8] dark:border-[#292522] rounded-lg p-6 flex justify-center items-center shadow-sm">
                    <Step label="Received" done active={false} isLast={false} />
                    <Step label="Confirmed" done active isLast={false} />
                    <Step label="Processing" done={false} active isLast={false} />
                    <Step label="Dispatched" done={false} active={false} isLast />
                  </div>
                ) : (
                  <div
                    className={`p-4 rounded-lg border flex items-center gap-3 ${
                      order.status === "failed"
                        ? "bg-red-500/10 border-red-500/20 text-red-600 dark:text-red-400"
                        : "bg-amber-500/10 border-amber-500/20 text-amber-700 dark:text-amber-300"
                    }`}
                  >
                    <span className="text-xs font-medium">
                      {order.status === "failed"
                        ? "Payment was unconfirmed for this transaction."
                        : "This customer order is currently awaiting payment completion."}
                    </span>
                  </div>
                )}

                {/* Buyer & Customer Profile Card */}
                <div className="bg-white dark:bg-[#141210] border border-[#e8e2d8] dark:border-[#292522] rounded-lg p-6 sm:p-8 shadow-sm">
                  <p className="m-0 mb-4 text-[0.55rem] tracking-[0.3em] uppercase text-[#a09890] dark:text-[#78716c] font-medium">
                    Buyer Identity & Contact
                  </p>

                  <div className="flex items-center gap-4 mb-6 pb-6 border-b border-[#f0ede9] dark:border-[#292522]">
                    <div className="w-12 h-12 rounded-full bg-[#f4eee6] dark:bg-[#23201d] border border-[#e0d6c9] dark:border-[#38332e] flex items-center justify-center text-base font-medium text-[#C9A96E]">
                      {(buyer.fullname || "C").charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="m-0 text-lg font-light text-[#1a1410] dark:text-[#fbf9f6]" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                        {buyer.fullname || "Valued Client"}
                      </h3>
                      <p className="m-0 text-xs text-[#7a6e65] dark:text-[#a8a29e] font-sans">
                        Client ID: {buyer._id ? String(buyer._id).slice(0, 10) + "..." : "Registered User"}
                      </p>
                    </div>
                  </div>

                  <InfoRow
                    label="Customer Email"
                    value={buyer.email || "—"}
                    action={
                      buyer.email && (
                        <a
                          href={`mailto:${buyer.email}`}
                          className="text-[0.65rem] text-[#C9A96E] hover:underline"
                        >
                          Email Client
                        </a>
                      )
                    }
                  />
                  <InfoRow label="Contact Number" value={buyer.contact || "Not provided"} />
                  <InfoRow label="Order Reference" value={order.razorpay?.orderId || order._id} mono />
                  {order.razorpay?.paymentId && (
                    <InfoRow label="Payment ID" value={order.razorpay.paymentId} mono />
                  )}
                  <InfoRow label="Date Placed" value={orderDate} />

                  {/* Items Ordered */}
                  <div className="mt-8 mb-4">
                    <p className="m-0 mb-2 text-[0.55rem] tracking-[0.3em] uppercase text-[#a09890] dark:text-[#78716c] font-medium">
                      Your Products Ordered ({items.length})
                    </p>
                    <div className="border-t border-[#f0ede9] dark:border-[#292522]">
                      {items.map((item, idx) => (
                        <SellerOrderItemRow
                          key={item._id || idx}
                          item={item}
                          currency={currency}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Financial Breakdown */}
                  <div className="mt-6 pt-4 border-t border-[#e8e2d8] dark:border-[#292522]">
                    <InfoRow label="Items Subtotal" value={fmt(sellerSubtotal, currency)} />
                    <InfoRow label="Shipping / Handling" value="Included" />
                    <div className="flex justify-between items-center mt-3 pt-3 border-t border-dashed border-[#e8e2d8] dark:border-[#292522]">
                      <span className="text-[0.65rem] tracking-[0.18em] uppercase font-semibold text-[#1a1410] dark:text-[#fbf9f6]">
                        Net Revenue to Seller
                      </span>
                      <span className="text-lg font-semibold text-[#1a1410] dark:text-[#C9A96E]">
                        {fmt(sellerSubtotal, currency)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-3 mt-2">
                  <button
                    onClick={() => window.print()}
                    className="flex-1 py-3.5 bg-[#0d0d0b] dark:bg-[#fbf9f6] text-[#fbf9f6] dark:text-[#0d0d0b] text-[0.65rem] tracking-[0.22em] uppercase font-semibold border-none cursor-pointer rounded-full transition-all hover:bg-[#C9A96E] hover:text-[#0d0d0b] dark:hover:bg-[#C9A96E] dark:hover:text-[#0d0d0b]"
                  >
                    Print Packing Slip
                  </button>
                  <button
                    onClick={() => navigate("/seller/orders")}
                    className="flex-1 py-3.5 bg-transparent text-[#3d342c] dark:text-[#d6d3d1] text-[0.65rem] tracking-[0.22em] uppercase font-semibold border border-[#d5cfc8] dark:border-[#38332e] cursor-pointer rounded-full transition-all hover:border-[#0d0d0b] dark:hover:border-white hover:text-[#0d0d0b] dark:hover:text-white"
                  >
                    Return to Orders
                  </button>
                </div>
              </div>
            )}
          </main>
        </div>

        <LuxurisenFooter />
      </div>
    </>
  );
};

export default SellerOrderDetail;
