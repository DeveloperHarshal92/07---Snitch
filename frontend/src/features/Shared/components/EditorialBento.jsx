import React, { useEffect, useRef } from "react";
import gsap from "gsap";

const BENTO_CARDS = [
  {
    id: "card-1",
    tag: "Atelier Signature",
    title: "The Art of Architectural Tailoring",
    desc: "Sculpted proportions and handcrafted bespoke wools engineered for timeless modern elegance.",
    image: "/luxurisen_editorial_warm.png",
    cta: "Explore Tailoring",
    span: "md:col-span-8 md:row-span-2",
  },
  {
    id: "card-2",
    tag: "SS'26 Exclusive",
    title: "Pure Mulberry Silk & Cashmere",
    desc: "Featherweight luxury essentials for trans-seasonal layering.",
    image: "/hero/slide-2.jpg",
    cta: "View Knitwear",
    span: "md:col-span-4",
  },
  {
    id: "card-3",
    tag: "Monochrome Series",
    title: "Structured Outerwear",
    desc: "Precision double-faced coats and tailored trench silhouettes.",
    image: "/hero/slide-3.jpg",
    cta: "Discover Outerwear",
    span: "md:col-span-4",
  },
];

const EditorialBento = ({ onExplore }) => {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const cards = containerRef.current.querySelectorAll(".bento-card-item");

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            gsap.fromTo(
              cards,
              { opacity: 0, y: 35 },
              {
                opacity: 1,
                y: 0,
                duration: 0.8,
                stagger: 0.14,
                ease: "power3.out",
              }
            );
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );

    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={containerRef}
      className="max-w-[1400px] mx-auto px-6 md:px-8 py-14 md:py-20"
    >
      {/* Eyebrow & Title */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
        <div>
          <span className="inline-block px-3 py-1 rounded-full text-[0.58rem] tracking-[0.24em] uppercase font-semibold bg-[#1b1917] text-[#C9A96E] mb-3">
            Editorial Showcase
          </span>
          <h2
            className="text-3xl md:text-5xl font-light tracking-tight text-[#0d0d0b] dark:text-white"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            Curated Atelier Disciplines
          </h2>
        </div>
        <p className="text-xs md:text-sm text-[#6b6158] dark:text-[#a8a29e] max-w-md font-light leading-relaxed">
          Every garment is informed by classical sartorial balance and modern minimalist restraint.
        </p>
      </div>

      {/* Asymmetrical Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-5 md:gap-6">
        {BENTO_CARDS.map((card, idx) => (
          <div
            key={card.id}
            className={`bento-card-item group relative rounded-2xl overflow-hidden shadow-sm bg-[#1b1917] text-[#fbf9f6] flex flex-col justify-end min-h-[360px] md:min-h-[420px] transition-all duration-500 hover:shadow-2xl ${card.span}`}
          >
            {/* Background image with hover zoom */}
            <div className="absolute inset-0 overflow-hidden">
              <img
                src={card.image}
                alt={card.title}
                className="w-full h-full object-cover object-top opacity-80 group-hover:opacity-90 group-hover:scale-105 transition-all duration-700 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0d0d0b]/90 via-[#0d0d0b]/35 to-transparent" />
            </div>

            {/* Content overlay */}
            <div className="relative z-10 p-6 md:p-8 flex flex-col items-start gap-3">
              <span className="text-[0.55rem] tracking-[0.25em] uppercase font-semibold text-[#C9A96E]">
                {card.tag}
              </span>
              <h3
                className="text-xl md:text-2xl lg:text-3xl font-light text-white leading-tight"
                style={{ fontFamily: "'Cormorant Garamond', serif" }}
              >
                {card.title}
              </h3>
              <p className="text-xs text-[#d6d3d1] font-light max-w-md leading-relaxed">
                {card.desc}
              </p>

              {/* Island Button with Button-in-Button */}
              <button
                onClick={() => {
                  if (onExplore) onExplore();
                  const target = document.getElementById("catalogue-heading");
                  if (target) target.scrollIntoView({ behavior: "smooth" });
                }}
                className="mt-2 inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-white/10 hover:bg-[#C9A96E] hover:text-[#0d0d0b] backdrop-blur-md border border-white/20 text-[#fbf9f6] text-[0.62rem] tracking-[0.18em] uppercase transition-all duration-300 cursor-pointer"
              >
                <span>{card.cta}</span>
                <span className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center group-hover:translate-x-0.5 transition-transform duration-200">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    className="w-3 h-3"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.22 14.78a.75.75 0 001.06 0l7.22-7.22v5.69a.75.75 0 001.5 0v-7.5a.75.75 0 00-.75-.75h-7.5a.75.75 0 000 1.5h5.69l-7.22 7.22a.75.75 0 000 1.06z"
                      clipRule="evenodd"
                    />
                  </svg>
                </span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default EditorialBento;
