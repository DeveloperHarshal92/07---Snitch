import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";

const LuxurisenPreloader = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState("INITIALIZING ATELIER");
  const overlayRef = useRef(null);
  const leftDoorRef = useRef(null);
  const rightDoorRef = useRef(null);
  const contentRef = useRef(null);
  const pathRef = useRef(null);
  const lightSpillRef = useRef(null);

  useEffect(() => {
    // Check if preloader has already run during this session
    const hasLoaded = sessionStorage.getItem("luxurisen_has_loaded");
    if (hasLoaded) {
      if (onComplete) onComplete();
      return;
    }

    const tl = gsap.timeline({
      onComplete: () => {
        sessionStorage.setItem("luxurisen_has_loaded", "true");
        if (onComplete) onComplete();
      },
    });

    // 1. Path stroke animation setup
    if (pathRef.current) {
      const length = pathRef.current.getTotalLength?.() || 800;
      gsap.set(pathRef.current, {
        strokeDasharray: length,
        strokeDashoffset: length,
        opacity: 0,
      });
      tl.to(pathRef.current, {
        opacity: 1,
        duration: 0.3,
      }).to(
        pathRef.current,
        {
          strokeDashoffset: 0,
          duration: 1.5,
          ease: "power2.out",
        },
        "-=0.2"
      );
    }

    // 2. Numerical counter progression
    const counter = { val: 0 };
    tl.to(
      counter,
      {
        val: 100,
        duration: 1.8,
        ease: "power2.inOut",
        onUpdate: () => {
          const current = Math.floor(counter.val);
          setProgress(current);
          if (current > 75) {
            setStatusText("OPENING ATELIER DOORS");
          } else if (current > 35) {
            setStatusText("CURATING SILHOUETTES");
          }
        },
      },
      0
    );

    // 3. Grand Door Opening Sequence
    // Step A: Content dissolves into background
    tl.to(contentRef.current, {
      opacity: 0,
      scale: 0.92,
      duration: 0.45,
      ease: "power2.in",
    })
      // Step B: Central golden light burst
      .to(
        lightSpillRef.current,
        {
          opacity: 1,
          scale: 1.8,
          duration: 0.8,
          ease: "power2.out",
        },
        "-=0.2"
      )
      // Step C: 3D Grand French Doors swing open smoothly
      .to(
        leftDoorRef.current,
        {
          rotateY: -105,
          duration: 1.3,
          ease: "power3.inOut",
        },
        "-=0.6"
      )
      .to(
        rightDoorRef.current,
        {
          rotateY: 105,
          duration: 1.3,
          ease: "power3.inOut",
        },
        "<"
      )
      // Step D: Dissolve overlay completely
      .to(
        overlayRef.current,
        {
          opacity: 0,
          duration: 0.5,
          ease: "power2.out",
        },
        "-=0.3"
      )
      .set(overlayRef.current, { display: "none" });

    return () => {
      tl.kill();
    };
  }, [onComplete]);

  // If already loaded in session, don't render DOM
  if (
    typeof window !== "undefined" &&
    sessionStorage.getItem("luxurisen_has_loaded")
  ) {
    return null;
  }

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[9999] pointer-events-auto flex items-center justify-center overflow-hidden select-none"
      style={{
        perspective: "1400px",
        perspectiveOrigin: "50% 50%",
        backgroundColor: "transparent",
      }}
    >
      {/* Background Light Spill Behind Doors */}
      <div
        ref={lightSpillRef}
        className="absolute inset-0 flex items-center justify-center opacity-0 pointer-events-none z-0"
      >
        <div className="w-[500px] h-[500px] rounded-full bg-[radial-gradient(circle,rgba(201,169,110,0.35)_0%,rgba(201,169,110,0.08)_50%,transparent_70%)] blur-2xl transform" />
      </div>

      {/* ── Left Grand Door Panel ─────────────────────────────────── */}
      <div
        ref={leftDoorRef}
        className="absolute inset-y-0 left-0 w-1/2 bg-[#0d0d0b] border-r border-[#26231f] flex items-center justify-end z-10 origin-left shadow-[10px_0_30px_rgba(0,0,0,0.8)]"
        style={{
          transformStyle: "preserve-3d",
          backfaceVisibility: "hidden",
        }}
      >
        {/* Architectural Door Molding Frames */}
        <div className="absolute inset-5 sm:inset-10 border border-[#26231f]/80 rounded-sm pointer-events-none flex flex-col justify-between p-4">
          <div className="h-1/3 border border-[#1f1c18] rounded-sm bg-[#12100e]/30" />
          <div className="h-1/2 border border-[#1f1c18] rounded-sm bg-[#12100e]/30" />
        </div>

        {/* Left Brass Door Handle */}
        <div className="relative right-4 w-1.5 h-28 rounded-full bg-gradient-to-b from-[#dfc48e] via-[#C9A96E] to-[#8c6d32] shadow-[0_0_12px_rgba(201,169,110,0.4)] flex items-center justify-center z-20">
          <div className="w-3 h-1 bg-[#C9A96E] rounded-full absolute -top-1" />
          <div className="w-3 h-1 bg-[#C9A96E] rounded-full absolute -bottom-1" />
        </div>
      </div>

      {/* ── Right Grand Door Panel ────────────────────────────────── */}
      <div
        ref={rightDoorRef}
        className="absolute inset-y-0 right-0 w-1/2 bg-[#0d0d0b] border-l border-[#26231f] flex items-center justify-start z-10 origin-right shadow-[-10px_0_30px_rgba(0,0,0,0.8)]"
        style={{
          transformStyle: "preserve-3d",
          backfaceVisibility: "hidden",
        }}
      >
        {/* Architectural Door Molding Frames */}
        <div className="absolute inset-5 sm:inset-10 border border-[#26231f]/80 rounded-sm pointer-events-none flex flex-col justify-between p-4">
          <div className="h-1/3 border border-[#1f1c18] rounded-sm bg-[#12100e]/30" />
          <div className="h-1/2 border border-[#1f1c18] rounded-sm bg-[#12100e]/30" />
        </div>

        {/* Right Brass Door Handle */}
        <div className="relative left-4 w-1.5 h-28 rounded-full bg-gradient-to-b from-[#dfc48e] via-[#C9A96E] to-[#8c6d32] shadow-[0_0_12px_rgba(201,169,110,0.4)] flex items-center justify-center z-20">
          <div className="w-3 h-1 bg-[#C9A96E] rounded-full absolute -top-1" />
          <div className="w-3 h-1 bg-[#C9A96E] rounded-full absolute -bottom-1" />
        </div>
      </div>

      {/* ── Center Luxury Content & Brand Ticker ──────────────────── */}
      <div
        ref={contentRef}
        className="relative z-20 flex flex-col items-center justify-center text-center px-6 max-w-sm"
      >
        {/* Animated Brand Emblem */}
        <div className="relative w-20 h-20 mb-6 flex items-center justify-center">
          <svg
            viewBox="0 0 250 250"
            className="w-full h-full text-[#C9A96E]"
            style={{ filter: "drop-shadow(0 0 16px rgba(201,169,110,0.45))" }}
          >
            <g
              fill="none"
              stroke="#C9A96E"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path
                ref={pathRef}
                d="M 125 15 L 215 80 L 235 170 L 125 240 L 15 170 L 35 80 Z M 125 32 L 200 87 L 218 162 L 125 222 L 32 162 L 50 87 Z M 100 75 L 100 175 L 160 175 M 88 75 L 114 75 M 160 163 L 160 187 M 148 85 L 108 165"
                strokeWidth="6"
              />
            </g>
          </svg>
        </div>

        {/* Brand Name */}
        <h1
          className="text-2xl md:text-3xl font-light tracking-[0.28em] uppercase text-[#fbf9f6] mb-2"
          style={{ fontFamily: "'Cormorant Garamond', serif" }}
        >
          Luxurisen
        </h1>

        {/* Dynamic status */}
        <p className="text-[0.6rem] tracking-[0.28em] uppercase text-[#C9A96E] font-medium mb-8">
          {statusText}
        </p>

        {/* Counter & Progress bar */}
        <div className="w-48 flex flex-col items-center gap-2">
          <div className="w-full h-[1px] bg-[#2a2622] relative overflow-hidden">
            <div
              className="absolute left-0 top-0 bottom-0 bg-[#C9A96E] transition-all duration-75"
              style={{ width: `${progress}%` }}
            />
          </div>
          <span
            className="text-xs font-light tracking-[0.2em] text-[#a8a29e]"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            {String(progress).padStart(2, "0")}%
          </span>
        </div>
      </div>
    </div>
  );
};

export default LuxurisenPreloader;
