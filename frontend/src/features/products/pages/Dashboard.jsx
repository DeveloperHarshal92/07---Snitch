import React, { useEffect, useState } from "react";
import { useProduct } from "../hooks/useProduct";
import { useAuth } from "../../auth/hooks/useAuth";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";
import LuxurisenFooter from "../../Shared/components/LuxurisenFooter";
import ThemeToggle from "../../Shared/components/ThemeToggle";

/* ── Google Fonts injected once ─────────────────────────────── */
const FontLink = () => (
  <link
    href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=Inter:wght@300;400;500;600&display=swap"
    rel="stylesheet"
  />
);

/* ── tiny helpers ────────────────────────────────────────────── */
const fmt = (amount, currency) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: currency || "INR",
    maximumFractionDigits: 0,
  }).format(amount);

const timeAgo = (iso) => {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
};

/* ── Dashboard ───────────────────────────────────────────────── */
const Dashboard = () => {
  const { handleGetSellerProducts } = useProduct();
  const { handleLogout } = useAuth();
  const sellerProducts = useSelector((s) => s.product.sellerProducts);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  const onLogoutClick = async () => {
    await handleLogout();
    navigate("/login");
  };

  useEffect(() => {
    handleGetSellerProducts().finally(() => setIsLoading(false));
  }, []);

  const totalRevenue = sellerProducts.reduce(
    (sum, p) => sum + (p.price?.amount ?? 0),
    0,
  );
  const totalImages = sellerProducts.reduce(
    (sum, p) => sum + (p.images?.length ?? 0),
    0,
  );

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
                className="text-[10px] tracking-[0.2em] uppercase font-medium text-[#C9A96E] border-b border-[#C9A96E] pb-0.5 cursor-pointer bg-transparent"
              >
                Products
              </button>
              <button
                onClick={() => navigate("/seller/orders")}
                className="text-[10px] tracking-[0.2em] uppercase font-medium text-[#6b6158] dark:text-[#a8a29e] hover:text-[#0d0d0b] dark:hover:text-white transition-colors duration-200 cursor-pointer bg-transparent border-none"
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
                onClick={() => navigate("/seller/orders")}
                className="hidden sm:flex items-center gap-1.5 px-3.5 py-2 text-[10px] tracking-[0.18em] uppercase border border-[#e4e2df] dark:border-[#292522] text-[#6b6158] dark:text-[#a8a29e] hover:border-[#C9A96E] dark:hover:border-[#C9A96E] hover:text-[#0d0d0b] dark:hover:text-white rounded-full transition-colors duration-200 cursor-pointer bg-transparent"
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
                    d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25ZM6.75 12h.008v.008H6.75V12Zm0 3h.008v.008H6.75V15Zm0 3h.008v.008H6.75V18Z"
                  />
                </svg>
                <span>View Orders</span>
              </button>

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
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 4.5v15m7.5-7.5h-15"
                  />
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

          {/* ── Main ────────────────────────────────────────────── */}
          <main className="max-w-[1200px] mx-auto px-6 sm:px-12 py-10 lg:py-14">
            {/* Heading */}
            <div className="mb-10">
              <p className="text-[10px] uppercase tracking-[0.25em] mb-2 font-medium text-[#C9A96E]">
                Seller Portal
              </p>
              <h1
                className="text-4xl md:text-5xl font-light text-[#0d0d0b] dark:text-white leading-tight"
                style={{ fontFamily: "'Cormorant Garamond', serif" }}
              >
                Your Products
              </h1>
            </div>

            {/* ── Stat strip ──────────────────────────────────── */}
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-px mb-12 bg-[#e4e2df] dark:bg-[#292522] rounded-lg overflow-hidden border border-[#e4e2df] dark:border-[#292522]">
              {[
                { label: "Total Products", value: sellerProducts.length },
                {
                  label: "Catalogue Value",
                  value: sellerProducts.length
                    ? fmt(
                        totalRevenue,
                        sellerProducts[0]?.price?.currency ?? "INR",
                      )
                    : "—",
                },
                { label: "Total Photos", value: totalImages, hide: "block" },
              ].map(({ label, value, hide }) => (
                <div
                  key={label}
                  className={`p-6 bg-[#fbf9f6] dark:bg-[#141210] ${
                    hide === "block" ? "hidden lg:block" : ""
                  }`}
                >
                  <p className="text-[9px] tracking-[0.2em] uppercase font-medium mb-1 text-[#6b6158] dark:text-[#a8a29e]">
                    {label}
                  </p>
                  <p
                    className="text-3xl font-light text-[#0d0d0b] dark:text-[#fbf9f6]"
                    style={{ fontFamily: "'Cormorant Garamond', serif" }}
                  >
                    {value}
                  </p>
                </div>
              ))}
            </div>

            {/* ── Loading skeleton ──────────────────────────────— */}
            {isLoading && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div
                    key={i}
                    className="animate-pulse bg-[#f5f3f0] dark:bg-[#141210] rounded-lg overflow-hidden border border-[#e4e2df] dark:border-[#292522]"
                  >
                    <div className="aspect-[4/5] bg-[#e4e2df] dark:bg-[#1f1c19]" />
                    <div className="p-5 space-y-3">
                      <div className="h-3 rounded bg-[#e4e2df] dark:bg-[#1f1c19] w-[70%]" />
                      <div className="h-2.5 rounded bg-[#e4e2df] dark:bg-[#1f1c19] w-[45%]" />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* ── Empty state ───────────────────────────────────── */}
            {!isLoading && sellerProducts.length === 0 && (
              <div className="flex flex-col items-center justify-center py-28 gap-4 text-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1}
                  stroke="currentColor"
                  className="w-12 h-12 text-[#C9A96E]"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M20.25 7.5l-.625 10.632a2.25 2.25 0 0 1-2.247 2.118H6.622a2.25 2.25 0 0 1-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z"
                  />
                </svg>
                <p className="text-xs tracking-[0.2em] uppercase text-[#6b6158] dark:text-[#a8a29e]">
                  No listings yet
                </p>
                <button
                  onClick={() => navigate("/seller/create-product")}
                  className="mt-1 text-xs tracking-wider uppercase text-[#0d0d0b] dark:text-[#fbf9f6] hover:text-[#C9A96E] dark:hover:text-[#C9A96E] underline underline-offset-4 cursor-pointer bg-transparent border-none"
                >
                  Create your first listing →
                </button>
              </div>
            )}

            {/* ── Product grid ──────────────────────────────────── */}
            {!isLoading && sellerProducts.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {sellerProducts.map((product) => (
                  <ProductCard key={product._id} product={product} />
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

/* ── ProductCard ─────────────────────────────────────────────── */
const ProductCard = ({ product }) => {
  const [activeImg, setActiveImg] = useState(0);
  const images = product.images ?? [];
  const hasMultiple = images.length > 1;
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/seller/product/${product._id}`)}
      className="cursor-pointer group flex flex-col bg-[#f5f3f0] dark:bg-[#141210] border border-[#e4e2df] dark:border-[#292522] rounded-lg overflow-hidden transition-all duration-300 hover:border-[#C9A96E] dark:hover:border-[#C9A96E] hover:shadow-md"
    >
      {/* Image */}
      <div className="relative aspect-[4/5] overflow-hidden bg-[#e4e2df] dark:bg-[#1f1c19]">
        {images.length > 0 ? (
          <img
            src={images[activeImg]?.url}
            alt={product.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-[#a8a29e]">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1}
              stroke="currentColor"
              className="w-10 h-10"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
              />
            </svg>
          </div>
        )}

        {/* Count badge */}
        {hasMultiple && (
          <span className="absolute top-3 right-3 text-[9px] tracking-[0.15em] px-2 py-0.5 bg-black/60 text-white rounded">
            {activeImg + 1} / {images.length}
          </span>
        )}

        {/* Hover thumbnail strip */}
        {hasMultiple && (
          <div className="absolute bottom-0 left-0 right-0 flex gap-1 px-3 pb-3 pt-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-t from-black/50 to-transparent">
            {images.map((img, i) => (
              <button
                key={img._id || i}
                onMouseEnter={() => setActiveImg(i)}
                onClick={() => setActiveImg(i)}
                className={`flex-1 h-0.5 transition-all duration-200 ${
                  i === activeImg ? "bg-[#C9A96E]" : "bg-white/40"
                }`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-4 flex flex-col gap-2 flex-1">
        <div className="flex items-start justify-between gap-3">
          <h2
            className="text-base font-light leading-snug line-clamp-2 flex-1 text-[#0d0d0b] dark:text-[#fbf9f6]"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            {product.title}
          </h2>
          <span className="text-sm font-medium text-[#C9A96E] whitespace-nowrap">
            {fmt(product.price.amount, product.price.currency)}
          </span>
        </div>

        {product.description && (
          <p className="text-xs leading-relaxed line-clamp-2 text-[#3d342c] dark:text-[#a8a29e] font-light">
            {product.description}
          </p>
        )}

        <div className="mt-auto pt-3 flex items-center justify-between border-t border-[#e4e2df] dark:border-[#292522] text-[9px] tracking-[0.15em] uppercase text-[#6b6158] dark:text-[#a8a29e]">
          <span>{timeAgo(product.createdAt)}</span>
          <span>
            {images.length} {images.length === 1 ? "photo" : "photos"}
          </span>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
