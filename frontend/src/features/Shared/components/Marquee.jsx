import React from "react";

const Marquee = () => (
  <>
    <style>{`
      @keyframes marquee { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
      .marquee-track { animation: marquee 28s linear infinite; }
      ::selection { background: rgba(201,169,110,0.28); }
    `}</style>
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
  </>
);

export default Marquee;
