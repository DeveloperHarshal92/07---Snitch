import React from "react";
import { useNavigate } from "react-router";
import { useSelector } from "react-redux";

const Nav = () => {
  const navigate = useNavigate();
  const cartItems = useSelector((state) => state.cart.items);
  const cartCount = cartItems.length;
  

  return (
    /* ── Navbar ───────────────────────────────────────────────────── */
    <header
      className="sticky top-0 z-50 border-b"
      style={{ backgroundColor: "#fbf9f6", borderColor: "#e4e2df" }}
    >
      <div className="max-w-[1400px] mx-auto px-8 h-[68px] flex items-center justify-between gap-6">
        <span
          className="text-base uppercase tracking-[0.35em] select-none cursor-pointer"
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            color: "#C9A96E",
          }}
          onClick={() => navigate("/")}
        >
          Snitch
        </span>

        <nav className="flex items-center gap-6">
          <button
            onClick={() => navigate("/")}
            className="bg-transparent border-none cursor-pointer text-[0.6rem] tracking-[0.2em] uppercase"
            style={{ color: "#3d342c", fontFamily: "'Inter', sans-serif" }}
          >
            Collection
          </button>
          <button
            onClick={() => navigate("/cart")}
            className="relative flex items-center gap-1.5 bg-transparent border-none cursor-pointer"
            style={{ color: "#0d0d0b" }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-5 h-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007Z"
              />
            </svg>
            <span
              className="text-[0.6rem] tracking-[0.15em] uppercase"
              style={{ color: "#3d342c" }}
            >
              Bag
            </span>
            {cartCount > 0 && (
              <span
                className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full flex items-center justify-center text-[0.5rem] font-medium"
                style={{ backgroundColor: "#C9A96E", color: "#0d0d0b" }}
              >
                {cartCount}
              </span>
            )}
          </button>
        </nav>
      </div>
    </header>
  );
};

export default Nav;
