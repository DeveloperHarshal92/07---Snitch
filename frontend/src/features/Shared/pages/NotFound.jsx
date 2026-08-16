import React from "react";
import { useNavigate } from "react-router";
import LuxurisenFooter from "../components/LuxurisenFooter";

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
      <div className="min-h-[85vh] bg-[#fbf9f6] dark:bg-[#0a0908] text-[#0d0d0b] dark:text-[#fbf9f6] transition-colors duration-300 font-sans flex flex-col justify-between">
        <main className="flex-1 flex flex-col items-center justify-center px-6 py-20 text-center max-w-[900px] mx-auto">
          {/* Tag */}
          <p className="text-[0.65rem] tracking-[0.3em] uppercase font-medium mb-3 text-[#C9A96E]">
            Error 404 — Archival Notice
          </p>

          {/* Large stylized 404 number */}
          <h1
            className="text-[clamp(5rem,14vw,10rem)] font-light leading-none m-0 select-none tracking-tight text-[#0d0d0b] dark:text-white"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            404
          </h1>

          {/* Headline */}
          <h2
            className="text-[clamp(1.5rem,3.5vw,2.4rem)] font-light leading-snug mt-2 mb-4 text-[#0d0d0b] dark:text-white"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            This Piece Cannot Be Found
          </h2>

          {/* Description */}
          <p className="text-sm max-w-[480px] leading-[1.8] font-light mb-10 text-[#6b6158] dark:text-[#a8a29e]">
            The link you followed may be outdated, the collection may have been
            archived, or the page address has been changed.
          </p>

          {/* Actions */}
          <div className="flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={() => navigate("/")}
              className="px-8 py-3.5 text-[0.68rem] tracking-[0.22em] uppercase font-semibold bg-[#0d0d0b] dark:bg-[#fbf9f6] text-[#fbf9f6] dark:text-[#0d0d0b] hover:bg-[#C9A96E] hover:text-[#0d0d0b] dark:hover:bg-[#C9A96E] dark:hover:text-[#0d0d0b] rounded-full transition-all duration-300 shadow-sm cursor-pointer border-none"
            >
              Return to Collection
            </button>

            <button
              onClick={() => navigate(-1)}
              className="px-8 py-3.5 text-[0.68rem] tracking-[0.22em] uppercase font-semibold bg-transparent text-[#0d0d0b] dark:text-[#fbf9f6] border border-[#d0c5b5] dark:border-[#38332e] hover:border-[#C9A96E] hover:text-[#C9A96E] dark:hover:border-[#C9A96E] dark:hover:text-[#C9A96E] rounded-full transition-all duration-300 cursor-pointer"
            >
              ← Go Back
            </button>
          </div>
        </main>

        <LuxurisenFooter />
      </div>
    </>
  );
};

export default NotFound;
