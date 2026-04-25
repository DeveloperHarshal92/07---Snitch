import React, { useEffect, useState, useRef } from "react";
import { useSelector } from "react-redux";
import { useProduct } from "../hooks/useProduct";
import { useNavigate } from "react-router";

/* ── Google Fonts ─────────────────────────────────────────────── */
const FontLink = () => (
  <link
    href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=Inter:wght@300;400;500;600&display=swap"
    rel="stylesheet"
  />
);

/* ── Helpers ──────────────────────────────────────────────────── */
const fmt = (amount, currency = "INR") =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(amount);

/* ── Home ─────────────────────────────────────────────────────── */
const Home = () => {
  const products = useSelector((state) => state.product.products);
  const { handleGetAllProducts } = useProduct();
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("default");
  const [heroVisible, setHeroVisible] = useState(false);
  const heroRef = useRef(null);

  useEffect(() => {
    handleGetAllProducts().finally(() => setIsLoading(false));
  }, []);

  useEffect(() => {
    const t = setTimeout(() => setHeroVisible(true), 80);
    return () => clearTimeout(t);
  }, []);

  const filtered = products
    .filter(
      (p) =>
        p.title?.toLowerCase().includes(search.toLowerCase()) ||
        p.description?.toLowerCase().includes(search.toLowerCase()),
    )
    .sort((a, b) => {
      if (sortBy === "price-asc") return a.price.amount - b.price.amount;
      if (sortBy === "price-desc") return b.price.amount - a.price.amount;
      if (sortBy === "newest")
        return new Date(b.createdAt) - new Date(a.createdAt);
      return 0;
    });

  return (
    <>
      <FontLink />
      <style>{`
        @keyframes marquee {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .marquee-track { animation: marquee 28s linear infinite; }
        .card-hover { transition: box-shadow 0.35s ease, transform 0.35s ease; }
        .card-hover:hover { box-shadow: 0 12px 48px rgba(27,24,20,0.10); transform: translateY(-4px); }
        ::selection { background: rgba(201,169,110,0.28); }
        .search-input:focus { border-bottom-color: #C9A96E !important; }
      `}</style>

      <div
        className="min-h-screen text-[#0d0d0b]"
        style={{
          backgroundColor: "#fbf9f6",
          fontFamily: "'Inter', sans-serif",
        }}
      >
        {/* ── Navbar ──────────────────────────────────────────────── */}
        <header
          className="sticky top-0 z-50 border-b"
          style={{ backgroundColor: "#fbf9f6", borderColor: "#e4e2df" }}
        >
          <div className="max-w-[1400px] mx-auto px-8 h-[68px] flex items-center justify-between gap-6">
            {/* Brand */}
            <span
              className="text-base uppercase tracking-[0.35em] select-none cursor-pointer"
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                color: "#C9A96E",
              }}
              onClick={() => navigate("/")}
            >
              Snitch
            </span>

            {/* Cart icon */}
            <button className="flex items-center gap-1.5 bg-transparent border-none cursor-pointer text-[#0d0d0b]">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-5 h-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007Z"
                />
              </svg>
              <span
                className="text-[0.6rem] tracking-[0.15em] uppercase"
                style={{ color: "#3d342c" }}
              >
                Bag
              </span>
            </button>
          </div>
        </header>

        {/* ── Marquee ticker ──────────────────────────────────────── */}
        <div
          className="overflow-hidden whitespace-nowrap py-2.5"
          style={{ backgroundColor: "#0d0d0b", color: "#C9A96E" }}
        >
          <div className="marquee-track inline-flex gap-12">
            {Array.from({ length: 8 }).map((_, i) => (
              <span
                key={i}
                className="text-[0.6rem] tracking-[0.25em] uppercase"
              >
                Free shipping over ₹999 &nbsp;·&nbsp; New arrivals weekly
                &nbsp;·&nbsp; Exclusive drops &nbsp;·&nbsp; Snitch — Wear the
                narrative
              </span>
            ))}
          </div>
        </div>

        {/* ── Hero ────────────────────────────────────────────────── */}
        <section
          ref={heroRef}
          className="max-w-[1400px] mx-auto px-8 pt-12 pb-12 flex flex-col gap-4 transition-all duration-[800ms] ease-out"
          style={{
            opacity: heroVisible ? 1 : 0,
            transform: heroVisible ? "translateY(0)" : "translateY(20px)",
          }}
        >
          <p
            className="text-[0.6rem] tracking-[0.25em] uppercase font-medium"
            style={{ color: "#C9A96E" }}
          >
            New Season — SS&apos;26
          </p>
          <h1
            className="m-0 font-light leading-[1.04] text-[clamp(3rem,7vw,6rem)]"
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              color: "#0d0d0b",
            }}
          >
            The Edit
          </h1>
          <p
            className="text-sm max-w-[420px] leading-[1.75] font-light"
            style={{ color: "#3d342c" }}
          >
            Curated essentials for the considered wardrobe. Each piece selected
            for its craft, finish, and enduring relevance.
          </p>
        </section>

        {/* ── Divider ─────────────────────────────────────────────── */}
        <div className="border-t" style={{ borderColor: "#e4e2df" }} />

        {/* ── Filter bar ──────────────────────────────────────────── */}
        <div className="max-w-[1400px] mx-auto px-8 py-5 flex items-center justify-between gap-4 flex-wrap">
          {/* Search */}
          <div className="relative flex-1 min-w-[220px] max-w-[360px]">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="#6b6158"
              className="w-3.5 h-3.5 absolute left-0 top-1/2 -translate-y-1/2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
              />
            </svg>
            <input
              type="text"
              placeholder="Search products…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="search-input w-full bg-transparent border-0 outline-none pl-5 pb-2 text-xs text-[#0d0d0b]"
              style={{
                borderBottom: "1px solid #d0c5b5",
                fontFamily: "'Inter', sans-serif",
                transition: "border-color 0.2s",
              }}
              onFocus={(e) => (e.target.style.borderBottomColor = "#C9A96E")}
              onBlur={(e) => (e.target.style.borderBottomColor = "#d0c5b5")}
            />
          </div>

          {/* Count + Sort */}
          <div className="flex items-center gap-6">
            <span
              className="text-[0.6rem] tracking-[0.18em] uppercase"
              style={{ color: "#6b6158" }}
            >
              {filtered.length} {filtered.length === 1 ? "item" : "items"}
            </span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-transparent border-0 outline-none text-[0.6rem] tracking-[0.15em] uppercase pb-1 cursor-pointer"
              style={{
                borderBottom: "1px solid #d0c5b5",
                color: "#3d342c",
                fontFamily: "'Inter', sans-serif",
              }}
            >
              <option value="default">Sort: Default</option>
              <option value="newest">Sort: Newest</option>
              <option value="price-asc">Price: Low → High</option>
              <option value="price-desc">Price: High → Low</option>
            </select>
          </div>
        </div>

        <div className="border-t" style={{ borderColor: "#e4e2df" }} />

        {/* ── Product Grid ────────────────────────────────────────── */}
        <main className="max-w-[1400px] mx-auto px-8 py-12 pb-24">
          {/* Loading skeleton */}
          {isLoading && (
            <div className="grid grid-cols-[repeat(auto-fill,minmax(260px,1fr))] gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} style={{ backgroundColor: "#f5f3f0" }}>
                  <div
                    className="aspect-[4/5] animate-pulse"
                    style={{ backgroundColor: "#e4e2df" }}
                  />
                  <div className="p-5 flex flex-col gap-3">
                    <div
                      className="h-2.5 rounded"
                      style={{ backgroundColor: "#e4e2df", width: "65%" }}
                    />
                    <div
                      className="h-2 rounded"
                      style={{ backgroundColor: "#e4e2df", width: "40%" }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Empty state */}
          {!isLoading && filtered.length === 0 && (
            <div className="flex flex-col items-center justify-center py-32 gap-5">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1}
                stroke="#d0c5b5"
                className="w-11 h-11"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M20.25 7.5l-.625 10.632a2.25 2.25 0 0 1-2.247 2.118H6.622a2.25 2.25 0 0 1-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z"
                />
              </svg>
              <p
                className="text-[0.6rem] tracking-[0.2em] uppercase"
                style={{ color: "#6b6158" }}
              >
                {search
                  ? "No products match your search"
                  : "No products available"}
              </p>
              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="bg-transparent border-none cursor-none text-[0.65rem] tracking-[0.15em] uppercase underline underline-offset-4 cursor-pointer"
                  style={{ color: "#C9A96E" }}
                >
                  Clear search
                </button>
              )}
            </div>
          )}

          {/* Product cards */}
          {!isLoading && filtered.length > 0 && (
            <div className="grid grid-cols-[repeat(auto-fill,minmax(260px,1fr))] gap-6">
              {filtered.map((product, idx) => (
                <ProductCard key={product._id} product={product} idx={idx} />
              ))}
            </div>
          )}
        </main>

        {/* ── Footer ──────────────────────────────────────────────── */}
        <footer
          className="border-t max-w-[1400px] mx-auto px-8 py-12 flex items-center justify-between flex-wrap gap-4"
          style={{ borderColor: "#e4e2df" }}
        >
          <span
            className="text-[0.9rem] tracking-[0.35em] uppercase"
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              color: "#C9A96E",
            }}
          >
            Snitch
          </span>
          <p
            className="text-[0.6rem] tracking-[0.15em] uppercase"
            style={{ color: "#6b6158" }}
          >
            © {new Date().getFullYear()} Snitch — All rights reserved
          </p>
        </footer>
      </div>
    </>
  );
};

