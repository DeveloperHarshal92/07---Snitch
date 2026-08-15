import React, { useState } from "react";
import { Outlet } from "react-router";
import Nav from "../features/Shared/components/Nav";

const AppLayout = () => {
  const [showBanner, setShowBanner] = useState(true);

  return (
    <div className="min-h-screen flex flex-col bg-[#fbf9f6] text-[#0d0d0b]">
      {showBanner && (
        <aside
          role="region"
          aria-label="Portfolio Demo Notice"
          className="w-full bg-[#1b1917] text-[#fbf9f6] px-4 py-2 text-xs flex items-center justify-between border-b border-[#332e2a] select-none"
        >
          <div className="flex-1 flex items-center justify-center gap-2 text-center">
            <span
              className="inline-block px-1.5 py-0.5 rounded text-[0.62rem] font-semibold tracking-wider uppercase bg-[#C9A96E] text-[#0d0d0b]"
            >
              Demo
            </span>
            <span className="text-[0.7rem] md:text-xs font-normal tracking-wide text-[#e7e5e4]">
              Student Portfolio Demo — Not a Real Store. No real transactions are processed.
            </span>
          </div>
          <button
            onClick={() => setShowBanner(false)}
            aria-label="Dismiss banner"
            className="text-[#a8a29e] hover:text-[#fbf9f6] p-1 cursor-pointer transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-3.5 h-3.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </aside>
      )}
      <Nav />
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
};

export default AppLayout;
