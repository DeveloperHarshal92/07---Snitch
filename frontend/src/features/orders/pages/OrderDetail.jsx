import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import { useOrders } from "../hooks/useOrders";
import LuxurisenFooter from "../../Shared/components/LuxurisenFooter";

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

/* ── Step tracker ─────────────────────────────────────────────── */
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
const InfoRow = ({ label, value, mono }) => (
  <div className="flex justify-between items-center py-3 border-b border-[#f0ede9] dark:border-[#292522]">
    <span className="text-[0.6rem] tracking-[0.14em] uppercase text-[#a09890] dark:text-[#78716c] font-medium font-sans">
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
            Qty: {qty}
          </span>
          <span className="text-xs font-semibold text-[#1a1410] dark:text-[#fbf9f6]">
            {fmt(price * qty, currency)}
          </span>
        </div>
      </div>
    </div>
  );
};

/* ── OrderDetail Main Component ───────────────────────────────── */
const OrderDetail = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { handleGetOrderDetails, loading, error } = useOrders();
  const [order, setOrder] = useState(null);
  const [pageLoaded, setPageLoaded] = useState(false);

  useEffect(() => {
    if (orderId) {
      handleGetOrderDetails(orderId)
        .then((res) => {
          setOrder(res);
        })
        .catch((err) => {
          console.error(err);
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
      })
    : "—";

  return (
    <>
      <FontLink />
      <div className="min-h-screen bg-[#fbf9f6] dark:bg-[#0a0908] text-[#0d0d0b] dark:text-[#fbf9f6] transition-colors duration-300 flex flex-col justify-between font-sans">
        <div className="max-w-[760px] w-full mx-auto px-6 sm:px-8 pt-8 pb-20 flex-1">
          {/* Back button */}
          <button
            onClick={() => navigate("/orders")}
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
            <span>Back to Orders</span>
          </button>

          {/* Loading state */}
          {loading && !pageLoaded && (
            <div className="bg-white dark:bg-[#141210] border border-[#e8e2d8] dark:border-[#292522] rounded-lg p-8 sm:p-10 animate-pulse flex flex-col gap-6">
              <div className="w-48 h-6 bg-[#f0ede9] dark:bg-[#1f1c19] rounded" />
              <div className="w-full h-12 bg-[#f0ede9] dark:bg-[#1f1c19] rounded" />
              <div className="w-full h-32 bg-[#f0ede9] dark:bg-[#1f1c19] rounded" />
            </div>
          )}

          {/* Error / Not Found state */}
          {!loading && pageLoaded && (!order || error) && (
            <div className="bg-white dark:bg-[#141210] border border-[#e8e2d8] dark:border-[#292522] rounded-lg p-12 text-center flex flex-col items-center shadow-sm">
              <h2
                className="text-2xl sm:text-3xl font-light text-[#0d0d0b] dark:text-white m-0 mb-3"
                style={{ fontFamily: "'Cormorant Garamond', serif" }}
              >
                Order Record Not Found
              </h2>
              <p className="text-xs text-[#7a6e65] dark:text-[#a8a29e] mb-6 max-w-[360px]">
                The requested order could not be retrieved or does not belong to
                your account.
              </p>
              <button
                onClick={() => navigate("/orders")}
                className="px-7 py-3 text-[0.65rem] tracking-[0.2em] uppercase font-semibold bg-[#0d0d0b] dark:bg-[#fbf9f6] text-[#fbf9f6] dark:text-[#0d0d0b] rounded-full transition-all hover:bg-[#C9A96E] hover:text-[#0d0d0b] dark:hover:bg-[#C9A96E] dark:hover:text-[#0d0d0b] cursor-pointer"
              >
                View All Orders
              </button>
            </div>
          )}

          {/* Order Details Content */}
          {!loading && order && (
            <div className="flex flex-col gap-6">
              {/* Header Title */}
              <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-[#e8e2d8] dark:border-[#292522]">
                <div>
                  <p className="text-[0.6rem] tracking-[0.25em] uppercase font-medium mb-1 text-[#C9A96E]">
                    Order Summary
                  </p>
                  <h1
                    className="m-0 font-light text-2xl sm:text-4xl text-[#0d0d0b] dark:text-white leading-tight"
                    style={{ fontFamily: "'Cormorant Garamond', serif" }}
                  >
                    Acquisition Details
                  </h1>
                </div>
                <StatusBadge status={order.status} />
              </div>

              {/* Status Tracker if completed */}
              {isCompleted ? (
                <div className="bg-white dark:bg-[#141210] border border-[#e8e2d8] dark:border-[#292522] rounded-lg p-6 flex justify-center items-center shadow-sm">
                  <Step label="Placed" done active={false} isLast={false} />
                  <Step label="Processing" done active isLast={false} />
                  <Step
                    label="Shipped"
                    done={false}
                    active={false}
                    isLast={false}
                  />
                  <Step label="Delivered" done={false} active={false} isLast />
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
                      ? "This transaction was not completed. If amount was debited, it will be refunded automatically."
                      : "This order is currently pending verification."}
                  </span>
                </div>
              )}

              {/* Main Card */}
              <div className="bg-white dark:bg-[#141210] border border-[#e8e2d8] dark:border-[#292522] rounded-lg p-6 sm:p-8 shadow-sm">
                <p className="m-0 mb-4 text-[0.55rem] tracking-[0.3em] uppercase text-[#a09890] dark:text-[#78716c] font-medium">
                  Overview & Records
                </p>

                <InfoRow
                  label="Order Reference"
                  value={order.razorpay?.orderId || order._id}
                  mono
                />
                {order.razorpay?.paymentId && (
                  <InfoRow
                    label="Payment ID"
                    value={order.razorpay.paymentId}
                    mono
                  />
                )}
                <InfoRow label="Order Date" value={orderDate} />
                <InfoRow label="Shipping" value="Standard Express — Free" />

                {/* Items Section */}
                <div className="mt-8 mb-4">
                  <p className="m-0 mb-2 text-[0.55rem] tracking-[0.3em] uppercase text-[#a09890] dark:text-[#78716c] font-medium">
                    Items In Order ({items.length})
                  </p>
                  <div className="border-t border-[#f0ede9] dark:border-[#292522]">
                    {items.map((item, idx) => (
                      <OrderItemRow
                        key={item._id || idx}
                        item={item}
                        currency={currency}
                      />
                    ))}
                  </div>
                </div>

                {/* Price Breakdown */}
                <div className="mt-6 pt-4 border-t border-[#e8e2d8] dark:border-[#292522]">
                  <InfoRow
                    label="Subtotal"
                    value={fmt(order.price?.amount || 0, currency)}
                  />
                  <InfoRow label="Shipping Fee" value="Free" />
                  <div className="flex justify-between items-center mt-3 pt-3 border-t border-dashed border-[#e8e2d8] dark:border-[#292522]">
                    <span className="text-[0.65rem] tracking-[0.18em] uppercase font-semibold text-[#1a1410] dark:text-[#fbf9f6]">
                      Total Paid
                    </span>
                    <span className="text-lg font-semibold text-[#1a1410] dark:text-[#C9A96E]">
                      {fmt(order.price?.amount || 0, currency)}
                    </span>
                  </div>
                </div>

                {/* Security and notification note */}
                <div className="mt-8 p-4 bg-[#fbf9f6] dark:bg-[#1f1c19] border border-[#e8e2d8] dark:border-[#292522] rounded flex items-start gap-3">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#C9A96E"
                    strokeWidth="1.5"
                    className="w-4 h-4 flex-shrink-0 mt-0.5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z"
                    />
                  </svg>
                  <p className="m-0 text-xs text-[#6b5e50] dark:text-[#a8a29e] leading-relaxed">
                    This order record is cryptographically verified and archived
                    in your Luxurisen client profile. Delivery notifications
                    will be sent directly to your registered account.
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 mt-2">
                <button
                  onClick={() => navigate("/")}
                  className="flex-1 py-3.5 bg-[#0d0d0b] dark:bg-[#fbf9f6] text-[#fbf9f6] dark:text-[#0d0d0b] text-[0.65rem] tracking-[0.22em] uppercase font-semibold border-none cursor-pointer rounded-full transition-all hover:bg-[#C9A96E] hover:text-[#0d0d0b] dark:hover:bg-[#C9A96E] dark:hover:text-[#0d0d0b]"
                >
                  Continue Shopping
                </button>
                <button
                  onClick={() => navigate("/cart")}
                  className="flex-1 py-3.5 bg-transparent text-[#3d342c] dark:text-[#d6d3d1] text-[0.65rem] tracking-[0.22em] uppercase font-semibold border border-[#d5cfc8] dark:border-[#38332e] cursor-pointer rounded-full transition-all hover:border-[#0d0d0b] dark:hover:border-white hover:text-[#0d0d0b] dark:hover:text-white"
                >
                  View Shopping Bag
                </button>
              </div>
            </div>
          )}
        </div>

        <LuxurisenFooter />
      </div>
    </>
  );
};

export default OrderDetail;