/* ── ProductCard ──────────────────────────────────────────────── */
const ProductCard = ({ product, idx }) => {
  const [activeImg, setActiveImg] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const images = product.images ?? [];
  const hasMultiple = images.length > 1;
  const navigate = useNavigate();
  useEffect(() => {
    const t = setTimeout(() => setIsVisible(true), idx * 80);
    return () => clearTimeout(t);
  }, [idx]);

  return (
    <div
      className="card-hover flex flex-col cursor-pointer"
      style={{
        backgroundColor: "#f5f3f0",
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? "translateY(0)" : "translateY(20px)",
        transition: `opacity 0.55s ease ${idx * 0.06}s, transform 0.55s ease ${idx * 0.06}s`,
      }}
    >
      {/* Image zone */}
      <div
        onClick={() => navigate(`/product/${product._id}`)}
        className="relative aspect-[4/5] overflow-hidden"
        style={{ backgroundColor: "#e4e2df" }}
      >
        {images.length > 0 ? (
          <img
            src={images[activeImg]?.url}
            alt={product.title}
            className="w-full h-full object-cover transition-transform duration-700 ease-out"
            onMouseEnter={(e) =>
              (e.currentTarget.style.transform = "scale(1.05)")
            }
            onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1}
              stroke="#d0c5b5"
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

        {/* Wishlist button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            setIsWishlisted((w) => !w);
          }}
          className="absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center border-none cursor-pointer transition-transform duration-200 hover:scale-110"
          style={{
            background: "rgba(251,249,246,0.88)",
            color: isWishlisted ? "#C9A96E" : "#6b6158",
            transition: "color 0.25s, transform 0.2s",
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill={isWishlisted ? "currentColor" : "none"}
            stroke="currentColor"
            strokeWidth={1.5}
            className="w-3.5 h-3.5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
            />
          </svg>
        </button>

        {/* Image count badge */}
        {hasMultiple && (
          <span
            className="absolute bottom-3 left-3 text-[0.55rem] tracking-[0.15em] px-2 py-0.5"
            style={{
              backgroundColor: "rgba(251,249,246,0.85)",
              color: "#3d342c",
            }}
          >
            {activeImg + 1} / {images.length}
          </span>
        )}

        {/* Thumbnail scrubber */}
        {hasMultiple && (
          <div
            className="absolute bottom-0 left-0 right-0 flex gap-[3px] px-3 pb-3 pt-6"
            style={{
              background:
                "linear-gradient(to top, rgba(27,24,20,0.35) 0%, transparent 100%)",
            }}
          >
            {images.map((img, i) => (
              <button
                key={img._id ?? i}
                onMouseEnter={() => setActiveImg(i)}
                onClick={() => setActiveImg(i)}
                className="flex-1 h-0.5 border-none cursor-pointer transition-colors duration-200"
                style={{
                  backgroundColor:
                    i === activeImg ? "#C9A96E" : "rgba(255,255,255,0.45)",
                }}
              />
            ))}
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-5 flex flex-col gap-2.5 flex-1">
        <div className="flex items-start justify-between gap-3">
          <h2
            className="m-0 flex-1 text-[1.05rem] font-light leading-snug line-clamp-2"
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              color: "#0d0d0b",
            }}
          >
            {product.title}
          </h2>
          <span
            className="text-sm font-medium whitespace-nowrap"
            style={{ color: "#C9A96E" }}
          >
            {fmt(product.price.amount, product.price.currency)}
          </span>
        </div>

        {product.description && (
          <p
            className="m-0 text-[0.7rem] leading-[1.7] font-light line-clamp-2"
            style={{ color: "#3d342c" }}
          >
            {product.description}
          </p>
        )}

        {/* Footer row */}
        <div
          className="mt-auto pt-4 border-t flex items-center justify-between"
          style={{ borderColor: "#e4e2df" }}
        >
          <button
            className="text-[0.55rem] tracking-[0.2em] uppercase px-4 py-2 border-none cursor-pointer font-medium transition-all duration-300"
            style={{
              backgroundColor: "#0d0d0b",
              color: "#fbf9f6",
              fontFamily: "'Inter', sans-serif",
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
            Add to Bag
          </button>
          <span
            className="text-[0.55rem] tracking-[0.15em] uppercase"
            style={{ color: "#6b6158" }}
          >
            {images.length} {images.length === 1 ? "photo" : "photos"}
          </span>
        </div>
      </div>
    </div>
  );
};

export default Home;
