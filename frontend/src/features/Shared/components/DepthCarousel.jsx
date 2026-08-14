import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import gsap from "gsap";
// CSS file removed — all styles are Tailwind + inline style props

const DEFAULT_ITEMS = [
  {
    image:
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1400&h=900&fit=crop&q=85",
    alt: "New Season Collection",
    label: "New Season — SS'26",
    sub: "Wear the narrative",
  },
  {
    image:
      "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1400&h=900&fit=crop&q=85",
    alt: "Curated Essentials",
    label: "Curated Essentials",
    sub: "Considered wardrobe pieces",
  },
  {
    image:
      "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=1400&h=900&fit=crop&q=85",
    alt: "Exclusive Drops",
    label: "Exclusive Drops",
    sub: "Limited. Bold. Yours.",
  },
  {
    image:
      "https://images.unsplash.com/photo-1445205170230-053b83016050?w=1400&h=900&fit=crop&q=85",
    alt: "Street to Studio",
    label: "Street to Studio",
    sub: "Versatile silhouettes for every setting",
  },
  {
    image:
      "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=1400&h=900&fit=crop&q=85",
    alt: "Craft & Finish",
    label: "Craft & Finish",
    sub: "Selected for enduring relevance",
  },
];

const clamp = (v, min, max) => Math.min(Math.max(v, min), max);
const normalizeItem = (it) =>
  typeof it === "string" ? { image: it, alt: "", label: "", sub: "" } : it;

