import React from "react";
import { useNavigate } from "react-router";
import SnitchFooter from "../components/SnitchFooter";

const FontLink = () => (
  <link
    href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=Inter:wght@300;400;500;600&display=swap"
    rel="stylesheet"
  />
);

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <>
      <FontLink />
      <div
        className="min-h-[85vh] flex flex-col justify-between"
        style={{
          backgroundColor: "#fbf9f6",
          fontFamily: "'Inter', sans-serif",
        }}
      >
        <main className="flex-1 flex flex-col items-center justify-center px-6 py-20 text-center max-w-[900px] mx-auto">
          {/* Tag */}
          <p
            className="text-[0.65rem] tracking-[0.3em] uppercase font-medium mb-3"
            style={{ color: "#C9A96E" }}
          >
            Error 404 — Archival Notice
          </p>

          {/* Large stylized 404 number */}
          <h1
            className="text-[clamp(5rem,14vw,10rem)] font-light leading-none m-0 select-none tracking-tight"
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              color: "#0d0d0b",
            }}
          >
            404
          </h1>

          {/* Headline */}
          <h2
            className="text-[clamp(1.5rem,3.5vw,2.4rem)] font-light leading-snug mt-2 mb-4"
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              color: "#0d0d0b",
            }}
          >
            This Piece Cannot Be Found
          </h2>

          {/* Description */}
          <p
            className="text-sm max-w-[480px] leading-[1.8] font-light mb-10"
            style={{ color: "#6b6158" }}
          >
            The link you followed may be outdated, the collection may have been
            archived, or the page address has been changed.
          </p>

          {/* Actions */}
          <div className="flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={() => navigate("/")}
              className="px-8 py-3.5 text-[0.68rem] tracking-[0.22em] uppercase font-medium border-none cursor-pointer transition-all duration-300 shadow-sm"
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
              Return to Collection
            </button>

            <button
              onClick={() => navigate(-1)}
              className="px-8 py-3.5 text-[0.68rem] tracking-[0.22em] uppercase font-medium border cursor-pointer transition-all duration-300"
              style={{
                borderColor: "#d0c5b5",
                backgroundColor: "transparent",
                color: "#0d0d0b",
                fontFamily: "'Inter', sans-serif",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "#C9A96E";
                e.currentTarget.style.color = "#C9A96E";
                e.currentTarget.style.backgroundColor = "rgba(201,169,110,0.06)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "#d0c5b5";
                e.currentTarget.style.color = "#0d0d0b";
                e.currentTarget.style.backgroundColor = "transparent";
              }}
            >
              Previous Page
            </button>
          </div>

          {/* Helpful Quick Directory */}
          <div className="mt-16 pt-8 border-t w-full max-w-[500px]" style={{ borderColor: "#e4e2df" }}>
            <p
              className="text-[0.55rem] tracking-[0.2em] uppercase mb-4 font-medium"
              style={{ color: "#9b9089" }}
            >
              Quick Destinations
            </p>
            <div className="flex flex-wrap items-center justify-center gap-6">
              <button
                onClick={() => navigate("/")}
                className="text-[0.72rem] bg-transparent border-none cursor-pointer transition-colors duration-200"
                style={{ color: "#6b6158" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#C9A96E")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "#6b6158")}
              >
                All Products
              </button>
              <button
                onClick={() => navigate("/cart")}
                className="text-[0.72rem] bg-transparent border-none cursor-pointer transition-colors duration-200"
                style={{ color: "#6b6158" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#C9A96E")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "#6b6158")}
              >
                Shopping Bag
              </button>
              <button
                onClick={() => navigate("/seller/dashboard")}
                className="text-[0.72rem] bg-transparent border-none cursor-pointer transition-colors duration-200"
                style={{ color: "#6b6158" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#C9A96E")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "#6b6158")}
              >
                Seller Portal
              </button>
            </div>
          </div>
        </main>

        <SnitchFooter />
      </div>
    </>
  );
};

export default NotFound;
