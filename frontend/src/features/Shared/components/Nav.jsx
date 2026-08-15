import React from "react";
import { useNavigate } from "react-router";
import { useSelector } from "react-redux";
import { LuxurisenLogo } from "./LuxurisenLogo";

const Nav = () => {
  const navigate = useNavigate();
  const cartItems = useSelector((state) => state.cart.items) ?? [];
  const user = useSelector((state) => state.auth.user);
  const cartCount = cartItems.length;

  return (
    /* ── Navbar ───────────────────────────────────────────────────── */
    <header
      className="sticky top-0 z-50 border-b"
      style={{ backgroundColor: "#fbf9f6", borderColor: "#e4e2df" }}
    >
      <div className="max-w-[1400px] mx-auto px-8 h-[68px] flex items-center justify-between gap-6">
        <LuxurisenLogo
          iconSize={26}
          textSize="1.25rem"
          color="#C9A96E"
          onClick={() => navigate("/")}
        />

        <nav className="flex items-center gap-6">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-1.5 bg-transparent border-none cursor-pointer text-[0.6rem] tracking-[0.2em] uppercase transition-colors hover:text-[#C9A96E]"
            style={{ color: "#3d342c", fontFamily: "'Inter', sans-serif" }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-4 h-4"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25A2.25 2.25 0 0 1 13.5 18v-2.25Z"
              />
            </svg>
            <span>Collection</span>
          </button>
          {user?.role === "seller" ? (
            <button
              onClick={() => navigate("/seller/dashboard")}
              className="flex items-center gap-1.5 bg-transparent border-none cursor-pointer text-[0.6rem] tracking-[0.2em] uppercase transition-colors hover:text-[#C9A96E]"
              style={{ color: "#3d342c", fontFamily: "'Inter', sans-serif" }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-4 h-4"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3.75 3v11.25A2.25 2.25 0 0 0 6 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0 1 18 16.5h-2.25m-7.5 0h7.5m-7.5 0-1 3m8.5-3 1 3m0 0 .5 1.5m-.5-1.5h-9.5m0 0-.5 1.5"
                />
              </svg>
              <span>Dashboard</span>
            </button>
          ) : (
            <button
              onClick={() => navigate(user ? "/orders" : "/login")}
              className="flex items-center gap-1.5 bg-transparent border-none cursor-pointer text-[0.6rem] tracking-[0.2em] uppercase transition-colors hover:text-[#C9A96E]"
              style={{ color: "#3d342c", fontFamily: "'Inter', sans-serif" }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-4 h-4"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25ZM6.75 12h.008v.008H6.75V12Zm0 3h.008v.008H6.75V15Zm0 3h.008v.008H6.75V18Z"
                />
              </svg>
              <span>Orders</span>
            </button>
          )}
          <button
            onClick={() => navigate(user ? "/cart" : "/login")}
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

          {!user && (
            <button
              onClick={() => navigate("/login")}
              className="ml-2 px-3 py-1 text-[0.6rem] tracking-[0.18em] uppercase border transition-colors duration-200 cursor-pointer"
              style={{
                borderColor: "#C9A96E",
                color: "#0d0d0b",
                backgroundColor: "transparent",
                fontFamily: "'Inter', sans-serif",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "#C9A96E";
                e.currentTarget.style.color = "#fbf9f6";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "transparent";
                e.currentTarget.style.color = "#0d0d0b";
              }}
            >
              Sign In
            </button>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Nav;
