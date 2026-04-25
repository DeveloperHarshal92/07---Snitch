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

  /* filter + sort */
  const filtered = products
    .filter((p) =>
      p.title?.toLowerCase().includes(search.toLowerCase()) ||
      p.description?.toLowerCase().includes(search.toLowerCase())
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
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(28px); }
          to   { opacity: 1; transform: translateY(0);    }
        }
        @keyframes marquee {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .anim-fade-up { animation: fadeUp 0.75s ease forwards; }
        .marquee-track { animation: marquee 28s linear infinite; }
        .card-hover { transition: box-shadow 0.35s ease, transform 0.35s ease; }
        .card-hover:hover { box-shadow: 0 12px 48px rgba(27,24,20,0.10); transform: translateY(-4px); }
        ::selection { background: rgba(201,169,110,0.28); }
      `}</style>

      <div
        style={{
          backgroundColor: "#fbf9f6",
          fontFamily: "'Inter', sans-serif",
          color: "#1b1c1a",
          minHeight: "100vh",
        }}
      >
        {/* ── Navbar ────────────────────────────────────────────── */}
        <header
          style={{
            position: "sticky",
            top: 0,
            zIndex: 50,
            backgroundColor: "#fbf9f6",
            borderBottom: "1px solid #e4e2df",
          }}
        >
          <div
            style={{
              maxWidth: 1400,
              margin: "0 auto",
              padding: "0 2rem",
              height: 68,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "1.5rem",
            }}
          >
            {/* Brand */}
            <span
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                color: "#C9A96E",
                fontSize: "1rem",
                letterSpacing: "0.35em",
                textTransform: "uppercase",
                userSelect: "none",
                cursor: "pointer",
              }}
              onClick={() => navigate("/")}
            >
              Snitch.
            </span>

            {/* Nav links */}
            <nav style={{ display: "flex", gap: "2rem", alignItems: "center" }}>
              {[
                { label: "Shop", href: "/" },
                { label: "Login", href: "/login" },
                { label: "Register", href: "/register" },
              ].map(({ label, href }) => (
                <button
                  key={label}
                  onClick={() => navigate(href)}
                  style={{
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    fontSize: "0.65rem",
                    letterSpacing: "0.2em",
                    textTransform: "uppercase",
                    color: "#7A6E63",
                    fontFamily: "'Inter', sans-serif",
                    padding: 0,
                    transition: "color 0.2s",
                  }}
                  onMouseEnter={(e) => (e.target.style.color = "#1b1c1a")}
                  onMouseLeave={(e) => (e.target.style.color = "#7A6E63")}
                >
                  {label}
                </button>
              ))}
            </nav>

            {/* Cart icon */}
            <button
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                color: "#1b1c1a",
                display: "flex",
                alignItems: "center",
                gap: "0.4rem",
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                style={{ width: 20, height: 20 }}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007Z"
                />
              </svg>
              <span
                style={{
                  fontSize: "0.6rem",
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                  color: "#7A6E63",
                }}
              >
                Bag
              </span>
            </button>
          </div>
        </header>

        {/* ── Marquee ticker ──────────────────────────────────────── */}
        <div
          style={{
            backgroundColor: "#1b1c1a",
            color: "#C9A96E",
            overflow: "hidden",
            whiteSpace: "nowrap",
            padding: "10px 0",
          }}
        >
          <div
            className="marquee-track"
            style={{ display: "inline-flex", gap: "3rem" }}
          >
            {Array.from({ length: 8 }).map((_, i) => (
              <span
                key={i}
                style={{
                  fontSize: "0.6rem",
                  letterSpacing: "0.25em",
                  textTransform: "uppercase",
                }}
              >
                Free shipping over ₹999 &nbsp;·&nbsp; New arrivals weekly &nbsp;·&nbsp; Exclusive drops &nbsp;·&nbsp; Snitch — Wear the narrative
              </span>
            ))}
          </div>
        </div>

        {/* ── Hero ────────────────────────────────────────────────── */}
        <section
          ref={heroRef}
          style={{
            maxWidth: 1400,
            margin: "0 auto",
            padding: "6rem 2rem 4rem",
            display: "flex",
            flexDirection: "column",
            gap: "1rem",
            opacity: heroVisible ? 1 : 0,
            transform: heroVisible ? "translateY(0)" : "translateY(20px)",
            transition: "opacity 0.8s ease, transform 0.8s ease",
          }}
        >
          <p
            style={{
              fontSize: "0.6rem",
              letterSpacing: "0.25em",
              textTransform: "uppercase",
              color: "#C9A96E",
              fontWeight: 500,
            }}
          >
            New Season — SS '26
          </p>
          <h1
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: "clamp(3rem, 7vw, 6rem)",
              fontWeight: 300,
              lineHeight: 1.04,
              color: "#1b1c1a",
              margin: 0,
            }}
          >
            The Edit.
          </h1>
          <p
            style={{
              fontSize: "0.8rem",
              color: "#7A6E63",
              maxWidth: 420,
              lineHeight: 1.75,
              fontWeight: 300,
            }}
          >
            Curated essentials for the considered wardrobe. Each piece selected
            for its craft, finish, and enduring relevance.
          </p>
        </section>

        {/* ── Divider line ────────────────────────────────────────── */}
        <div style={{ borderTop: "1px solid #e4e2df" }} />

        {/* ── Filter bar ──────────────────────────────────────────── */}
        <div
          style={{
            maxWidth: 1400,
            margin: "0 auto",
            padding: "1.25rem 2rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "1rem",
            flexWrap: "wrap",
          }}
        >
          {/* Search */}
          <div style={{ position: "relative", flex: "1 1 220px", maxWidth: 360 }}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="#B5ADA3"
              style={{
                width: 14,
                height: 14,
                position: "absolute",
                left: 0,
                top: "50%",
                transform: "translateY(-50%)",
              }}
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
              style={{
                width: "100%",
                background: "transparent",
                border: "none",
                borderBottom: "1px solid #d0c5b5",
                outline: "none",
                paddingLeft: "1.4rem",
                paddingBottom: "0.5rem",
                fontSize: "0.75rem",
                color: "#1b1c1a",
                fontFamily: "'Inter', sans-serif",
              }}
              onFocus={(e) => (e.target.style.borderBottomColor = "#C9A96E")}
              onBlur={(e) => (e.target.style.borderBottomColor = "#d0c5b5")}
            />
          </div>

          {/* Count + Sort */}
          <div style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
            <span
              style={{
                fontSize: "0.6rem",
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color: "#B5ADA3",
              }}
            >
              {filtered.length} {filtered.length === 1 ? "item" : "items"}
            </span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              style={{
                background: "transparent",
                border: "none",
                borderBottom: "1px solid #d0c5b5",
                outline: "none",
                fontSize: "0.6rem",
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                color: "#7A6E63",
                fontFamily: "'Inter', sans-serif",
                paddingBottom: "4px",
                cursor: "pointer",
              }}
            >
              <option value="default">Sort: Default</option>
              <option value="newest">Sort: Newest</option>
              <option value="price-asc">Price: Low → High</option>
              <option value="price-desc">Price: High → Low</option>
            </select>
          </div>
        </div>

        <div style={{ borderTop: "1px solid #e4e2df" }} />

        {/* ── Product Grid ────────────────────────────────────────── */}
        <main
          style={{
            maxWidth: 1400,
            margin: "0 auto",
            padding: "3rem 2rem 6rem",
          }}
        >
          {/* Loading skeleton */}
          {isLoading && (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
                gap: "1.5rem",
              }}
            >
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} style={{ backgroundColor: "#f5f3f0" }}>
                  <div
                    style={{
                      aspectRatio: "4/5",
                      backgroundColor: "#e4e2df",
                      animation: "pulse 1.5s ease-in-out infinite",
                    }}
                  />
                  <div style={{ padding: "1.25rem", display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                    <div style={{ height: 10, width: "65%", backgroundColor: "#e4e2df", borderRadius: 2 }} />
                    <div style={{ height: 8, width: "40%", backgroundColor: "#e4e2df", borderRadius: 2 }} />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Empty state */}
          {!isLoading && filtered.length === 0 && (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                padding: "8rem 1rem",
                gap: "1.25rem",
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1}
                stroke="#d0c5b5"
                style={{ width: 44, height: 44 }}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M20.25 7.5l-.625 10.632a2.25 2.25 0 0 1-2.247 2.118H6.622a2.25 2.25 0 0 1-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z"
                />
              </svg>
              <p
                style={{
                  fontSize: "0.6rem",
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  color: "#B5ADA3",
                }}
              >
                {search ? "No products match your search" : "No products available"}
              </p>
              {search && (
                <button
                  onClick={() => setSearch("")}
                  style={{
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    fontSize: "0.65rem",
                    letterSpacing: "0.15em",
                    textTransform: "uppercase",
                    color: "#C9A96E",
                    textDecoration: "underline",
                    textUnderlineOffset: 4,
                  }}
                >
                  Clear search
                </button>
              )}
            </div>
          )}

          {/* Product cards */}
          {!isLoading && filtered.length > 0 && (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
                gap: "1.5rem",
              }}
            >
              {filtered.map((product, idx) => (
                <ProductCard key={product._id} product={product} idx={idx} />
              ))}
            </div>
          )}
        </main>

        {/* ── Footer ──────────────────────────────────────────────── */}
        <footer
          style={{
            borderTop: "1px solid #e4e2df",
            padding: "3rem 2rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "1rem",
            maxWidth: 1400,
            margin: "0 auto",
          }}
        >
          <span
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              color: "#C9A96E",
              fontSize: "0.9rem",
              letterSpacing: "0.35em",
              textTransform: "uppercase",
            }}
          >
            Snitch.
          </span>
          <p
            style={{
              fontSize: "0.6rem",
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              color: "#B5ADA3",
            }}
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
  const cardRef = useRef(null);
  const images = product.images ?? [];
  const hasMultiple = images.length > 1;

  useEffect(() => {
    const t = setTimeout(() => setIsVisible(true), idx * 80);
    return () => clearTimeout(t);
  }, [idx]);

  return (
    <div
      ref={cardRef}
      className="card-hover"
      style={{
        backgroundColor: "#f5f3f0",
        display: "flex",
        flexDirection: "column",
        cursor: "pointer",
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? "translateY(0)" : "translateY(20px)",
        transition: `opacity 0.55s ease ${idx * 0.06}s, transform 0.55s ease ${idx * 0.06}s`,
      }}
    >
      {/* Image zone */}
      <div
        style={{
          position: "relative",
          aspectRatio: "4/5",
          overflow: "hidden",
          backgroundColor: "#e4e2df",
        }}
      >
        {images.length > 0 ? (
          <img
            src={images[activeImg]?.url}
            alt={product.title}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              transition: "transform 0.7s ease",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
            onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
          />
        ) : (
          <div
            style={{
              width: "100%",
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1}
              stroke="#d0c5b5"
              style={{ width: 40, height: 40 }}
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
          onClick={(e) => { e.stopPropagation(); setIsWishlisted((w) => !w); }}
          style={{
            position: "absolute",
            top: 12,
            right: 12,
            background: "rgba(251,249,246,0.88)",
            border: "none",
            borderRadius: "50%",
            width: 32,
            height: 32,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            color: isWishlisted ? "#C9A96E" : "#B5ADA3",
            transition: "color 0.25s, transform 0.2s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.1)")}
          onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill={isWishlisted ? "currentColor" : "none"}
            stroke="currentColor"
            strokeWidth={1.5}
            style={{ width: 14, height: 14 }}
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
            style={{
              position: "absolute",
              bottom: 12,
              left: 12,
              fontSize: "0.55rem",
              letterSpacing: "0.15em",
              backgroundColor: "rgba(251,249,246,0.85)",
              color: "#7A6E63",
              padding: "2px 8px",
            }}
          >
            {activeImg + 1} / {images.length}
          </span>
        )}

        {/* Thumbnail scrubber */}
        {hasMultiple && (
          <div
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              display: "flex",
              gap: 3,
              padding: "1.5rem 0.75rem 0.75rem",
              background: "linear-gradient(to top, rgba(27,24,20,0.35) 0%, transparent 100%)",
            }}
          >
            {images.map((img, i) => (
              <button
                key={img._id ?? i}
                onMouseEnter={() => setActiveImg(i)}
                onClick={() => setActiveImg(i)}
                style={{
                  flex: 1,
                  height: 2,
                  border: "none",
                  cursor: "pointer",
                  backgroundColor: i === activeImg ? "#C9A96E" : "rgba(255,255,255,0.45)",
                  transition: "background-color 0.2s",
                }}
              />
            ))}
          </div>
        )}
      </div>

      {/* Info */}
      <div
        style={{
          padding: "1.25rem",
          display: "flex",
          flexDirection: "column",
          gap: "0.6rem",
          flex: 1,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            gap: "0.75rem",
          }}
        >
          <h2
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: "1.05rem",
              fontWeight: 300,
              lineHeight: 1.3,
              color: "#1b1c1a",
              margin: 0,
              flex: 1,
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {product.title}
          </h2>
          <span
            style={{
              fontSize: "0.8rem",
              fontWeight: 500,
              color: "#C9A96E",
              whiteSpace: "nowrap",
            }}
          >
            {fmt(product.price.amount, product.price.currency)}
          </span>
        </div>

        {product.description && (
          <p
            style={{
              fontSize: "0.7rem",
              color: "#7A6E63",
              lineHeight: 1.7,
              margin: 0,
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
              fontWeight: 300,
            }}
          >
            {product.description}
          </p>
        )}

        {/* Footer row */}
        <div
          style={{
            marginTop: "auto",
            paddingTop: "1rem",
            borderTop: "1px solid #e4e2df",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <button
            style={{
              background: "#1b1c1a",
              color: "#fbf9f6",
              border: "none",
              padding: "0.55rem 1.1rem",
              fontSize: "0.55rem",
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              cursor: "pointer",
              fontFamily: "'Inter', sans-serif",
              transition: "background 0.25s, color 0.25s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "#C9A96E";
              e.currentTarget.style.color = "#1b1c1a";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "#1b1c1a";
              e.currentTarget.style.color = "#fbf9f6";
            }}
          >
            Add to Bag
          </button>
          <span
            style={{
              fontSize: "0.55rem",
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              color: "#B5ADA3",
            }}
          >
            {images.length} {images.length === 1 ? "photo" : "photos"}
          </span>
        </div>
      </div>
    </div>
  );
};

export default Home;
