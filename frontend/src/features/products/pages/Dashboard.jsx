import React, { useEffect, useState } from "react";
import { useProduct } from "../hooks/useProduct";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";

/* ── Google Fonts injected once ─────────────────────────────── */
const FontLink = () => (
  <link
    href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=Inter:wght@300;400;500;600&display=swap"
    rel="stylesheet"
  />
);

/* ── tiny helpers ────────────────────────────────────────────── */
const fmt = (amount, currency) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency, maximumFractionDigits: 0 }).format(amount);

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
  const sellerProducts = useSelector((s) => s.product.sellerProducts);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    handleGetSellerProducts().finally(() => setIsLoading(false));
  }, []);

  const totalRevenue = sellerProducts.reduce((sum, p) => sum + (p.price?.amount ?? 0), 0);
  const totalImages  = sellerProducts.reduce((sum, p) => sum + (p.images?.length ?? 0), 0);

  return (
    <>
      <FontLink />
      <div
        className="min-h-screen selection:bg-[#C9A96E]/30"
        style={{ backgroundColor: "#fbf9f6", fontFamily: "'Inter', sans-serif", color: "#0d0d0b" }}
      >

        {/* ── Header ──────────────────────────────────────────── */}
        <header
          className="sticky top-0 z-50 flex items-center justify-between px-8 md:px-16 py-5 border-b"
          style={{ backgroundColor: "#fbf9f6", borderColor: "#e4e2df" }}
        >
          {/* Brand */}
          <span
            className="text-sm tracking-[0.35em] uppercase select-none"
            style={{ fontFamily: "'Cormorant Garamond', serif", color: "#C9A96E" }}
          >
            Snitch.
          </span>

          {/* Nav */}
          <nav className="hidden md:flex items-center gap-8">
            <button
              onClick={() => navigate("/seller/dashboard")}
              className="text-[10px] tracking-[0.2em] uppercase font-medium transition-colors duration-200"
              style={{ color: "#C9A96E", borderBottom: "1px solid #C9A96E", paddingBottom: "2px" }}
            >
              Dashboard
            </button>
            <button
              onClick={() => navigate("/seller/create-product")}
              className="text-[10px] tracking-[0.2em] uppercase font-medium transition-colors duration-200"
              style={{ color: "#6b6158" }}
              onMouseEnter={e => e.target.style.color = "#0d0d0b"}
              onMouseLeave={e => e.target.style.color = "#6b6158"}
            >
              New Listing
            </button>
          </nav>

          {/* CTA */}
          <button
            onClick={() => navigate("/seller/create-product")}
            className="flex items-center gap-2 text-[10px] tracking-[0.22em] uppercase font-medium py-2.5 px-5 transition-all duration-300"
            style={{ backgroundColor: "#0d0d0b", color: "#fbf9f6" }}
            onMouseEnter={e => { e.currentTarget.style.backgroundColor = "#C9A96E"; e.currentTarget.style.color = "#0d0d0b"; }}
            onMouseLeave={e => { e.currentTarget.style.backgroundColor = "#0d0d0b"; e.currentTarget.style.color = "#fbf9f6"; }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-3 h-3">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            New Listing
          </button>
        </header>

        {/* ── Main ────────────────────────────────────────────── */}
        <main className="px-8 sm:px-12 lg:px-20 xl:px-28 py-14 lg:py-20">

          {/* Heading */}
          <div className="mb-12">
            <p className="text-[10px] uppercase tracking-[0.22em] mb-3 font-medium" style={{ color: "#C9A96E" }}>
              Seller Portal
            </p>
            <h1
              className="text-5xl md:text-6xl font-light leading-[1.05]"
              style={{ fontFamily: "'Cormorant Garamond', serif", color: "#0d0d0b" }}
            >
              Your Products
            </h1>
          </div>

          {/* ── Stat strip ──────────────────────────────────── */}
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-px mb-16" style={{ backgroundColor: "#e4e2df" }}>
            {[
              { label: "Total Products", value: sellerProducts.length },
              {
                label: "Catalogue Value",
                value: sellerProducts.length
                  ? fmt(totalRevenue, sellerProducts[0]?.price?.currency ?? "INR")
                  : "—",
              },
              { label: "Total Photos", value: totalImages, hide: "block" },
            ].map(({ label, value, hide }) => (
              <div
                key={label}
                className={`px-7 py-6 ${hide === "block" ? "hidden lg:block" : ""}`}
                style={{ backgroundColor: "#fbf9f6" }}
              >
                <p className="text-[9px] tracking-[0.2em] uppercase font-medium mb-2" style={{ color: "#6b6158" }}>{label}</p>
                <p
                  className="text-3xl font-light"
                  style={{ fontFamily: "'Cormorant Garamond', serif", color: "#0d0d0b" }}
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
                <div key={i} className="animate-pulse" style={{ backgroundColor: "#f5f3f0" }}>
                  <div className="aspect-[4/5]" style={{ backgroundColor: "#e4e2df" }} />
                  <div className="p-5 space-y-3">
                    <div className="h-2.5 rounded" style={{ backgroundColor: "#e4e2df", width: "70%" }} />
                    <div className="h-2 rounded" style={{ backgroundColor: "#e4e2df", width: "45%" }} />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* ── Empty state ───────────────────────────────────── */}
          {!isLoading && sellerProducts.length === 0 && (
            <div className="flex flex-col items-center justify-center py-32 gap-5">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="w-10 h-10" style={{ color: "#d0c5b5" }}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 0 1-2.247 2.118H6.622a2.25 2.25 0 0 1-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z" />
              </svg>
              <p className="text-[10px] tracking-[0.2em] uppercase" style={{ color: "#6b6158" }}>No listings yet</p>
              <button
                onClick={() => navigate("/seller/create-product")}
                className="mt-1 text-[10px] tracking-[0.18em] uppercase transition-colors duration-200"
                style={{ color: "#3d342c", textDecoration: "underline", textUnderlineOffset: "4px" }}
                onMouseEnter={e => e.target.style.color = "#C9A96E"}
                onMouseLeave={e => e.target.style.color = "#3d342c"}
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
    </>
  );
};

/* ── ProductCard ─────────────────────────────────────────────── */
const ProductCard = ({ product }) => {
  const [activeImg, setActiveImg] = useState(0);
  const images = product.images ?? [];
  const hasMultiple = images.length > 1;

  return (
    <div
      className="group flex flex-col transition-shadow duration-300"
      style={{ backgroundColor: "#f5f3f0" }}
    >
      {/* Image */}
      <div className="relative aspect-[4/5] overflow-hidden" style={{ backgroundColor: "#e4e2df" }}>
        {images.length > 0 ? (
          <img
            src={images[activeImg]?.url}
            alt={product.title}
            className="w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-700 ease-out"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="w-10 h-10" style={{ color: "#d0c5b5" }}>
              <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
            </svg>
          </div>
        )}

        {/* Count badge */}
        {hasMultiple && (
          <span
            className="absolute top-3 right-3 text-[9px] tracking-[0.15em] px-2 py-0.5"
            style={{ backgroundColor: "rgba(251,249,246,0.85)", color: "#3d342c" }}
          >
            {activeImg + 1} / {images.length}
          </span>
        )}

        {/* Hover thumbnail strip */}
        {hasMultiple && (
          <div
            className="absolute bottom-0 left-0 right-0 flex gap-1 px-3 pb-3 pt-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            style={{ background: "linear-gradient(to top, rgba(27,24,20,0.35) 0%, transparent 100%)" }}
          >
            {images.map((img, i) => (
              <button
                key={img._id}
                onMouseEnter={() => setActiveImg(i)}
                onClick={() => setActiveImg(i)}
                className="flex-1 h-0.5 transition-all duration-200"
                style={{ backgroundColor: i === activeImg ? "#C9A96E" : "rgba(255,255,255,0.45)" }}
              />
            ))}
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-5 flex flex-col gap-2 flex-1">
        <div className="flex items-start justify-between gap-3">
          <h2
            className="text-base font-light leading-snug line-clamp-2 flex-1"
            style={{ fontFamily: "'Cormorant Garamond', serif", color: "#0d0d0b" }}
          >
            {product.title}
          </h2>
          <span className="text-sm font-medium whitespace-nowrap" style={{ color: "#C9A96E" }}>
            {fmt(product.price.amount, product.price.currency)}
          </span>
        </div>

        {product.description && (
          <p className="text-xs leading-relaxed line-clamp-2" style={{ color: "#3d342c" }}>
            {product.description}
          </p>
        )}

        <div
          className="mt-auto pt-4 flex items-center justify-between border-t"
          style={{ borderColor: "#e4e2df" }}
        >
          <span className="text-[9px] tracking-[0.15em] uppercase" style={{ color: "#6b6158" }}>
            {timeAgo(product.createdAt)}
          </span>
          <span className="text-[9px] tracking-[0.15em] uppercase" style={{ color: "#6b6158" }}>
            {images.length} {images.length === 1 ? "photo" : "photos"}
          </span>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
