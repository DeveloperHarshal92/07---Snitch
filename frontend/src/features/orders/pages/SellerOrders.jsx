import React, { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router";
import { useOrders } from "../hooks/useOrders";
import { useAuth } from "../../auth/hooks/useAuth";
import LuxurisenFooter from "../../Shared/components/LuxurisenFooter";
import ThemeToggle from "../../Shared/components/ThemeToggle";

/* ── Google Fonts injected ─────────────────────────────────────── */
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

/* ── Time ago helper ─────────────────────────────────────────── */
const timeAgo = (iso) => {
  if (!iso) return "";
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
};

/* ── Format Date nicely ───────────────────────────────────────── */
const formatDate = (dateStr) => {
  if (!dateStr) return "Recent";
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return "Recent";
    return d.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  } catch {
    return "Recent";
  }
};

/* ── Format ID nicely ─────────────────────────────────────────── */
const formatOrderId = (id) => {
  if (!id) return "—";
  const str = String(id);
  return str.length > 16 ? `${str.slice(0, 8)}…${str.slice(-6)}` : str;
};

/* ── Status Badge ─────────────────────────────────────────────── */
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
      Pending Payment
    </span>
  );
};

/* ── Seller Order Card ────────────────────────────────────────── */
const SellerOrderCard = ({ order, idx }) => {
  const navigate = useNavigate();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), idx * 50 + 40);
    return () => clearTimeout(t);
  }, [idx]);

  const items = order.orderItems || [];
  const itemCount =
    order.sellerItemCount ??
    items.reduce((acc, it) => acc + (it.quantity || 1), 0);
  const sellerSubtotal =
    order.sellerSubtotal ??
    items.reduce(
      (sum, it) => sum + (it.price?.amount || 0) * (it.quantity || 1),
      0
    );
  const currency = order.price?.currency || "INR";
  const dateText = formatDate(order.createdAt);
  const orderRef = order.razorpay?.orderId || order._id;
  const buyerName = order.buyer?.fullname || order.user?.fullname || "Valued Client";
  const buyerEmail = order.buyer?.email || order.user?.email || "—";
  const buyerContact = order.buyer?.contact || order.user?.contact;

  return (
    <div
      onClick={() => navigate(`/seller/orders/${order._id}`)}
      className="group bg-white dark:bg-[#141210] border border-[#e8e2d8] dark:border-[#292522] p-6 sm:p-7 rounded-lg cursor-pointer transition-all duration-300 hover:border-[#C9A96E] dark:hover:border-[#C9A96E] hover:shadow-lg shadow-sm"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(14px)",
        transition: `opacity 0.4s ease ${idx * 0.04}s, transform 0.4s ease ${idx * 0.04}s, border-color 0.3s, box-shadow 0.3s`,
      }}
    >
      {/* Top row: Buyer profile & Order meta */}
      <div className="flex flex-wrap items-start justify-between gap-4 pb-4 border-b border-[#f0ede9] dark:border-[#292522]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#f4eee6] dark:bg-[#23201d] border border-[#e0d6c9] dark:border-[#38332e] flex items-center justify-center text-xs font-medium text-[#C9A96E]">
            {buyerName.charAt(0).toUpperCase()}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-[#1a1410] dark:text-[#fbf9f6]">
                {buyerName}
              </span>
              <span className="text-[0.6rem] px-2 py-0.5 rounded bg-[#f4eee6] dark:bg-[#1f1c19] text-[#7a6e65] dark:text-[#a8a29e]">
                Buyer
              </span>
            </div>
            <p className="text-[0.7rem] text-[#7a6e65] dark:text-[#a8a29e] font-sans m-0">
              {buyerEmail} {buyerContact ? `• ${buyerContact}` : ""}
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 self-end sm:self-auto">
          <div className="text-left sm:text-right">
            <span className="text-[0.55rem] tracking-[0.2em] uppercase block text-[#a09890] dark:text-[#78716c] font-medium font-sans">
              Placed {timeAgo(order.createdAt)}
            </span>
            <span className="text-[0.75rem] font-medium text-[#3d342c] dark:text-[#d6d3d1] font-mono">
              {formatOrderId(orderRef)}
            </span>
          </div>
          <StatusBadge status={order.status} />
        </div>
      </div>

      {/* Middle row: Items ordered from this seller */}
      <div className="py-4 space-y-3 border-b border-[#f0ede9] dark:border-[#292522]">
        {items.map((item, i) => {
          const itemImg = item.images?.[0]?.url;
          const itemPrice = item.price?.amount || 0;
          const itemQty = item.quantity || 1;

          return (
            <div key={item._id || i} className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-12 h-14 bg-[#f0ede9] dark:bg-[#1f1c19] rounded overflow-hidden flex-shrink-0 border border-[#e8e2d8] dark:border-[#292522]">
                  {itemImg ? (
                    <img
                      src={itemImg}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-[#a09890]">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-4 h-4">
                        <path d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Z" />
                      </svg>
                    </div>
                  )}
                </div>
                <div className="min-w-0">
                  <p className="text-xs sm:text-sm font-medium text-[#1a1410] dark:text-[#fbf9f6] truncate m-0 font-sans">
                    {item.title}
                  </p>
                  <p className="text-[0.65rem] text-[#7a6e65] dark:text-[#a8a29e] m-0 font-sans">
                    Quantity: {itemQty} &times; {fmt(itemPrice, currency)}
                  </p>
                </div>
              </div>

              <div className="text-right whitespace-nowrap">
                <span className="text-xs sm:text-sm font-medium text-[#1a1410] dark:text-[#fbf9f6]">
                  {fmt(itemPrice * itemQty, currency)}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom row: Total earnings from this order & Detail action */}
      <div className="pt-4 flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="text-[0.55rem] tracking-[0.2em] uppercase text-[#a09890] dark:text-[#78716c] font-medium font-sans">
            Your Order Revenue ({itemCount} {itemCount === 1 ? "unit" : "units"})
          </span>
          <p className="text-lg font-semibold text-[#1a1410] dark:text-[#C9A96E] m-0 font-sans">
            {fmt(sellerSubtotal, currency)}
          </p>
        </div>

        <div className="flex items-center gap-1 text-[0.65rem] font-medium tracking-[0.18em] uppercase text-[#1a1410] dark:text-[#fbf9f6] group-hover:text-[#C9A96E] dark:group-hover:text-[#C9A96E] transition-colors duration-200">
          <span>Order Overview</span>
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
  );
};

/* ── Seller Orders Page ───────────────────────────────────────── */
const SellerOrders = () => {
  const navigate = useNavigate();
  const { handleLogout } = useAuth();
  const { handleGetSellerOrders, loading, error } = useOrders();
  const [orders, setOrders] = useState([]);
  const [pageLoaded, setPageLoaded] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const onLogoutClick = async () => {
    await handleLogout();
    navigate("/login");
  };

  useEffect(() => {
    handleGetSellerOrders()
      .then((res) => {
        setOrders(res || []);
      })
      .catch((err) => {
        console.error("Error loading seller orders:", err);
      })
      .finally(() => {
        setPageLoaded(true);
      });
  }, []);

  // Filtered orders list
  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      // Status filter
      if (statusFilter !== "all" && (order.status || "pending").toLowerCase() !== statusFilter) {
        return false;
      }
      // Search filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const buyerName = (order.buyer?.fullname || order.user?.fullname || "").toLowerCase();
        const buyerEmail = (order.buyer?.email || order.user?.email || "").toLowerCase();
        const orderId = String(order.razorpay?.orderId || order._id || "").toLowerCase();
        const itemTitles = (order.orderItems || []).map((it) => (it.title || "").toLowerCase()).join(" ");

        return (
          buyerName.includes(q) ||
          buyerEmail.includes(q) ||
          orderId.includes(q) ||
          itemTitles.includes(q)
        );
      }
      return true;
    });
  }, [orders, statusFilter, searchQuery]);

  // Aggregate stats
  const totalRevenue = orders
    .filter((o) => o.status === "completed")
    .reduce((sum, o) => sum + (o.sellerSubtotal || 0), 0);

  const totalUnitsSold = orders
    .filter((o) => o.status === "completed")
    .reduce((sum, o) => sum + (o.sellerItemCount || 0), 0);

  const pendingOrdersCount = orders.filter(
    (o) => o.status === "pending" || !o.status
  ).length;

  return (
    <>
      <FontLink />
      <div className="min-h-screen bg-[#fbf9f6] dark:bg-[#0a0908] text-[#0d0d0b] dark:text-[#fbf9f6] transition-colors duration-300 font-sans flex flex-col justify-between">
        <div>
          {/* ── Header ──────────────────────────────────────────── */}
          <header className="sticky top-0 z-40 flex items-center justify-between px-6 sm:px-12 py-4 border-b border-[#e4e2df] dark:border-[#292522] bg-[#fbf9f6]/90 dark:bg-[#0a0908]/90 backdrop-blur-md">
            {/* Brand */}
            <span
              className="text-sm tracking-[0.35em] uppercase select-none cursor-pointer text-[#C9A96E]"
              onClick={() => navigate("/")}
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
            >
              Luxurisen
            </span>

            {/* Nav */}
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

            {/* CTA & Actions */}
            <div className="flex items-center gap-3">
              <ThemeToggle />

              <button
                onClick={() => navigate("/seller/create-product")}
                className="flex items-center gap-2 text-[10px] tracking-[0.22em] uppercase font-semibold py-2.5 px-4 rounded-full bg-[#0d0d0b] dark:bg-[#fbf9f6] text-[#fbf9f6] dark:text-[#0d0d0b] hover:bg-[#C9A96E] hover:text-[#0d0d0b] dark:hover:bg-[#C9A96E] dark:hover:text-[#0d0d0b] transition-all duration-300 cursor-pointer"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2.5}
                  stroke="currentColor"
                  className="w-3 h-3"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
                <span>New Listing</span>
              </button>

              <button
                onClick={onLogoutClick}
                title="Sign Out"
                className="flex items-center gap-1.5 px-3 py-2 text-[10px] tracking-[0.18em] uppercase border border-[#e4e2df] dark:border-[#292522] text-[#6b6158] dark:text-[#a8a29e] hover:border-[#0d0d0b] dark:hover:border-white hover:text-[#0d0d0b] dark:hover:text-white rounded-full transition-colors duration-200 cursor-pointer bg-transparent"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-3.5 h-3.5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15M12 9l-3 3m0 0 3 3m-3-3h12.75"
                  />
                </svg>
                <span>Sign Out</span>
              </button>
            </div>
          </header>

          {/* ── Main Content ────────────────────────────────────── */}
          <main className="max-w-[1200px] mx-auto px-6 sm:px-12 py-10 lg:py-14">
            {/* Title Section */}
            <div className="flex flex-wrap items-end justify-between gap-4 mb-10">
              <div>
                <p className="text-[10px] uppercase tracking-[0.25em] mb-2 font-medium text-[#C9A96E]">
                  Seller Portal & Fulfillment
                </p>
                <h1
                  className="text-4xl md:text-5xl font-light text-[#0d0d0b] dark:text-white leading-tight m-0"
                  style={{ fontFamily: "'Cormorant Garamond', serif" }}
                >
                  Customer Orders
                </h1>
              </div>
              <p className="text-xs text-[#7a6e65] dark:text-[#a8a29e] font-light max-w-[360px] leading-relaxed m-0">
                Track real-time acquisitions, customer details, fulfillment status, and realized revenue across all your luxury listings.
              </p>
            </div>

            {/* ── Stats Strip ─────────────────────────────────── */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-px mb-10 bg-[#e4e2df] dark:bg-[#292522] rounded-lg overflow-hidden border border-[#e4e2df] dark:border-[#292522]">
              <div className="p-6 bg-[#fbf9f6] dark:bg-[#141210]">
                <p className="text-[9px] tracking-[0.2em] uppercase font-medium mb-1 text-[#6b6158] dark:text-[#a8a29e]">
                  Total Orders
                </p>
                <p
                  className="text-3xl font-light text-[#0d0d0b] dark:text-[#fbf9f6] m-0"
                  style={{ fontFamily: "'Cormorant Garamond', serif" }}
                >
                  {orders.length}
                </p>
              </div>

              <div className="p-6 bg-[#fbf9f6] dark:bg-[#141210]">
                <p className="text-[9px] tracking-[0.2em] uppercase font-medium mb-1 text-[#6b6158] dark:text-[#a8a29e]">
                  Confirmed Revenue
                </p>
                <p
                  className="text-3xl font-light text-[#0d0d0b] dark:text-[#fbf9f6] m-0"
                  style={{ fontFamily: "'Cormorant Garamond', serif" }}
                >
                  {fmt(totalRevenue, orders[0]?.price?.currency || "INR")}
                </p>
              </div>

              <div className="p-6 bg-[#fbf9f6] dark:bg-[#141210]">
                <p className="text-[9px] tracking-[0.2em] uppercase font-medium mb-1 text-[#6b6158] dark:text-[#a8a29e]">
                  Units Sold
                </p>
                <p
                  className="text-3xl font-light text-[#0d0d0b] dark:text-[#fbf9f6] m-0"
                  style={{ fontFamily: "'Cormorant Garamond', serif" }}
                >
                  {totalUnitsSold}
                </p>
              </div>

              <div className="p-6 bg-[#fbf9f6] dark:bg-[#141210]">
                <p className="text-[9px] tracking-[0.2em] uppercase font-medium mb-1 text-[#6b6158] dark:text-[#a8a29e]">
                  Pending Orders
                </p>
                <p
                  className="text-3xl font-light text-[#C9A96E] m-0"
                  style={{ fontFamily: "'Cormorant Garamond', serif" }}
                >
                  {pendingOrdersCount}
                </p>
              </div>
            </div>

            {/* ── Filters & Search ────────────────────────────── */}
            <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
              {/* Search input */}
              <div className="relative flex-1 min-w-[240px] max-w-[420px]">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by buyer, order reference, or item..."
                  className="w-full pl-9 pr-4 py-2.5 bg-white dark:bg-[#141210] border border-[#e4e2df] dark:border-[#292522] rounded-full text-xs text-[#0d0d0b] dark:text-[#fbf9f6] placeholder-[#a09890] dark:placeholder-[#78716c] focus:outline-none focus:border-[#C9A96E] transition-colors"
                />
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-4 h-4 absolute left-3 top-3 text-[#a09890] dark:text-[#78716c]"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
                  />
                </svg>
              </div>

              {/* Status filter tabs */}
              <div className="flex items-center gap-1.5 p-1 bg-[#f0ede9] dark:bg-[#191715] rounded-full border border-[#e4e2df] dark:border-[#292522]">
                {[
                  { id: "all", label: "All Orders" },
                  { id: "completed", label: "Confirmed" },
                  { id: "pending", label: "Pending" },
                  { id: "failed", label: "Failed" },
                ].map(({ id, label }) => (
                  <button
                    key={id}
                    onClick={() => setStatusFilter(id)}
                    className={`px-3.5 py-1.5 text-[0.6rem] tracking-[0.15em] uppercase font-medium rounded-full transition-all duration-200 cursor-pointer border-none ${
                      statusFilter === id
                        ? "bg-[#0d0d0b] dark:bg-[#fbf9f6] text-[#fbf9f6] dark:text-[#0d0d0b] shadow-sm"
                        : "bg-transparent text-[#6b6158] dark:text-[#a8a29e] hover:text-[#0d0d0b] dark:hover:text-white"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* ── Error Banner ────────────────────────────────── */}
            {error && !loading && (
              <div className="p-4 mb-6 bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-xs rounded">
                {error}
              </div>
            )}

            {/* ── Loading Skeleton ────────────────────────────── */}
            {loading && !pageLoaded && (
              <div className="flex flex-col gap-4">
                {[1, 2, 3].map((n) => (
                  <div
                    key={n}
                    className="bg-white dark:bg-[#141210] border border-[#e8e2d8] dark:border-[#292522] p-6 rounded-lg animate-pulse h-44 flex flex-col justify-between"
                  >
                    <div className="flex justify-between">
                      <div className="w-48 h-4 bg-[#f0ede9] dark:bg-[#1f1c19] rounded" />
                      <div className="w-24 h-4 bg-[#f0ede9] dark:bg-[#1f1c19] rounded" />
                    </div>
                    <div className="flex gap-4">
                      <div className="w-14 h-16 bg-[#f0ede9] dark:bg-[#1f1c19] rounded" />
                      <div className="space-y-2 flex-1">
                        <div className="w-1/2 h-3 bg-[#f0ede9] dark:bg-[#1f1c19] rounded" />
                        <div className="w-1/4 h-3 bg-[#f0ede9] dark:bg-[#1f1c19] rounded" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* ── Empty State ─────────────────────────────────── */}
            {!loading && pageLoaded && filteredOrders.length === 0 && (
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
                      d="M20.25 7.5l-.625 10.632a2.25 2.25 0 0 1-2.247 2.118H6.622a2.25 2.25 0 0 1-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z"
                    />
                  </svg>
                </div>

                <h2
                  className="text-2xl sm:text-3xl font-light text-[#0d0d0b] dark:text-white m-0 mb-3"
                  style={{ fontFamily: "'Cormorant Garamond', serif" }}
                >
                  {orders.length === 0
                    ? "No Orders Received Yet"
                    : "No Matching Orders Found"}
                </h2>

                <p className="text-xs text-[#7a6e65] dark:text-[#a8a29e] leading-relaxed max-w-[380px] mb-8 font-light">
                  {orders.length === 0
                    ? "When clients purchase your luxury pieces, their orders and acquisition records will be catalogued here."
                    : "Try adjusting your search query or status filter to locate relevant customer orders."}
                </p>

                {orders.length === 0 ? (
                  <button
                    onClick={() => navigate("/seller/create-product")}
                    className="px-8 py-3.5 text-[0.65rem] tracking-[0.22em] uppercase font-semibold bg-[#0d0d0b] dark:bg-[#fbf9f6] text-[#fbf9f6] dark:text-[#0d0d0b] rounded-full transition-all duration-300 hover:bg-[#C9A96E] hover:text-[#0d0d0b] dark:hover:bg-[#C9A96E] dark:hover:text-[#0d0d0b] shadow-sm cursor-pointer"
                  >
                    Add More Products
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      setSearchQuery("");
                      setStatusFilter("all");
                    }}
                    className="text-xs text-[#C9A96E] hover:underline cursor-pointer bg-transparent border-none"
                  >
                    Reset Filters
                  </button>
                )}
              </div>
            )}

            {/* ── Orders List ─────────────────────────────────── */}
            {!loading && filteredOrders.length > 0 && (
              <div className="flex flex-col gap-5">
                {filteredOrders.map((order, idx) => (
                  <SellerOrderCard key={order._id} order={order} idx={idx} />
                ))}
              </div>
            )}
          </main>
        </div>

        <LuxurisenFooter />
      </div>
    </>
  );
};

export default SellerOrders;
