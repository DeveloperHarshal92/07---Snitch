import React, { useEffect, useState, useRef, useCallback } from "react";
import { useSelector } from "react-redux";
import { useProduct } from "../hooks/useProduct";
import { useCart } from "../../cart/hooks/useCart";
import { useNavigate } from "react-router";
import HeroSlider from "../../Shared/components/HeroSlider";
import LuxurisenFooter from "../../Shared/components/LuxurisenFooter";
import EditorialBento from "../../Shared/components/EditorialBento";
import Marquee from "../../Shared/components/Marquee";
import gsap from "gsap";

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

const CATEGORIES = [
  "All Items",
  "Tailoring & Suits",
  "Shirts & Knits",
  "Trousers",
  "Outerwear",
];

/* ── Home Page ────────────────────────────────────────────────── */
const Home = () => {
  const products = useSelector((state) => state.product.products);
  const { handleGetAllProducts } = useProduct();
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Items");
  const [sortBy, setSortBy] = useState("default");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [highlightedIdx, setHighlightedIdx] = useState(-1);

  const heroRef = useRef(null);
  const searchRef = useRef(null);
  const gridRef = useRef(null);

  useEffect(() => {
    handleGetAllProducts().finally(() => setIsLoading(false));
  }, []);

  // Hero entrance animation with GSAP
  useEffect(() => {
    if (heroRef.current) {
      gsap.fromTo(
        heroRef.current.children,
        { opacity: 0, y: 25 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.12,
          ease: "power3.out",
        }
      );
    }
  }, []);

  // Filter & Sort Logic
  const filtered = products
    .filter((p) => {
      const matchSearch =
        p.title?.toLowerCase().includes(search.toLowerCase()) ||
        p.description?.toLowerCase().includes(search.toLowerCase());

      if (selectedCategory === "All Items") return matchSearch;

      const categoryKeywords = {
        "Tailoring & Suits": ["suit", "blazer", "tuxedo", "formal", "coat"],
        "Shirts & Knits": ["shirt", "knit", "sweater", "polo", "t-shirt", "silk", "cashmere"],
        "Trousers": ["trouser", "pant", "chino", "denim", "jean"],
        "Outerwear": ["jacket", "coat", "trench", "outerwear", "parka"],
      };

      const keywords = categoryKeywords[selectedCategory] || [];
      const titleAndDesc = `${p.title} ${p.description}`.toLowerCase();
      const matchCat = keywords.some((kw) => titleAndDesc.includes(kw));

      return matchSearch && matchCat;
    })
    .sort((a, b) => {
      if (sortBy === "price-asc") return a.price.amount - b.price.amount;
      if (sortBy === "price-desc") return b.price.amount - a.price.amount;
      if (sortBy === "newest")
        return new Date(b.createdAt) - new Date(a.createdAt);
      return 0;
    });

  // Autocomplete Suggestions
  const suggestions =
    search.trim().length > 0
      ? products
          .filter(
            (p) =>
              p.title?.toLowerCase().includes(search.toLowerCase()) ||
              p.description?.toLowerCase().includes(search.toLowerCase())
          )
          .slice(0, 6)
      : [];

  // Close suggestions on outside click
  useEffect(() => {
    const handler = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowSuggestions(false);
        setHighlightedIdx(-1);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Keyboard navigation for suggestions
  const handleSearchKeyDown = useCallback(
    (e) => {
      if (!showSuggestions || suggestions.length === 0) return;
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setHighlightedIdx((i) => (i + 1) % suggestions.length);
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setHighlightedIdx((i) =>
          i <= 0 ? suggestions.length - 1 : i - 1
        );
      } else if (e.key === "Enter" && highlightedIdx >= 0) {
        e.preventDefault();
        const chosen = suggestions[highlightedIdx];
        navigate(`/product/${chosen._id}`);
        setShowSuggestions(false);
        setSearch("");
        setHighlightedIdx(-1);
      } else if (e.key === "Escape") {
        setShowSuggestions(false);
        setHighlightedIdx(-1);
      }
    },
    [showSuggestions, suggestions, highlightedIdx, navigate]
  );

  return (
    <>
      <FontLink />

      <div
        className="min-h-screen bg-[#fbf9f6] dark:bg-[#0a0908] text-[#0d0d0b] dark:text-[#fbf9f6] selection:bg-[#C9A96E]/30 transition-colors duration-300"
        style={{
          fontFamily: "'Inter', sans-serif",
        }}
      >
        {/* ── Hero Section ────────────────────────────────────────── */}
        <section className="max-w-[1400px] mx-auto px-6 md:px-8 pt-8 md:pt-14 pb-12 md:pb-16">
          <div
            ref={heroRef}
            className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center"
          >
            {/* Left: Editorial Hero Headline & CTA */}
            <div className="lg:col-span-6 flex flex-col gap-6">
              <div className="flex items-center gap-3">
                <span className="w-2 h-2 rounded-full bg-[#C9A96E] animate-ping" />
                <p className="text-[0.62rem] tracking-[0.28em] uppercase font-semibold text-[#C9A96E]">
                  New Season Collection — SS&apos;26
                </p>
              </div>

              <h1
                className="font-light leading-[1.02] text-4xl sm:text-6xl md:text-7xl text-[#0d0d0b] dark:text-white"
                style={{ fontFamily: "'Cormorant Garamond', serif" }}
              >
                The Defined Silhouettes
              </h1>

              <p className="text-sm md:text-base text-[#524941] dark:text-[#d6d3d1] leading-relaxed font-light max-w-lg">
                Curated essentials for the considered wardrobe. Every piece is crafted
                with classical sartorial proportion and quiet luxury finish.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <button
                  onClick={() => {
                    const el = document.getElementById("catalogue-heading");
                    if (el) el.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="btn-pill-primary"
                >
                  <span>Explore Collection</span>
                  <span className="btn-pill-icon">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      className="w-3.5 h-3.5"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5.22 14.78a.75.75 0 001.06 0l7.22-7.22v5.69a.75.75 0 001.5 0v-7.5a.75.75 0 00-.75-.75h-7.5a.75.75 0 000 1.5h5.69l-7.22 7.22a.75.75 0 000 1.06z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </span>
                </button>

                <div className="hidden sm:flex items-center gap-2 text-xs text-[#6b6158] dark:text-[#a8a29e]">
                  <span className="w-1 h-1 rounded-full bg-[#C9A96E]" />
                  <span>Complimentary Pan-India Delivery on Orders ₹999+</span>
                </div>
              </div>
            </div>

            {/* Right: Dynamic Hero Banner Slider */}
            <div className="lg:col-span-6 w-full h-[320px] sm:h-[400px] md:h-[440px] relative">
              <HeroSlider interval={4200} />
            </div>
          </div>
        </section>

        {/* ── Marquee Ribbon ──────────────────────────────────────── */}
        <Marquee />

        {/* ── Editorial Story Bento ───────────────────────────────── */}
        <EditorialBento
          onExplore={() => {
            setSelectedCategory("All Items");
          }}
        />

        {/* ── Divider ─────────────────────────────────────────────── */}
        <div className="border-t border-[#e4e2df] dark:border-[#292522] max-w-[1400px] mx-auto px-6 md:px-8" />

        {/* ── Category Chips & Search Bar ─────────────────────────── */}
        <section
          id="catalogue-heading"
          className="max-w-[1400px] mx-auto px-6 md:px-8 pt-12 pb-6 flex flex-col gap-6"
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <span className="text-[0.58rem] tracking-[0.24em] uppercase font-semibold text-[#C9A96E] block mb-1">
                The Catalogue
              </span>
              <h2
                className="text-2xl md:text-4xl font-light text-[#0d0d0b] dark:text-white"
                style={{ fontFamily: "'Cormorant Garamond', serif" }}
              >
                Curated Garments ({filtered.length})
              </h2>
            </div>

            {/* Search Input with Live Suggestions */}
            <div
              ref={searchRef}
              className="relative w-full md:w-80"
            >
              <div className="flex items-center gap-2 px-3 py-2 rounded-full bg-[#f5f3f0] dark:bg-[#191715] border border-[#e4e2df] dark:border-[#292522] focus-within:border-[#C9A96E] transition-all">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="#6b6158"
                  className="w-4 h-4 flex-shrink-0"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
                  />
                </svg>
                <input
                  type="text"
                  placeholder="Search silhouettes..."
                  value={search}
                  autoComplete="off"
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setShowSuggestions(true);
                    setHighlightedIdx(-1);
                  }}
                  onFocus={() => {
                    if (search.trim().length > 0) setShowSuggestions(true);
                  }}
                  onKeyDown={handleSearchKeyDown}
                  className="w-full bg-transparent border-0 outline-none text-xs text-[#0d0d0b] dark:text-[#fbf9f6] placeholder:text-[#a8a29e]"
                />
                {search && (
                  <button
                    onClick={() => setSearch("")}
                    className="text-[#a8a29e] hover:text-[#0d0d0b] dark:hover:text-white text-xs cursor-pointer p-0.5"
                  >
                    ✕
                  </button>
                )}
              </div>

              {/* Suggestions Dropdown */}
              {showSuggestions && suggestions.length > 0 && (
                <div className="absolute top-full mt-2 left-0 right-0 bg-[#fbf9f6] dark:bg-[#141210] border border-[#e4e2df] dark:border-[#292522] shadow-2xl rounded-xl z-30 overflow-hidden">
                  <div className="p-2.5 px-3 bg-[#f5f3f0] dark:bg-[#191715] border-b border-[#e4e2df] dark:border-[#292522] flex items-center justify-between">
                    <span className="text-[0.55rem] tracking-[0.2em] uppercase text-[#6b6158] dark:text-[#a8a29e] font-medium">
                      Matched Pieces
                    </span>
                    <span className="text-[0.55rem] text-[#C9A96E] font-semibold">
                      {suggestions.length} found
                    </span>
                  </div>
                  <ul className="divide-y divide-[#f0ede8] dark:divide-[#292522] max-h-64 overflow-y-auto">
                    {suggestions.map((item, i) => (
                      <li
                        key={item._id}
                        onMouseEnter={() => setHighlightedIdx(i)}
                        onMouseDown={(e) => {
                          e.preventDefault();
                          navigate(`/product/${item._id}`);
                          setShowSuggestions(false);
                          setSearch("");
                        }}
                        className={`p-2.5 px-3 flex items-center gap-3 cursor-pointer transition-colors ${
                          i === highlightedIdx
                            ? "bg-[#f0ece5] dark:bg-[#262320]"
                            : "hover:bg-[#f5f3f0] dark:hover:bg-[#191715]"
                        }`}
                      >
                        {item.images?.[0]?.url && (
                          <img
                            src={item.images[0].url}
                            alt={item.title}
                            className="w-9 h-11 object-cover rounded"
                          />
                        )}
                        <div className="min-w-0 flex-1">
                          <p
                            className="text-sm text-[#0d0d0b] dark:text-[#fbf9f6] truncate font-light"
                            style={{ fontFamily: "'Cormorant Garamond', serif" }}
                          >
                            {item.title}
                          </p>
                          <p className="text-[0.62rem] text-[#C9A96E] font-medium">
                            {fmt(item.price?.amount || 0, item.price?.currency)}
                          </p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>

          {/* Category Filter Chips & Sort Selector */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
            <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-1.5 rounded-full text-[0.62rem] tracking-[0.16em] uppercase whitespace-nowrap transition-all duration-300 cursor-pointer font-medium ${
                    selectedCategory === cat
                      ? "bg-[#0d0d0b] dark:bg-[#fbf9f6] text-[#fbf9f6] dark:text-[#0d0d0b] shadow-sm"
                      : "bg-[#f5f3f0] dark:bg-[#191715] text-[#6b6158] dark:text-[#a8a29e] hover:text-[#0d0d0b] dark:hover:text-white border border-[#e4e2df] dark:border-[#292522]"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-3">
              <span className="text-[0.6rem] tracking-[0.15em] uppercase text-[#78716c]">
                Sort By:
              </span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-transparent text-xs text-[#0d0d0b] dark:text-[#fbf9f6] border-b border-[#d0c5b5] dark:border-[#38332e] pb-0.5 outline-none cursor-pointer"
              >
                <option value="default" className="dark:bg-[#141210]">Featured</option>
                <option value="newest" className="dark:bg-[#141210]">New Arrivals</option>
                <option value="price-asc" className="dark:bg-[#141210]">Price: Low to High</option>
                <option value="price-desc" className="dark:bg-[#141210]">Price: High to Low</option>
              </select>
            </div>
          </div>
        </section>

        {/* ── Product Grid ────────────────────────────────────────── */}
        <main
          ref={gridRef}
          className="max-w-[1400px] mx-auto px-6 md:px-8 pb-24"
        >
          {/* Skeleton Loader */}
          {isLoading && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {Array.from({ length: 8 }).map((_, i) => (
                <div
                  key={i}
                  className="rounded-2xl p-2 bg-[#f5f3f0] animate-pulse border border-[#e4e2df]"
                >
                  <div className="aspect-[4/5] bg-[#e4e2df] rounded-xl mb-4" />
                  <div className="h-3 bg-[#e4e2df] rounded w-3/4 mb-2" />
                  <div className="h-2.5 bg-[#e4e2df] rounded w-1/2" />
                </div>
              ))}
            </div>
          )}

          {/* Empty State */}
          {!isLoading && filtered.length === 0 && (
            <div className="py-24 text-center flex flex-col items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-[#f5f3f0] flex items-center justify-center text-[#C9A96E] mb-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-8 h-8"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z"
                  />
                </svg>
              </div>
              <h3
                className="text-2xl font-light text-[#0d0d0b]"
                style={{ fontFamily: "'Cormorant Garamond', serif" }}
              >
                No garments found in this curation
              </h3>
              <p className="text-xs text-[#6b6158] max-w-sm">
                Try searching for another piece or reset category filters.
              </p>
              <button
                onClick={() => {
                  setSearch("");
                  setSelectedCategory("All Items");
                }}
                className="mt-2 text-xs uppercase tracking-widest text-[#C9A96E] underline underline-offset-4 cursor-pointer"
              >
                Reset all filters
              </button>
            </div>
          )}

          {/* Product Cards Grid */}
          {!isLoading && filtered.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filtered.map((product, idx) => (
                <LuxuryProductCard
                  key={product._id}
                  product={product}
                  idx={idx}
                />
              ))}
            </div>
          )}
        </main>

        {/* ── Footer ──────────────────────────────────────────────── */}
        <LuxurisenFooter />
      </div>
    </>
  );
};

/* ── Luxury Product Card Component ────────────────────────────── */
const LuxuryProductCard = ({ product, idx }) => {
  const [activeImg, setActiveImg] = useState(0);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [added, setAdded] = useState(false);
  const navigate = useNavigate();
  const { handleAddToCart } = useCart();
  const user = useSelector((state) => state.auth.user);

  const images = product.images ?? [];
  const hasMultiple = images.length > 1;

  const onQuickAdd = async (e) => {
    e.stopPropagation();
    if (!user) {
      navigate("/login");
      return;
    }
    try {
      await handleAddToCart({ productId: product._id, quantity: 1 });
      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div
      onClick={() => navigate(`/product/${product._id}`)}
      className="group bezel-outer flex flex-col cursor-pointer"
    >
      <div className="bezel-inner flex flex-col flex-1 overflow-hidden">
        {/* Product Image Stage */}
        <div className="relative aspect-[4/5] overflow-hidden bg-[#e4e2df] dark:bg-[#201d1a]">
          {images.length > 0 ? (
            <img
              src={images[activeImg]?.url}
              alt={product.title}
              className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
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
                  d="m2.25 15.75 5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0Z"
                />
              </svg>
            </div>
          )}

          {/* Wishlist Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsWishlisted((prev) => !prev);
            }}
            className="absolute top-3 right-3 w-8 h-8 rounded-full bg-[#fbf9f6]/90 dark:bg-[#141210]/90 backdrop-blur-md flex items-center justify-center shadow-sm hover:scale-110 active:scale-95 transition-all duration-200 cursor-pointer z-10 border border-transparent dark:border-white/10"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill={isWishlisted ? "#C9A96E" : "none"}
              stroke={isWishlisted ? "#C9A96E" : "#6b6158"}
              strokeWidth={1.5}
              className="w-4 h-4 transition-colors"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
              />
            </svg>
          </button>

          {/* Image Scrubber Indicators */}
          {hasMultiple && (
            <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1 px-3 py-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              {images.map((_, i) => (
                <button
                  key={i}
                  onMouseEnter={(e) => {
                    e.stopPropagation();
                    setActiveImg(i);
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveImg(i);
                  }}
                  className={`h-1 rounded-full transition-all duration-200 cursor-pointer ${
                    i === activeImg ? "w-4 bg-[#C9A96E]" : "w-1 bg-white/60"
                  }`}
                />
              ))}
            </div>
          )}
        </div>

        {/* Product Details Section */}
        <div className="p-4 md:p-5 flex flex-col gap-2 flex-1 justify-between">
          <div>
            <div className="flex items-start justify-between gap-2 mb-1">
              <h3
                className="text-base font-light text-[#0d0d0b] dark:text-white line-clamp-1 group-hover:text-[#C9A96E] transition-colors"
                style={{ fontFamily: "'Cormorant Garamond', serif" }}
              >
                {product.title}
              </h3>
            </div>
            <p className="text-[0.68rem] text-[#6b6158] dark:text-[#a8a29e] line-clamp-2 leading-relaxed font-light">
              {product.description || "Refined tailored craftsmanship."}
            </p>
          </div>

          {/* Price & Action Row */}
          <div className="pt-3 mt-2 border-t border-[#e4e2df] dark:border-[#292522] flex items-center justify-between">
            <span className="text-xs font-semibold text-[#0d0d0b] dark:text-[#fbf9f6]">
              {fmt(product.price?.amount || 0, product.price?.currency)}
            </span>

            <button
              onClick={onQuickAdd}
              className={`px-3 py-1.5 rounded-full text-[0.58rem] tracking-[0.16em] uppercase font-semibold transition-all duration-300 cursor-pointer ${
                added
                  ? "bg-[#C9A96E] text-[#0d0d0b]"
                  : "bg-[#0d0d0b] dark:bg-[#fbf9f6] text-[#fbf9f6] dark:text-[#0d0d0b] hover:bg-[#C9A96E] hover:text-[#0d0d0b] dark:hover:bg-[#C9A96E] dark:hover:text-[#0d0d0b]"
              }`}
            >
              {added ? "Added ✓" : "Add +"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
