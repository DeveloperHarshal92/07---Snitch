import React, { useState, useEffect, useMemo } from "react";
import { useSelector } from "react-redux";
import { useProduct } from "../hooks/useProduct";
import { useParams, useNavigate } from "react-router";
import { useCart } from "../../cart/hooks/useCart";
import ReviewSection from "../components/ReviewSection";

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
/* ── Client-side similarity scorer ───────────────────────────── */
const tokenize = (text = "") =>
  text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((t) => t.length > 2);

const similarityScore = (a, b) => {
  const ta = new Set(tokenize(`${a.title} ${a.description ?? ""}`));
  const tb = tokenize(`${b.title} ${b.description ?? ""}`);
  let shared = 0;
  for (const t of tb) if (ta.has(t)) shared++;
  return shared;
};

const ProductDetail = () => {
  const { productId } = useParams();
  const navigate = useNavigate();

  const allProducts = useSelector((state) => state.product.products);
  const user = useSelector((state) => state.auth.user);

  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeImg, setActiveImg] = useState(0);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [visible, setVisible] = useState(false);
  const [imgHovered, setImgHovered] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [addSuccess, setAddSuccess] = useState(false);

  const { handleGetProductDetails, handleGetAllProducts } = useProduct();
  const { handleAddToCart } = useCart();

  // null = "Main" (product itself), string = variant._id
  const [selectedVariantId, setSelectedVariantId] = useState(null);
  // Tracks each attr key the user has explicitly chosen, persists across Main toggle
  const [chosenAttrs, setChosenAttrs] = useState({});

  useEffect(() => {
    setIsLoading(true);
    setVisible(false);
    handleGetProductDetails(productId)
      .then((data) => {
        setProduct(data);
        setActiveImg(0);
        setSelectedVariantId(null);
        setChosenAttrs({});
      })
      .finally(() => {
        setIsLoading(false);
        setTimeout(() => setVisible(true), 60);
      });
  }, [productId]);

  /* Ensure catalogue is loaded for recommendations */
  useEffect(() => {
    if (allProducts.length === 0) handleGetAllProducts();
  }, []);

  /* Top-4 recommended products (exclude current) */
  const recommendations = useMemo(() => {
    if (!product || allProducts.length === 0) return [];
    return allProducts
      .filter((p) => p._id !== product._id)
      .map((p) => ({ product: p, score: similarityScore(product, p) }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 4)
      .map((x) => x.product);
  }, [product, allProducts]);

  const selectedVariant =
    selectedVariantId === null
      ? null
      : ((product?.variants ?? []).find((v) => v._id === selectedVariantId) ??
        null);

  // Fall back to product-level values when Main is active
  const displayImages = selectedVariant?.images?.length
    ? selectedVariant.images
    : (product?.images ?? []);
  const displayPrice = {
    amount: selectedVariant?.price?.amount ?? product?.price?.amount,
    currency:
      selectedVariant?.price?.currency ?? product?.price?.currency ?? "INR",
  };
  const displayStock = selectedVariant ? (selectedVariant.stock ?? 0) : null;

  // All unique attribute keys across variants e.g. ["Size", "Color"]
  const allAttrKeys = product
    ? [
        ...new Set(
          (product.variants ?? []).flatMap((v) =>
            Object.keys(v.attributes ?? {}),
          ),
        ),
      ]
    : [];

  // Unique values for a given attr key e.g. ["S", "M", "XL"]
  const attrValues = (key) => [
    ...new Set(
      (product?.variants ?? []).map((v) => v.attributes?.[key]).filter(Boolean),
    ),
  ];

  // Which value is "active" for a given key — use chosenAttrs (explicit user picks)
  // so the highlight always reflects what the user actually clicked
  const activeAttrValue = (key) => chosenAttrs[key] ?? null;

  // When user picks an attr value:
  // 1. Persist that choice in chosenAttrs
  // 2. Find the variant that best matches ALL chosen attrs
  const pickAttrValue = (key, val) => {
    const next = { ...chosenAttrs, [key]: val };
    setChosenAttrs(next);
    let best = null,
      bestScore = -1;
    for (const v of product.variants) {
      let score = 0;
      for (const [k, dv] of Object.entries(next)) {
        if (v.attributes?.[k] === dv) score++;
      }
      if (score > bestScore) {
        bestScore = score;
        best = v;
      }
    }
    if (best) {
      setSelectedVariantId(best._id);
      setActiveImg(0);
    }
  };

  const images = displayImages;

  /* ── Skeleton ─────────────────────────────────────────────── */
  if (isLoading) {
    return (
      <>
        <FontLink />
        <div
          style={{
            backgroundColor: "#fbf9f6",
            fontFamily: "'Inter', sans-serif",
          }}
        >
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
        .zoom-img:hover { transform: scale(1.02); }
        .no-scrollbar { scrollbar-width: none; -ms-overflow-style: none; }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .attr-btn:hover:not([data-selected="true"]) { border-color: #0d0d0b !important; }

        /* ── Recommendation rail ── */
        @keyframes recFadeIn {
          from { opacity: 0; transform: translateY(18px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .rec-section { animation: recFadeIn 0.55s ease 0.25s both; }
        .rec-card { transition: box-shadow 0.3s ease, transform 0.3s ease; cursor: pointer; }
        .rec-card:hover { box-shadow: 0 14px 44px rgba(27,24,20,0.11); transform: translateY(-4px); }
        .rec-card:hover .rec-img { transform: scale(1.05); }
        .rec-img { transition: transform 0.6s cubic-bezier(0.25,0.46,0.45,0.94); }
        .rec-cta {
          position: absolute; bottom: 0; left: 0; right: 0;
          padding: 10px 14px;
          background: linear-gradient(to top, rgba(13,13,11,0.78) 0%, transparent 100%);
          opacity: 0;
          transition: opacity 0.25s ease;
          display: flex; align-items: center; justify-content: center;
        }
        .rec-card:hover .rec-cta { opacity: 1; }
      `}</style>

      <div
        className="min-h-screen bg-[#fbf9f6] dark:bg-[#0a0908] text-[#0d0d0b] dark:text-[#fbf9f6] transition-colors duration-300"
        style={{
          fontFamily: "'Inter', sans-serif",
        }}
      >

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
            className="text-[0.6rem] tracking-[0.2em] uppercase bg-transparent border-none cursor-pointer text-[#6b6158] dark:text-[#a8a29e] hover:text-[#C9A96E]"
          >
            Collection
          </button>
          <span className="text-[0.6rem] text-[#d0c5b5] dark:text-[#38332e]">
            /
          </span>
          <span
            className="text-[0.6rem] tracking-[0.2em] uppercase text-[#3d342c] dark:text-[#d6d3d1]"
          >
            {product.title}
          </span>
        </div>

        {/* ── Main grid ──────────────────────────────────────────── */}
        <main
          className="max-w-[1200px] mx-auto px-5 sm:px-6 lg:px-12 py-6 md:py-8 pb-24 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(20px)",
            transition: "opacity 0.6s ease 0.08s, transform 0.6s ease 0.08s",
          }}
        >
          {/* ── LEFT: Image gallery (Responsive) ─────────────────── */}
          <div className="flex flex-col-reverse sm:flex-row gap-3">
            {/* Thumbnail rail: horizontal on mobile, vertical on sm+ */}
            {images.length > 1 && (
              <div
                className="no-scrollbar flex flex-row sm:flex-col gap-2.5 overflow-x-auto sm:overflow-y-auto pb-2 sm:pb-0"
                style={{ maxHeight: "600px" }}
              >
                {images.map((img, i) => (
                  <button
                    key={img._id ?? i}
                    onClick={() => setActiveImg(i)}
                    aria-label={`View image ${i + 1}`}
                    className="thumb-btn flex-shrink-0 overflow-hidden rounded-md border-[1.5px] bg-[#f5f3f0] p-0 cursor-pointer transition-all"
                    style={{
                      width: "60px",
                      height: "76px",
                      borderColor: i === activeImg ? "#C9A96E" : "#e4e2df",
                      opacity: i === activeImg ? 1 : 0.65,
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
              className="relative flex-1 rounded-xl overflow-hidden shadow-sm"
              style={{ backgroundColor: "#f5f3f0", minHeight: "360px" }}
              onMouseEnter={() => setImgHovered(true)}
              onMouseLeave={() => setImgHovered(false)}
            >
              {images.length > 0 ? (
                <img
                  key={activeImg}
                  src={images[activeImg]?.url}
                  alt={`${product.title} — view ${activeImg + 1}`}
                  className="zoom-img w-full h-full object-contain rounded-sm"
                  style={{
                    animation: "fadeIn 0.35s ease",
                    display: "block",
                    maxWidth: "100%",
                  }}
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
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full flex items-center justify-center border-none cursor-pointer bg-[#fbf9f6]/90 dark:bg-[#141210]/90 text-[#0d0d0b] dark:text-[#fbf9f6] hover:bg-[#C9A96E] hover:text-[#0d0d0b] transition-all shadow-sm"
                    style={{
                      opacity: imgHovered ? 1 : 0,
                      pointerEvents: imgHovered ? "auto" : "none",
                    }}
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
              className="text-[0.6rem] tracking-[0.28em] uppercase m-0 text-[#C9A96E]"
            >
              New Season · SS&apos;26
            </p>

            {/* Title */}
            <h1
              className="m-0 font-light leading-[1.1] text-[clamp(2rem,4vw,2.8rem)] text-[#0d0d0b] dark:text-white"
              style={{
                fontFamily: "'Cormorant Garamond', serif",
              }}
            >
              {product.title}
            </h1>

            {/* Price */}
            <div className="flex items-baseline gap-3">
              <span
                className="text-2xl font-medium text-[#C9A96E]"
              >
                {fmt(displayPrice.amount, displayPrice.currency)}
              </span>
              <span
                className="text-[0.6rem] tracking-[0.15em] uppercase text-[#6b6158] dark:text-[#a8a29e]"
              >
                incl. of all taxes
              </span>
            </div>

            {/* ── Variant selector ──────────────────────────── */}
            {product?.variants?.length > 0 && (
              <div className="flex flex-col gap-4">
                {/* ── Main row ───────────────────────────────────── */}
                <div className="flex flex-col gap-2">
                  <p
                    className="m-0 text-[0.6rem] tracking-[0.22em] uppercase text-[#6b6158] dark:text-[#a8a29e]"
                  >
                    View
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => {
                        setSelectedVariantId(null);
                        setChosenAttrs({});
                        setActiveImg(0);
                      }}
                      className={`text-[0.6rem] tracking-[0.12em] uppercase px-3.5 py-2 rounded-sm border cursor-pointer transition-all duration-200 ${
                        selectedVariantId === null
                          ? "bg-[#C9A96E] text-[#0d0d0b] border-[#C9A96E] font-medium"
                          : "bg-transparent text-[#6b6158] dark:text-[#d6d3d1] border-[#d0c5b5] dark:border-[#38332e] hover:border-[#C9A96E]"
                      }`}
                    >
                      Original
                    </button>
                  </div>
                </div>

                {/* ── One row per attribute key ───────────────────── */}
                {allAttrKeys.map((attrKey) => (
                  <div key={attrKey} className="flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                      <p
                        className="m-0 text-[0.6rem] tracking-[0.22em] uppercase text-[#6b6158] dark:text-[#a8a29e]"
                      >
                        {attrKey}
                      </p>
                      {chosenAttrs[attrKey] && (
                        <span
                          className="text-[0.6rem] tracking-[0.1em] text-[#3d342c] dark:text-[#d6d3d1]"
                        >
                          {chosenAttrs[attrKey]}
                        </span>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {attrValues(attrKey).map((val) => {
                        const isActive = activeAttrValue(attrKey) === val;
                        const outOfStock = !(product?.variants ?? []).some(
                          (v) =>
                            v.attributes?.[attrKey] === val &&
                            (v.stock ?? 0) > 0,
                        );
                        return (
                          <button
                            key={val}
                            onClick={() => pickAttrValue(attrKey, val)}
                            className={`text-[0.6rem] tracking-[0.12em] uppercase px-3.5 py-2 rounded-sm border cursor-pointer transition-all duration-200 ${
                              isActive
                                ? "bg-[#0d0d0b] dark:bg-[#fbf9f6] text-[#fbf9f6] dark:text-[#0d0d0b] border-[#0d0d0b] dark:border-white font-medium shadow-sm"
                                : outOfStock
                                  ? "bg-transparent text-[#a8a29e] dark:text-[#78716c] border-[#e4e2df] dark:border-[#292522] line-through"
                                  : "bg-transparent text-[#0d0d0b] dark:text-[#fbf9f6] border-[#d0c5b5] dark:border-[#38332e] hover:border-[#C9A96E]"
                            }`}
                          >
                            {val}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}

                {/* Stock indicator — only when a variant is active */}
                {displayStock !== null && (
                  <p
                    className="m-0 text-[0.6rem] tracking-[0.18em] uppercase"
                    style={{
                      color:
                        displayStock === 0
                          ? "#ef4444"
                          : displayStock <= 5
                            ? "#eab308"
                            : "#22c55e",
                    }}
                  >
                    {displayStock === 0
                      ? "Out of stock"
                      : displayStock <= 5
                        ? `Only ${displayStock} left`
                        : `${displayStock} in stock`}
                  </p>
                )}
              </div>
            )}

            {/* Divider */}
            <div className="border-t border-[#e4e2df] dark:border-[#292522]" />

            {/* Description */}
            {product.description && (
              <p
                className="m-0 text-sm leading-[1.85] font-light text-[#3d342c] dark:text-[#d6d3d1]"
              >
                {product.description}
              </p>
            )}

            {/* Tags / badges */}
            <div className="flex flex-wrap gap-2">
              {["Free Shipping", "Easy Returns", "Authentic"].map((tag) => (
                <span
                  key={tag}
                  className="text-[0.55rem] tracking-[0.15em] uppercase px-3 py-1.5 rounded-sm bg-[#f0ede9] dark:bg-[#1c1916] text-[#3d342c] dark:text-[#d6d3d1] border border-transparent dark:border-[#292522]"
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* Divider */}
            <div className="border-t border-[#e4e2df] dark:border-[#292522]" />

            {/* ── CTA buttons ───────────────────────────────────── */}
            <div className="flex flex-col sm:flex-row gap-3">
              {/* Add to Cart */}
              <button
                onClick={async () => {
                  if (!user) {
                    navigate("/login");
                    return;
                  }
                  if (isAdding) return;
                  try {
                    setIsAdding(true);
                    await handleAddToCart({
                      productId: product._id,
                      variantId: selectedVariantId,
                    });
                    setAddSuccess(true);
                    setTimeout(() => setAddSuccess(false), 2200);
                  } catch (err) {
                    console.error("Failed to add to cart:", err);
                  } finally {
                    setIsAdding(false);
                  }
                }}
                disabled={isAdding}
                id="btn-add-to-cart"
                className={`flex-1 flex items-center justify-center gap-2 py-4 text-[0.65rem] tracking-[0.22em] uppercase font-medium rounded-sm border cursor-pointer transition-all duration-300 ${
                  addSuccess
                    ? "bg-[#16a34a] text-white border-[#16a34a]"
                    : "bg-transparent text-[#0d0d0b] dark:text-[#fbf9f6] border-[#0d0d0b] dark:border-white/40 hover:border-[#C9A96E] hover:text-[#C9A96E] dark:hover:border-[#C9A96E] dark:hover:text-[#C9A96E]"
                }`}
              >
                {addSuccess ? (
                  <>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={2}
                      stroke="currentColor"
                      className="w-4 h-4"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="m4.5 12.75 6 6 9-13.5"
                      />
                    </svg>
                    Added to Bag
                  </>
                ) : (
                  <>
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
                    {isAdding ? "Adding..." : "Add to Cart"}
                  </>
                )}
              </button>

              {/* Buy Now */}
              <button
                onClick={async () => {
                  if (!user) {
                    navigate("/login");
                    return;
                  }
                  if (isAdding) return;
                  try {
                    setIsAdding(true);
                    await handleAddToCart({
                      productId: product._id,
                      variantId: selectedVariantId,
                    });
                    navigate("/cart");
                  } catch (err) {
                    console.error("Failed to proceed to checkout:", err);
                  } finally {
                    setIsAdding(false);
                  }
                }}
                disabled={isAdding}
                id="btn-buy-now"
                className="flex-1 flex items-center justify-center gap-2 py-4 text-[0.65rem] tracking-[0.22em] uppercase font-medium rounded-sm border-none cursor-pointer bg-[#0d0d0b] dark:bg-[#fbf9f6] text-[#fbf9f6] dark:text-[#0d0d0b] hover:bg-[#C9A96E] hover:text-[#0d0d0b] dark:hover:bg-[#C9A96E] dark:hover:text-[#0d0d0b] transition-all duration-300 shadow-sm"
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
              className="flex flex-col gap-2 pt-2 border-t border-[#e4e2df] dark:border-[#292522]"
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

        {/* ── Customer Reviews ─────────────────────────────────────── */}
        <ReviewSection productId={productId} />

        {/* ── You May Also Like ────────────────────────────────────── */}
        {recommendations.length > 0 && (
          <section
            className="rec-section border-t border-[#e4e2df] dark:border-[#292522] py-14"
          >
            <div className="max-w-[1200px] mx-auto px-6 lg:px-12">
              {/* Header */}
              <div
                className="flex items-end justify-between mb-8"
              >
                <div className="flex flex-col gap-1">
                  <p
                    className="m-0 text-[0.6rem] tracking-[0.28em] uppercase text-[#C9A96E]"
                  >
                    Curated for you
                  </p>
                  <h2
                    className="m-0 text-3xl md:text-4xl font-light text-[#0d0d0b] dark:text-white leading-tight"
                    style={{
                      fontFamily: "'Cormorant Garamond', serif",
                    }}
                  >
                    You May Also Like
                  </h2>
                </div>
                <button
                  onClick={() => navigate("/")}
                  className="bg-transparent border-none cursor-pointer text-[0.6rem] tracking-[0.18em] uppercase text-[#6b6158] dark:text-[#a8a29e] hover:text-[#C9A96E] underline underline-offset-4"
                >
                  View all →
                </button>
              </div>

              {/* Card rail */}
              <div
                className="no-scrollbar grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-5"
              >
                {recommendations.map((rec, idx) => {
                  const thumb = rec.images?.[0]?.url;
                  return (
                    <div
                      key={rec._id}
                      className="rec-card bg-[#f5f3f0] dark:bg-[#161412] border border-[#e4e2df] dark:border-[#292522] rounded-lg overflow-hidden flex flex-col cursor-pointer transition-all duration-300 hover:border-[#C9A96E]"
                      onClick={() => navigate(`/product/${rec._id}`)}
                      style={{
                        opacity: 0,
                        animation: `recFadeIn 0.5s ease ${0.1 + idx * 0.1}s forwards`,
                      }}
                    >
                      {/* Image zone */}
                      <div
                        className="relative overflow-hidden aspect-[4/5] bg-[#e4e2df] dark:bg-[#201d1a]"
                      >
                        {thumb ? (
                          <img
                            src={thumb}
                            alt={rec.title}
                            className="rec-img w-full h-full object-cover"
                          />
                        ) : (
                          <div
                            className="w-full h-full flex items-center justify-center text-[#a8a29e]"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth={1}
                              stroke="currentColor"
                              className="w-8 h-8"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="m2.25 15.75 5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0Z"
                              />
                            </svg>
                          </div>
                        )}

                        {/* Hover CTA overlay */}
                        <div className="rec-cta">
                          <span
                            className="text-[0.55rem] tracking-[0.2em] uppercase text-[#fbf9f6] font-medium"
                          >
                            View Product
                          </span>
                        </div>
                      </div>

                      {/* Info */}
                      <div
                        className="p-3.5 flex flex-col gap-1.5"
                      >
                        <p
                          className="m-0 text-sm md:text-base font-light text-[#0d0d0b] dark:text-[#fbf9f6] line-clamp-1"
                          style={{
                            fontFamily: "'Cormorant Garamond', serif",
                          }}
                        >
                          {rec.title}
                        </p>
                        <span
                          className="text-xs font-medium text-[#C9A96E]"
                        >
                          {fmt(rec.price?.amount, rec.price?.currency)}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>
        )}

        {/* ── Mobile Sticky Bottom Action Bar ───────────────────── */}
        <div className="md:hidden fixed bottom-0 left-0 right-0 z-30 p-3 bg-[#fbf9f6]/95 dark:bg-[#0d0d0b]/95 backdrop-blur-md border-t border-[#e4e2df] dark:border-[#292522] shadow-[0_-4px_20px_rgba(0,0,0,0.2)] flex items-center justify-between gap-3">
          <div className="min-w-0 flex-1">
            <p
              className="text-xs font-light truncate text-[#0d0d0b] dark:text-[#fbf9f6]"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
            >
              {product.title}
            </p>
            <p className="text-xs font-semibold text-[#C9A96E]">
              {fmt(displayPrice.amount, displayPrice.currency)}
            </p>
          </div>

          <button
            onClick={async () => {
              if (!user) {
                navigate("/login");
                return;
              }
              if (isAdding) return;
              try {
                setIsAdding(true);
                await handleAddToCart({
                  productId: product._id,
                  variantId: selectedVariantId,
                });
                setAddSuccess(true);
                setTimeout(() => setAddSuccess(false), 2000);
              } catch (err) {
                console.error(err);
              } finally {
                setIsAdding(false);
              }
            }}
            disabled={isAdding}
            className="px-5 py-2.5 rounded-full text-[0.62rem] tracking-[0.16em] uppercase font-semibold bg-[#0d0d0b] dark:bg-[#fbf9f6] text-[#fbf9f6] dark:text-[#0d0d0b] hover:bg-[#C9A96E] hover:text-[#0d0d0b] dark:hover:bg-[#C9A96E] dark:hover:text-[#0d0d0b] transition-all cursor-pointer whitespace-nowrap shadow-sm"
          >
            {addSuccess ? "Added ✓" : isAdding ? "Adding..." : "Add to Bag"}
          </button>
        </div>

        {/* ── Footer ─────────────────────────────────────────────── */}
        <footer
          className="border-t border-[#e4e2df] dark:border-[#292522] max-w-[1200px] mx-auto px-6 lg:px-12 py-10 flex items-center justify-between flex-wrap gap-4"
        >
          <span
            className="text-[0.9rem] tracking-[0.35em] uppercase cursor-pointer text-[#C9A96E]"
            style={{
              fontFamily: "'Cormorant Garamond', serif",
            }}
            onClick={() => navigate("/")}
          >
            Luxurisen
          </span>
          <p
            className="text-[0.6rem] tracking-[0.15em] uppercase m-0 text-[#6b6158] dark:text-[#a8a29e]"
          >
            © {new Date().getFullYear()} Luxurisen — All rights reserved
          </p>
        </footer>
      </div>
    </>
  );
};

/* ── Sub-components ───────────────────────────────────────────── */

const MetaRow = ({ label, value, mono = false }) => (
  <div className="flex items-center justify-between gap-4">
    <span
      className="text-[0.6rem] tracking-[0.15em] uppercase text-[#6b6158] dark:text-[#a8a29e]"
    >
      {label}
    </span>
    <span
      className={`text-[0.65rem] ${mono ? "font-mono" : ""} text-right text-[#3d342c] dark:text-[#d6d3d1]`}
      style={{ maxWidth: "60%" }}
    >
      {value}
    </span>
  </div>
);

export default ProductDetail;

