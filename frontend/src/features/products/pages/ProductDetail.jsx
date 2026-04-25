import React, { useState, useEffect } from "react";
import { useProduct } from "../hooks/useProduct";
import { useParams, useNavigate } from "react-router";

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

/* ── ProductDetail ────────────────────────────────────────────── */
const ProductDetail = () => {
  const { productId } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeImg, setActiveImg] = useState(0);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [visible, setVisible] = useState(false);
  const [imgHovered, setImgHovered] = useState(false);

  const { handleGetProductDetails } = useProduct();

  useEffect(() => {
    setIsLoading(true);
    handleGetProductDetails(productId)
      .then((data) => {
        setProduct(data);
        setActiveImg(0);
      })
      .finally(() => {
        setIsLoading(false);
        setTimeout(() => setVisible(true), 60);
      });
  }, [productId]);

  const images = product?.images ?? [];

  /* ── Skeleton ─────────────────────────────────────────────── */
  if (isLoading) {
    return (
      <>
        <FontLink />
        <div
          className="min-h-screen"
          style={{
            backgroundColor: "#fbf9f6",
            fontFamily: "'Inter', sans-serif",
          }}
        >
          <Navbar navigate={navigate} />
          <div className="max-w-[1200px] mx-auto px-6 lg:px-12 py-14 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
            {/* Image skeleton */}
            <div className="flex flex-col gap-4">
              <div
                className="w-full aspect-[4/5] animate-pulse rounded-sm"
                style={{ backgroundColor: "#e4e2df" }}
              />
              <div className="flex gap-3">
                {[0, 1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="w-16 h-20 animate-pulse rounded-sm"
                    style={{ backgroundColor: "#e4e2df" }}
                  />
                ))}
              </div>
            </div>
            {/* Info skeleton */}
            <div className="flex flex-col gap-6 pt-2">
              <div
                className="h-3 w-24 animate-pulse rounded"
                style={{ backgroundColor: "#e4e2df" }}
              />
              <div
                className="h-10 w-4/5 animate-pulse rounded"
                style={{ backgroundColor: "#e4e2df" }}
              />
              <div
                className="h-6 w-28 animate-pulse rounded"
                style={{ backgroundColor: "#e4e2df" }}
              />
              <div className="flex flex-col gap-2">
                <div
                  className="h-2.5 w-full animate-pulse rounded"
                  style={{ backgroundColor: "#e4e2df" }}
                />
                <div
                  className="h-2.5 w-5/6 animate-pulse rounded"
                  style={{ backgroundColor: "#e4e2df" }}
                />
                <div
                  className="h-2.5 w-3/4 animate-pulse rounded"
                  style={{ backgroundColor: "#e4e2df" }}
                />
              </div>
              <div className="flex gap-4 mt-4">
                <div
                  className="h-12 flex-1 animate-pulse rounded-sm"
                  style={{ backgroundColor: "#e4e2df" }}
                />
                <div
                  className="h-12 flex-1 animate-pulse rounded-sm"
                  style={{ backgroundColor: "#e4e2df" }}
                />
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  /* ── Error / not found ────────────────────────────────────── */
  if (!product) {
    return (
      <>
        <FontLink />
        <div
          className="min-h-screen flex flex-col"
          style={{
            backgroundColor: "#fbf9f6",
            fontFamily: "'Inter', sans-serif",
          }}
        >
          <Navbar navigate={navigate} />
          <div className="flex-1 flex flex-col items-center justify-center gap-6 py-32">
            <p
              className="text-[0.6rem] tracking-[0.25em] uppercase"
              style={{ color: "#6b6158" }}
            >
              Product not found
            </p>
            <button
              onClick={() => navigate("/")}
              className="text-[0.6rem] tracking-[0.2em] uppercase underline underline-offset-4"
              style={{
                color: "#C9A96E",
                background: "none",
                border: "none",
                cursor: "pointer",
              }}
            >
              Back to collection
            </button>
          </div>
        </div>
      </>
    );
  }

  /* ── Main render ──────────────────────────────────────────── */
  return (
    <>
      <FontLink />
      <style>{`
        .thumb-btn { transition: opacity 0.2s, border-color 0.2s; }
        .thumb-btn:hover { opacity: 1 !important; }
        .pdp-btn-dark { transition: background-color 0.3s, color 0.3s; }
        .pdp-btn-dark:hover { background-color: #C9A96E !important; color: #0d0d0b !important; }
        .pdp-btn-outline { transition: background-color 0.3s, color 0.3s, border-color 0.3s; }
        .pdp-btn-outline:hover { background-color: #0d0d0b !important; color: #fbf9f6 !important; border-color: #0d0d0b !important; }
        ::selection { background: rgba(201,169,110,0.28); }
        .zoom-img { transition: transform 0.6s cubic-bezier(0.25,0.46,0.45,0.94); }
        .zoom-img:hover { transform: scale(1.06); }
        .no-scrollbar { scrollbar-width: none; -ms-overflow-style: none; }
        .no-scrollbar::-webkit-scrollbar { display: none; }
      `}</style>

      <div
        className="min-h-screen"
        style={{
          backgroundColor: "#fbf9f6",
          fontFamily: "'Inter', sans-serif",
          color: "#0d0d0b",
        }}
      >
        {/* ── Navbar ─────────────────────────────────────────────── */}
        <Navbar navigate={navigate} />

        {/* ── Marquee ────────────────────────────────────────────── */}
        <Marquee />

        {/* ── Breadcrumb ─────────────────────────────────────────── */}
        <div
          className="max-w-[1200px] mx-auto px-6 lg:px-12 pt-8 pb-2 flex items-center gap-2"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(10px)",
            transition: "opacity 0.5s ease, transform 0.5s ease",
          }}
        >
          <button
            onClick={() => navigate("/")}
            className="text-[0.6rem] tracking-[0.2em] uppercase bg-transparent border-none cursor-pointer"
            style={{ color: "#6b6158" }}
          >
            Collection
          </button>
          <span className="text-[0.6rem]" style={{ color: "#d0c5b5" }}>
            /
          </span>
          <span
            className="text-[0.6rem] tracking-[0.2em] uppercase"
            style={{ color: "#3d342c" }}
          >
            {product.title}
          </span>
        </div>

        {/* ── Main grid ──────────────────────────────────────────── */}
        <main
          className="max-w-[1200px] mx-auto px-6 lg:px-12 py-8 pb-24 grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-20"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(20px)",
            transition: "opacity 0.6s ease 0.08s, transform 0.6s ease 0.08s",
          }}
        >
          {/* ── LEFT: Image gallery ──────────────────────────────── */}
          <div className="flex flex-row gap-3">
            {/* Vertical thumbnail rail */}
            {images.length > 1 && (
              <div
                className="no-scrollbar flex flex-col gap-2.5 overflow-y-auto"
                style={{ maxHeight: "600px" }}
              >
                {images.map((img, i) => (
                  <button
                    key={img._id ?? i}
                    onClick={() => setActiveImg(i)}
                    aria-label={`View image ${i + 1}`}
                    className="thumb-btn flex-shrink-0 overflow-hidden rounded-sm border-[1.5px] bg-transparent p-0 cursor-pointer"
                    style={{
                      width: "68px",
                      height: "86px",
                      borderColor: i === activeImg ? "#C9A96E" : "#e4e2df",
                      opacity: i === activeImg ? 1 : 0.55,
                    }}
                  >
                    <img
                      src={img.url}
                      alt={`Thumbnail ${i + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}

            {/* Hero image */}
            <div
              className="relative flex-1 overflow-hidden rounded-sm"
              style={{ backgroundColor: "#f0ede9", height: "600px" }}
              onMouseEnter={() => setImgHovered(true)}
              onMouseLeave={() => setImgHovered(false)}
            >
              {images.length > 0 ? (
                <img
                  key={activeImg}
                  src={images[activeImg]?.url}
                  alt={`${product.title} — view ${activeImg + 1}`}
                  className="zoom-img w-full h-full object-cover"
                  style={{ animation: "fadeIn 0.35s ease" }}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1}
                    stroke="#d0c5b5"
                    className="w-12 h-12"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
                    />
                  </svg>
                </div>
              )}

              {/* Image counter badge */}
              {images.length > 1 && (
                <span
                  className="absolute bottom-4 left-4 text-[0.55rem] tracking-[0.15em] uppercase px-2.5 py-1"
                  style={{
                    backgroundColor: "rgba(251,249,246,0.88)",
                    color: "#3d342c",
                    transition: "opacity 0.25s ease",
                    opacity: imgHovered ? 1 : 0,
                  }}
                >
                  {activeImg + 1} / {images.length}
                </span>
              )}

              {/* Wishlist button */}
              <button
                onClick={() => setIsWishlisted((w) => !w)}
                aria-label="Toggle wishlist"
                className="absolute top-4 right-4 w-9 h-9 rounded-full flex items-center justify-center border-none cursor-pointer"
                style={{
                  background: "rgba(251,249,246,0.90)",
                  color: isWishlisted ? "#C9A96E" : "#6b6158",
                  transition: "color 0.25s, transform 0.2s, opacity 0.25s",
                  boxShadow: "0 2px 8px rgba(27,24,20,0.08)",
                  opacity: imgHovered ? 1 : 0,
                  pointerEvents: imgHovered ? "auto" : "none",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.transform = "scale(1.1)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.transform = "scale(1)")
                }
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill={isWishlisted ? "currentColor" : "none"}
                  stroke="currentColor"
                  strokeWidth={1.5}
                  className="w-4 h-4"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
                  />
                </svg>
              </button>

              {/* Up / Down arrows */}
              {images.length > 1 && (
                <>
                  <button
                    onClick={() =>
                      setActiveImg(
                        (i) => (i - 1 + images.length) % images.length,
                      )
                    }
                    aria-label="Previous image"
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full flex items-center justify-center border-none cursor-pointer"
                    style={{
                      background: "rgba(251,249,246,0.82)",
                      color: "#0d0d0b",
                      transition: "background 0.2s, opacity 0.25s",
                      opacity: imgHovered ? 1 : 0,
                      pointerEvents: imgHovered ? "auto" : "none",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.background =
                        "rgba(201,169,110,0.92)")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.background =
                        "rgba(251,249,246,0.82)")
                    }
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={2}
                      stroke="currentColor"
                      className="w-3.5 h-3.5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15.75 19.5 8.25 12l7.5-7.5"
                      />
                    </svg>
                  </button>
                  <button
                    onClick={() => setActiveImg((i) => (i + 1) % images.length)}
                    aria-label="Next image"
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full flex items-center justify-center border-none cursor-pointer"
                    style={{
                      background: "rgba(251,249,246,0.82)",
                      color: "#0d0d0b",
                      transition: "background 0.2s, opacity 0.25s",
                      opacity: imgHovered ? 1 : 0,
                      pointerEvents: imgHovered ? "auto" : "none",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.background =
                        "rgba(201,169,110,0.92)")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.background =
                        "rgba(251,249,246,0.82)")
                    }
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={2}
                      stroke="currentColor"
                      className="w-3.5 h-3.5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="m8.25 4.5 7.5 7.5-7.5 7.5"
                      />
                    </svg>
                  </button>
                </>
              )}
            </div>
          </div>

          {/* ── RIGHT: Product info ──────────────────────────────── */}
          <div className="flex flex-col gap-6 lg:pt-2">
            {/* Label */}
            <p
              className="text-[0.6rem] tracking-[0.28em] uppercase m-0"
              style={{ color: "#C9A96E" }}
            >
              New Season · SS&apos;26
            </p>

            {/* Title */}
            <h1
              className="m-0 font-light leading-[1.1] text-[clamp(2rem,4vw,2.8rem)]"
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                color: "#0d0d0b",
              }}
            >
              {product.title}
            </h1>

            {/* Price */}
            <div className="flex items-baseline gap-3">
              <span
                className="text-2xl font-medium"
                style={{ color: "#C9A96E" }}
              >
                {fmt(product.price?.amount, product.price?.currency)}
              </span>
              <span
                className="text-[0.6rem] tracking-[0.15em] uppercase"
                style={{ color: "#6b6158" }}
              >
                incl. of all taxes
              </span>
            </div>

            {/* Divider */}
            <div className="border-t" style={{ borderColor: "#e4e2df" }} />

            {/* Description */}
            {product.description && (
              <p
                className="m-0 text-sm leading-[1.85] font-light"
                style={{ color: "#3d342c" }}
              >
                {product.description}
              </p>
            )}

            {/* Tags / badges */}
            <div className="flex flex-wrap gap-2">
              {["Free Shipping", "Easy Returns", "Authentic"].map((tag) => (
                <span
                  key={tag}
                  className="text-[0.55rem] tracking-[0.15em] uppercase px-3 py-1.5 rounded-sm"
                  style={{ backgroundColor: "#f0ede9", color: "#3d342c" }}
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* Divider */}
            <div className="border-t" style={{ borderColor: "#e4e2df" }} />

            {/* ── CTA buttons ───────────────────────────────────── */}
            <div className="flex flex-col sm:flex-row gap-3">
              {/* Add to Cart */}
              <button
                id="btn-add-to-cart"
                className="pdp-btn-outline flex-1 flex items-center justify-center gap-2 py-4 text-[0.65rem] tracking-[0.22em] uppercase font-medium rounded-sm border cursor-pointer"
                style={{
                  backgroundColor: "transparent",
                  color: "#0d0d0b",
                  borderColor: "#0d0d0b",
                  fontFamily: "'Inter', sans-serif",
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-4 h-4"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007Z"
                  />
                </svg>
                Add to Cart
              </button>

              {/* Buy Now */}
              <button
                id="btn-buy-now"
                className="pdp-btn-dark flex-1 flex items-center justify-center gap-2 py-4 text-[0.65rem] tracking-[0.22em] uppercase font-medium rounded-sm border-none cursor-pointer"
                style={{
                  backgroundColor: "#0d0d0b",
                  color: "#fbf9f6",
                  fontFamily: "'Inter', sans-serif",
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-4 h-4"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z"
                  />
                </svg>
                Buy Now
              </button>
            </div>

            {/* Product meta */}
            <div
              className="flex flex-col gap-2 pt-2 border-t"
              style={{ borderColor: "#e4e2df" }}
            >
              <MetaRow label="Product ID" value={product._id} mono />
              <MetaRow
                label="Listed on"
                value={new Date(product.createdAt).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              />
              <MetaRow
                label="Photos"
                value={`${images.length} ${images.length === 1 ? "image" : "images"}`}
              />
            </div>
          </div>
        </main>

        {/* ── Footer ─────────────────────────────────────────────── */}
        <footer
          className="border-t max-w-[1200px] mx-auto px-6 lg:px-12 py-10 flex items-center justify-between flex-wrap gap-4"
          style={{ borderColor: "#e4e2df" }}
        >
          <span
            className="text-[0.9rem] tracking-[0.35em] uppercase cursor-pointer"
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              color: "#C9A96E",
            }}
            onClick={() => navigate("/")}
          >
            Snitch
          </span>
          <p
            className="text-[0.6rem] tracking-[0.15em] uppercase m-0"
            style={{ color: "#6b6158" }}
          >
            © {new Date().getFullYear()} Snitch — All rights reserved
          </p>
        </footer>
      </div>
    </>
  );
};

/* ── Sub-components ───────────────────────────────────────────── */

const Navbar = ({ navigate }) => (
  <header
    className="sticky top-0 z-50 border-b"
    style={{ backgroundColor: "#fbf9f6", borderColor: "#e4e2df" }}
  >
    <div className="max-w-[1200px] mx-auto px-6 lg:px-12 h-[68px] flex items-center justify-between gap-6">
      <span
        className="text-base uppercase tracking-[0.35em] select-none cursor-pointer"
        style={{ fontFamily: "'Cormorant Garamond', serif", color: "#C9A96E" }}
        onClick={() => navigate("/")}
      >
        Snitch
      </span>
      <button
        className="flex items-center gap-1.5 bg-transparent border-none cursor-pointer"
        style={{ color: "#0d0d0b" }}
      >
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
);

const Marquee = () =>
  (
    <style>{`
    @keyframes marquee { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
    .marquee-track { animation: marquee 28s linear infinite; }
  `}</style>
  ) && (
    <div
      className="overflow-hidden whitespace-nowrap py-2.5"
      style={{ backgroundColor: "#0d0d0b", color: "#C9A96E" }}
    >
      <div className="marquee-track inline-flex gap-12">
        {Array.from({ length: 8 }).map((_, i) => (
          <span key={i} className="text-[0.6rem] tracking-[0.25em] uppercase">
            Free shipping over ₹999 &nbsp;·&nbsp; New arrivals weekly
            &nbsp;·&nbsp; Exclusive drops &nbsp;·&nbsp; Snitch — Wear the
            narrative
          </span>
        ))}
      </div>
    </div>
  );

const MetaRow = ({ label, value, mono = false }) => (
  <div className="flex items-center justify-between gap-4">
    <span
      className="text-[0.6rem] tracking-[0.15em] uppercase"
      style={{ color: "#6b6158" }}
    >
      {label}
    </span>
    <span
      className={`text-[0.65rem] ${mono ? "font-mono" : ""} text-right`}
      style={{ color: "#3d342c", maxWidth: "60%" }}
    >
      {value}
    </span>
  </div>
);

export default ProductDetail;
