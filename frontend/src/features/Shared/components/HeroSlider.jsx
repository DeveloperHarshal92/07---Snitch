import { useEffect, useRef, useState } from "react";

/* ─── Product advertisement slides ─────────────────────────────
   Wide-format (4:3-ish) fashion/apparel campaign images
   from Unsplash. Swap for real product shots at any time.
───────────────────────────────────────────────────────────────── */
const DEFAULT_SLIDES = [
  {
    image: "/hero/slide-1.jpg",
    tag: "New Arrivals",
    headline: "SS '26 Collection",
  },
  {
    image: "/hero/slide-2.jpg",
    tag: "Exclusive Drop",
    headline: "Wear the Narrative",
  },
  {
    image: "/hero/slide-3.jpg",
    tag: "Curated Edits",
    headline: "Considered Wardrobe",
  },
  {
    image: "/hero/slide-4.jpg",
    tag: "Free Shipping ₹999+",
    headline: "Shop the Season",
  },
  {
    image: "/hero/slide-5.jpg",
    tag: "Limited Edition",
    headline: "Craft & Finish",
  },
];

/**
 * HeroSlider — A clean, auto-advancing image slider.
 *
 * Props:
 *   slides       Array<{ image, tag?, headline? }>
 *   interval     ms between advances (default 3500)
 *   className    extra Tailwind classes on the root div
 */
const HeroSlider = ({
  slides = DEFAULT_SLIDES,
  interval = 3500,
  className = "",
}) => {
  const [current, setCurrent] = useState(0);
  const [animating, setAnimating] = useState(false);
  const timerRef = useRef(null);
  const count = slides.length;

  const goTo = (idx) => {
    if (animating) return;
    setAnimating(true);
    setTimeout(() => {
      setCurrent(idx);
      setAnimating(false);
    }, 500); // matches transition duration
  };

  const advance = () => goTo((current + 1) % count);

  /* Auto-play */
  useEffect(() => {
    timerRef.current = setInterval(advance, interval);
    return () => clearInterval(timerRef.current);
  }, [current, interval]);

  return (
    <div
      className={`relative w-full h-full overflow-hidden rounded-xl shadow-[0_12px_40px_-10px_rgba(13,13,11,0.14)] ${className}`}
    >
      {/* ── Slides ──────────────────────────────────────── */}
      {slides.map((slide, i) => (
        <div
          key={i}
          className={`absolute inset-0 transition-opacity duration-500 ease-in-out ${
            i === current ? "opacity-100 z-10" : "opacity-0 z-0"
          }`}
          aria-hidden={i !== current}
        >
          {/* Image */}
          <img
            src={slide.image}
            alt={slide.headline || slide.tag || `Slide ${i + 1}`}
            className="w-full h-full object-cover"
            draggable={false}
          />

          {/* Ad text overlay */}
          <div className="absolute bottom-0 left-0 right-0 px-5 pb-5 pt-16 bg-gradient-to-t from-black/50 to-transparent">
            {slide.tag && (
              <p
                className="text-[0.55rem] tracking-[0.24em] uppercase mb-1 font-medium"
                style={{ color: "#C9A96E" }}
              >
                {slide.tag}
              </p>
            )}
            {slide.headline && (
              <p
                className="text-base font-light text-white leading-snug"
                style={{ fontFamily: "'Cormorant Garamond', serif" }}
              >
                {slide.headline}
              </p>
            )}
          </div>
        </div>
      ))}

      {/* ── Progress bar ─────────────────────────────────── */}
      <div className="absolute bottom-0 left-0 right-0 h-[2px] z-20 bg-white/15">
        <div
          className="h-full bg-[#C9A96E] transition-none"
          style={{
            width: `${((current + 1) / count) * 100}%`,
            transition: `width ${interval}ms linear`,
          }}
        />
      </div>

      {/* ── Dot indicators ───────────────────────────────── */}
      <div className="absolute bottom-4 right-4 z-20 flex gap-1.5">
        {slides.map((_, i) => (
          <button
            key={i}
            aria-label={`Go to slide ${i + 1}`}
            onClick={() => goTo(i)}
            className={`h-[5px] rounded-full transition-all duration-300 cursor-pointer border-0 p-0 ${
              i === current
                ? "w-5 bg-[#C9A96E]"
                : "w-[5px] bg-white/45 hover:bg-white/75"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default HeroSlider;