const DepthCarousel = ({
  items = DEFAULT_ITEMS,
  cardWidth = 720,
  cardHeight = 460,
  radius = 4,
  tint = "#f5f3f0",
  depth = 160,
  spread = 60,
  tilt = 14,
  tiltDirection = "right",
  perspective = 1600,
  visibleCards = 3,
  falloff = 0.28,
  blur = 4,
  duration = 700,
  ease = "power3.out",
  autoplay = true,
  autoplayDelay = 4000,
  loop = true,
  showControls = true,
  showIndicators = true,
  onChange,
  className = "",
}) => {
  const data = useMemo(
    () => (Array.isArray(items) ? items : []).map(normalizeItem),
    [items]
  );
  const count = data.length;

  const rootRef = useRef(null);
  const stageRef = useRef(null);
  const cardRefs = useRef([]);
  const overlayRefs = useRef([]);

  const posRef = useRef(0);
  const focusRef = useRef(0);
  const tweenRef = useRef(null);
  const scaleRef = useRef(1);
  const cfgRef = useRef({});
  const onChangeRef = useRef(onChange);

  const dragRef = useRef(null);
  const wheelTimerRef = useRef(null);
  const autoTimerRef = useRef(null);
  const reducedRef = useRef(false);

  const [active, setActive] = useState(0);

  onChangeRef.current = onChange;
  cfgRef.current = {
    count,
    depth,
    spread,
    tilt,
    tiltDirection,
    visibleCards,
    falloff,
    blur,
    duration,
    ease,
    loop,
    cardWidth,
    autoplayDelay,
  };

  const layout = useCallback((pos) => {
    const cfg = cfgRef.current;
    const n = cfg.count;
    if (!n) return;
    const dir = cfg.tiltDirection === "left" ? -1 : 1;
    const sc = scaleRef.current;

    for (let i = 0; i < n; i++) {
      const el = cardRefs.current[i];
      if (!el) continue;

      let d = i - pos;
      if (cfg.loop && n > 1) {
        d = ((d % n) + n) % n;
        if (d > n / 2) d -= n;
      }

      const back = Math.max(0, d);
      const az = Math.abs(d);
      const shown = az <= cfg.visibleCards + 0.5;

      const tz = -cfg.depth * d;
      const tx = dir * cfg.spread * d;
      const ry = dir * cfg.tilt * clamp(d, 0, 1);

      let opacity = d < 0 ? Math.max(0, 1 + d) : 1;
      if (!shown) opacity = 0;

      const brightness = Math.max(0.15, 1 - back * cfg.falloff);
      const blurPx =
        cfg.blur > 0
          ? Math.min(cfg.blur, (back / Math.max(1, cfg.visibleCards)) * cfg.blur)
          : 0;
      const zi = Math.round(2000 - d * 20);

      el.style.transform = `translate(-50%, -50%) scale(${sc}) translateX(${tx.toFixed(2)}px) translateZ(${tz.toFixed(2)}px) rotateY(${ry.toFixed(3)}deg)`;
      el.style.opacity = opacity.toFixed(3);
      el.style.filter = `brightness(${brightness.toFixed(3)}) blur(${blurPx.toFixed(2)}px)`;
      el.style.zIndex = String(zi);
      el.style.pointerEvents = shown && opacity > 0.05 ? "auto" : "none";

      const ov = overlayRefs.current[i];
      if (ov)
        ov.style.opacity = clamp(back * cfg.falloff * 1.25, 0, 0.86).toFixed(3);

      // Show ad label only on front card
      const label = el.querySelector("[data-ad-label]");
      if (label) label.style.opacity = d === 0 ? "1" : "0";
    }
  }, []);

  const notify = useCallback(
    (idx) => {
      setActive(idx);
      onChangeRef.current?.(idx, data[idx]);
    },
    [data]
  );

  const tweenTo = useCallback(
    (target, animate) => {
      tweenRef.current?.kill();
      const cfg = cfgRef.current;
      const proxy = { p: posRef.current };
      const dur = animate && !reducedRef.current ? cfg.duration / 1000 : 0;
      tweenRef.current = gsap.to(proxy, {
        p: target,
        duration: dur,
        ease: cfg.ease,
        onUpdate: () => {
          posRef.current = proxy.p;
          layout(proxy.p);
        },
        onComplete: () => {
          const n = cfg.count;
          if (n > 0) posRef.current = ((posRef.current % n) + n) % n;
          layout(posRef.current);
        },
      });
    },
    [layout]
  );

  const setFocus = useCallback(
    (rawIndex, animate = true) => {
      const cfg = cfgRef.current;
      const n = cfg.count;
      if (!n) return;
      const idx = cfg.loop
        ? ((rawIndex % n) + n) % n
        : clamp(rawIndex, 0, n - 1);
      let delta = idx - posRef.current;
      if (cfg.loop && n > 1) {
        delta = ((delta % n) + n) % n;
        if (delta > n / 2) delta -= n;
      }
      tweenTo(posRef.current + delta, animate);
      if (idx !== focusRef.current) {
        focusRef.current = idx;
        notify(idx);
      }
    },
    [tweenTo, notify]
  );

  const navigateBy = useCallback(
    (step) => setFocus(focusRef.current + step, true),
    [setFocus]
  );

  // Responsive scale
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const ro = new ResizeObserver((entries) => {
      const w = entries[0].contentRect.width;
      const cfg = cfgRef.current;
      const needed = cfg.cardWidth + Math.abs(cfg.spread) * 2 + 80;
      scaleRef.current = clamp(w / needed, 0.35, 1);
      layout(posRef.current);
    });
    ro.observe(root);
    return () => ro.disconnect();
  }, [layout]);

  // Wheel
  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const onWheel = (e) => {
      const cfg = cfgRef.current;
      if (cfg.count < 2) return;
      e.preventDefault();
      tweenRef.current?.kill();
      const raw = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
      const delta = e.deltaMode === 1 ? raw * 24 : raw;
      const step = clamp(delta / (cfg.cardWidth * 0.9), -0.6, 0.6);
      posRef.current += step;
      layout(posRef.current);
      if (wheelTimerRef.current) clearTimeout(wheelTimerRef.current);
      wheelTimerRef.current = setTimeout(
        () => setFocus(Math.round(posRef.current), true),
        130
      );
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => {
      el.removeEventListener("wheel", onWheel);
      if (wheelTimerRef.current) clearTimeout(wheelTimerRef.current);
    };
  }, [layout, setFocus]);

  // Pointer drag
  const onPointerDown = useCallback((e) => {
    const cfg = cfgRef.current;
    if (cfg.count < 2) return;
    tweenRef.current?.kill();
    dragRef.current = {
      x: e.clientX,
      startPos: posRef.current,
      lastX: e.clientX,
      lastT: performance.now(),
      v: 0,
      moved: false,
      id: e.pointerId,
    };
  }, []);

  const onPointerMove = useCallback(
    (e) => {
      const drag = dragRef.current;
      if (!drag) return;
      const cfg = cfgRef.current;
      const stepPx = Math.max(cfg.cardWidth * 0.55 * scaleRef.current, 40);
      const dx = e.clientX - drag.x;
      if (!drag.moved && Math.abs(dx) > 4) {
        drag.moved = true;
        rootRef.current?.setPointerCapture(drag.id);
      }
      if (!drag.moved) return;
      const now = performance.now();
      const dt = Math.max(now - drag.lastT, 1);
      drag.v = (e.clientX - drag.lastX) / dt;
      drag.lastX = e.clientX;
      drag.lastT = now;
      posRef.current = drag.startPos - dx / stepPx;
      layout(posRef.current);
    },
    [layout]
  );

  const onPointerEnd = useCallback(() => {
    const drag = dragRef.current;
    if (!drag) return;
    dragRef.current = null;
    if (!drag.moved) return;
    const cfg = cfgRef.current;
    const stepPx = Math.max(cfg.cardWidth * 0.55 * scaleRef.current, 40);
    const projected = posRef.current - (drag.v * 180) / stepPx;
    setFocus(Math.round(projected), true);
  }, [setFocus]);

  const onKeyDown = useCallback(
    (e) => {
      if (e.key === "ArrowLeft") { e.preventDefault(); navigateBy(-1); }
      else if (e.key === "ArrowRight") { e.preventDefault(); navigateBy(1); }
    },
    [navigateBy]
  );

  const onCardClick = useCallback(
    (index) => {
      if (dragRef.current?.moved) return;
      setFocus(index, true);
    },
    [setFocus]
  );

  // Autoplay
  useEffect(() => {
    reducedRef.current =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!autoplay || reducedRef.current || count < 2) return;
    const root = rootRef.current;
    let hovered = false;
    let focused = false;
    const stop = () => {
      if (autoTimerRef.current) clearInterval(autoTimerRef.current);
      autoTimerRef.current = null;
    };
    const start = () => {
      stop();
      autoTimerRef.current = window.setInterval(() => {
        if (!hovered && !focused) navigateBy(1);
      }, Math.max(cfgRef.current.autoplayDelay, 600));
    };
    const onEnter = () => { hovered = true; };
    const onLeave = () => { hovered = false; };
    const onFocusIn = () => { focused = true; };
    const onFocusOut = () => { focused = false; };
    root?.addEventListener("mouseenter", onEnter);
    root?.addEventListener("mouseleave", onLeave);
    root?.addEventListener("focusin", onFocusIn);
    root?.addEventListener("focusout", onFocusOut);
    start();
    return () => {
      stop();
      root?.removeEventListener("mouseenter", onEnter);
      root?.removeEventListener("mouseleave", onLeave);
      root?.removeEventListener("focusin", onFocusIn);
      root?.removeEventListener("focusout", onFocusOut);
    };
  }, [autoplay, autoplayDelay, count, navigateBy]);

  useEffect(() => {
    layout(posRef.current);
  }, [layout, depth, spread, tilt, tiltDirection, visibleCards, falloff, blur, cardWidth, cardHeight, radius, count]);

  useEffect(
    () => () => {
      tweenRef.current?.kill();
      if (wheelTimerRef.current) clearTimeout(wheelTimerRef.current);
      if (autoTimerRef.current) clearInterval(autoTimerRef.current);
    },
    []
  );

  /* ─── Arrow shared classes ──────────────────────────────── */
  const arrowCls =
    "absolute top-1/2 -translate-y-1/2 z-[3000] " +
    "w-11 h-11 grid place-items-center " +
    "rounded-full border border-[#d0c5b5] " +
    "bg-[rgba(251,249,246,0.92)] backdrop-blur-sm " +
    "text-[#3d342c] cursor-pointer " +
    "shadow-[0_2px_12px_rgba(13,13,11,0.10)] " +
    "transition-[background-color,border-color,color,box-shadow] duration-200 ease-in-out " +
    "hover:bg-[#C9A96E] hover:border-[#C9A96E] hover:text-[#fbf9f6] " +
    "hover:shadow-[0_4px_20px_rgba(201,169,110,0.35)] " +
    "active:scale-[0.93] motion-reduce:transition-none";

  return (
    <div
      ref={rootRef}
      className={[
        "relative w-full h-full min-h-[320px]",
        "flex items-center justify-center",
        "touch-pan-y outline-none select-none",
        "cursor-grab active:cursor-grabbing",
        "focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:rounded-sm",
        "focus-visible:outline-[rgba(201,169,110,0.5)]",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      style={{
        perspective: `${perspective}px`,
        perspectiveOrigin: "50% 50%",
      }}
      role="group"
      aria-roledescription="carousel"
      aria-label="Snitch product carousel"
      tabIndex={0}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerEnd}
      onPointerCancel={onPointerEnd}
      onKeyDown={onKeyDown}
    >
      {/* ── 3D stage — transform-style must be inline (no Tailwind util) ── */}
      <div
        className="absolute inset-0"
        style={{ transformStyle: "preserve-3d" }}
        ref={stageRef}
      >
        {data.map((item, i) => (
          <div
            key={i}
            ref={(el) => (cardRefs.current[i] = el)}
            className="absolute top-1/2 left-1/2 origin-center overflow-hidden bg-[#e4e2df] cursor-pointer shadow-[0_14px_40px_-10px_rgba(13,13,11,0.14),0_3px_12px_-4px_rgba(13,13,11,0.08)]"
            style={{
              width: cardWidth,
              height: cardHeight,
              borderRadius: radius,
              /* initial position — overridden by layout() on every tick */
              transform: "translate(-50%, -50%)",
              willChange: "transform, opacity, filter",
            }}
            aria-roledescription="slide"
            aria-label={`${i + 1} of ${count}`}
            aria-hidden={active !== i}
            onClick={() => onCardClick(i)}
          >
            {/* Image */}
            <img
              className="w-full h-full object-cover block pointer-events-none select-none"
              src={item.image}
              alt={item.alt || ""}
              draggable={false}
            />

            {/* Depth tint overlay */}
            <span
              className="absolute inset-0 opacity-0 pointer-events-none mix-blend-multiply"
              ref={(el) => (overlayRefs.current[i] = el)}
              style={{ background: tint }}
            />

            {/* Ad text — shown only on the front card (controlled via layout()) */}
            {(item.label || item.sub) && (
              <div
                data-ad-label
                className="absolute bottom-0 left-0 right-0 px-7 pb-[22px] pt-8 pointer-events-none bg-gradient-to-t from-black/55 to-transparent"
                style={{ opacity: 0, transition: "opacity 0.4s ease" }}
              >
                {item.label && (
                  <p
                    className="m-0 font-light text-white leading-snug text-[clamp(1.1rem,2.2vw,1.7rem)]"
                    style={{ fontFamily: "'Cormorant Garamond', serif" }}
                  >
                    {item.label}
                  </p>
                )}
                {item.sub && (
                  <p
                    className="m-0 mt-1.5 text-[0.6rem] tracking-[0.2em] uppercase font-medium"
                    style={{ color: "#C9A96E", fontFamily: "'Inter', sans-serif" }}
                  >
                    {item.sub}
                  </p>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* ── Prev / Next arrows ───────────────────────────────────── */}
      {showControls && count > 1 && (
        <>
          <button
            type="button"
            className={`${arrowCls} left-5`}
            aria-label="Previous slide"
            onClick={() => navigateBy(-1)}
          >
            <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
              <path
                d="M15 5l-7 7 7 7"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
          <button
            type="button"
            className={`${arrowCls} right-5`}
            aria-label="Next slide"
            onClick={() => navigateBy(1)}
          >
            <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
              <path
                d="M9 5l7 7-7 7"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </>
      )}

      {/* ── Dot indicators ──────────────────────────────────────── */}
      {showIndicators && count > 1 && (
        <div
          className="absolute bottom-[18px] left-1/2 -translate-x-1/2 z-[3000] flex gap-2 px-[14px] py-2 rounded-full bg-[rgba(251,249,246,0.80)] backdrop-blur-sm border border-[#e4e2df]"
          role="tablist"
          aria-label="Slides"
        >
          {data.map((_, i) => (
            <button
              key={i}
              type="button"
              role="tab"
              aria-selected={active === i}
              aria-label={`Go to slide ${i + 1}`}
              className={[
                "h-[7px] p-0 border-0 rounded-full cursor-pointer",
                "transition-[width,background-color] duration-300 ease-in-out",
                "motion-reduce:transition-none",
                active === i
                  ? "w-[22px] bg-[#C9A96E]"
                  : "w-[7px] bg-[#d0c5b5] hover:bg-[#b8a898]",
              ].join(" ")}
              onClick={() => setFocus(i, true)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default DepthCarousel;
