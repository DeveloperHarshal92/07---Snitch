import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router";
import { useSelector } from "react-redux";
import { LuxurisenLogo } from "./LuxurisenLogo";
import { useAuth } from "../../auth/hooks/useAuth";
import ThemeToggle from "./ThemeToggle";

const Nav = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { handleLogout } = useAuth();
  const cartItems = useSelector((state) => state.cart.items) ?? [];
  const user = useSelector((state) => state.auth.user);
  const cartCount = cartItems.length;

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Close mobile drawer on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  // Lock body scroll when mobile drawer is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [mobileMenuOpen]);

  // Track scroll state for glass morphing
  useEffect(() => {
    const onScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const onLogoutClick = async () => {
    await handleLogout();
    setMobileMenuOpen(false);
    navigate("/login");
  };

  return (
    <>
      <header
        className={`sticky top-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-[#fbf9f6]/90 dark:bg-[#0d0d0b]/90 backdrop-blur-md shadow-[0_4px_24px_rgba(0,0,0,0.12)] border-b border-[#e4e2df]/80 dark:border-[#292522]"
            : "bg-[#fbf9f6] dark:bg-[#0d0d0b] border-b border-[#e4e2df] dark:border-[#292522]"
        }`}
      >
        <div className="max-w-[1400px] mx-auto px-5 sm:px-8 h-[64px] md:h-[70px] flex items-center justify-between gap-4">
          {/* Logo */}
          <LuxurisenLogo
            iconSize={24}
            textSize="1.18rem"
            color="#C9A96E"
            onClick={() => navigate("/")}
          />

          {/* Desktop Nav Items */}
          <nav className="hidden md:flex items-center gap-5 lg:gap-7">
            <button
              onClick={() => navigate("/")}
              className={`flex items-center gap-1.5 bg-transparent border-none cursor-pointer text-[0.62rem] tracking-[0.2em] uppercase transition-colors hover:text-[#C9A96E] font-medium ${
                location.pathname === "/"
                  ? "text-[#C9A96E]"
                  : "text-[#3d342c] dark:text-[#d6d3d1]"
              }`}
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
                className={`flex items-center gap-1.5 bg-transparent border-none cursor-pointer text-[0.62rem] tracking-[0.2em] uppercase transition-colors hover:text-[#C9A96E] font-medium ${
                  location.pathname.startsWith("/seller")
                    ? "text-[#C9A96E]"
                    : "text-[#3d342c] dark:text-[#d6d3d1]"
                }`}
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
                className={`flex items-center gap-1.5 bg-transparent border-none cursor-pointer text-[0.62rem] tracking-[0.2em] uppercase transition-colors hover:text-[#C9A96E] font-medium ${
                  location.pathname.startsWith("/orders")
                    ? "text-[#C9A96E]"
                    : "text-[#3d342c] dark:text-[#d6d3d1]"
                }`}
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

            {/* Bag Button */}
            <button
              onClick={() => navigate(user ? "/cart" : "/login")}
              className="relative group flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#e4e2df] dark:border-[#292522] hover:border-[#C9A96E] dark:hover:border-[#C9A96E] transition-all duration-300 cursor-pointer"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-4 h-4 text-[#0d0d0b] dark:text-[#fbf9f6] group-hover:text-[#C9A96E] transition-colors"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007Z"
                />
              </svg>
              <span className="text-[0.62rem] tracking-[0.16em] uppercase text-[#3d342c] dark:text-[#d6d3d1] group-hover:text-[#0d0d0b] dark:group-hover:text-white font-medium">
                Bag
              </span>
              {cartCount > 0 && (
                <span className="w-4 h-4 rounded-full flex items-center justify-center text-[0.55rem] font-semibold bg-[#C9A96E] text-[#0d0d0b] animate-pulse">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Theme Toggle Button */}
            <ThemeToggle />

            {/* Auth CTA */}
            {user ? (
              <button
                onClick={onLogoutClick}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[0.6rem] tracking-[0.18em] uppercase border border-[#e4e2df] dark:border-[#292522] text-[#6b6158] dark:text-[#a8a29e] hover:border-[#0d0d0b] dark:hover:border-white hover:text-[#0d0d0b] dark:hover:text-white transition-all duration-200 cursor-pointer"
              >
                <span>Sign Out</span>
              </button>
            ) : (
              <button
                onClick={() => navigate("/login")}
                className="px-4 py-1.5 rounded-full text-[0.62rem] tracking-[0.18em] uppercase font-medium bg-[#0d0d0b] dark:bg-[#fbf9f6] text-[#fbf9f6] dark:text-[#0d0d0b] hover:bg-[#C9A96E] hover:text-[#0d0d0b] dark:hover:bg-[#C9A96E] dark:hover:text-[#0d0d0b] transition-all duration-300 cursor-pointer shadow-sm"
              >
                Sign In
              </button>
            )}
          </nav>

          {/* Mobile Right Controls: Theme Toggle + Bag + Hamburger */}
          <div className="flex md:hidden items-center gap-2">
            <ThemeToggle />

            <button
              onClick={() => navigate(user ? "/cart" : "/login")}
              aria-label="View Cart"
              className="relative p-2 text-[#0d0d0b] dark:text-[#fbf9f6] cursor-pointer"
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
              {cartCount > 0 && (
                <span className="absolute top-1 right-1 w-3.5 h-3.5 rounded-full bg-[#C9A96E] text-[#0d0d0b] flex items-center justify-center text-[0.5rem] font-bold">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Hamburger Toggle */}
            <button
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              aria-label="Toggle Menu"
              className="relative w-10 h-10 flex flex-col items-center justify-center gap-1.5 rounded-full bg-[#f5f3f0] dark:bg-[#191715] border border-[#e4e2df] dark:border-[#292522] p-2 cursor-pointer z-50"
            >
              <span
                className={`w-4 h-[1.5px] bg-[#0d0d0b] dark:bg-[#fbf9f6] transition-all duration-300 ${
                  mobileMenuOpen ? "rotate-45 translate-y-[6px]" : ""
                }`}
              />
              <span
                className={`w-4 h-[1.5px] bg-[#0d0d0b] dark:bg-[#fbf9f6] transition-all duration-200 ${
                  mobileMenuOpen ? "opacity-0" : ""
                }`}
              />
              <span
                className={`w-4 h-[1.5px] bg-[#0d0d0b] dark:bg-[#fbf9f6] transition-all duration-300 ${
                  mobileMenuOpen ? "-rotate-45 -translate-y-[6px]" : ""
                }`}
              />
            </button>
          </div>
        </div>
      </header>

      {/* ── Mobile / Tablet Luxury Slide-Out Drawer ─────────────── */}
      <div
        className={`fixed inset-0 z-40 md:hidden transition-opacity duration-300 ${
          mobileMenuOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
      >
        {/* Backdrop */}
        <div
          onClick={() => setMobileMenuOpen(false)}
          className="absolute inset-0 bg-[#0d0d0b]/60 backdrop-blur-sm transition-opacity"
        />

        {/* Drawer Content */}
        <aside
          className={`absolute top-0 right-0 bottom-0 w-[82vw] max-w-[340px] bg-[#141210] text-[#fbf9f6] p-6 pt-20 flex flex-col justify-between shadow-2xl transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] border-l border-[#292522] ${
            mobileMenuOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          {/* Navigation Links */}
          <div className="flex flex-col gap-6">
            <span className="text-[0.55rem] tracking-[0.25em] uppercase text-[#C9A96E] font-medium border-b border-[#292522] pb-3">
              Navigation Menu
            </span>

            <button
              onClick={() => navigate("/")}
              className="flex items-center justify-between text-left text-lg font-light text-white hover:text-[#C9A96E] transition-colors py-1 cursor-pointer"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
            >
              <span>The Collection</span>
              <span className="text-xs text-[#a8a29e]">01</span>
            </button>

            {user?.role === "seller" ? (
              <button
                onClick={() => navigate("/seller/dashboard")}
                className="flex items-center justify-between text-left text-lg font-light text-white hover:text-[#C9A96E] transition-colors py-1 cursor-pointer"
                style={{ fontFamily: "'Cormorant Garamond', serif" }}
              >
                <span>Seller Dashboard</span>
                <span className="text-xs text-[#a8a29e]">02</span>
              </button>
            ) : (
              <button
                onClick={() => navigate(user ? "/orders" : "/login")}
                className="flex items-center justify-between text-left text-lg font-light text-white hover:text-[#C9A96E] transition-colors py-1 cursor-pointer"
                style={{ fontFamily: "'Cormorant Garamond', serif" }}
              >
                <span>Your Orders</span>
                <span className="text-xs text-[#a8a29e]">02</span>
              </button>
            )}

            <button
              onClick={() => navigate(user ? "/cart" : "/login")}
              className="flex items-center justify-between text-left text-lg font-light text-white hover:text-[#C9A96E] transition-colors py-1 cursor-pointer"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
            >
              <span>Shopping Bag ({cartCount})</span>
              <span className="text-xs text-[#a8a29e]">03</span>
            </button>
          </div>

          {/* User profile / Auth bottom section */}
          <div className="pt-6 border-t border-[#292522] flex flex-col gap-4">
            {user ? (
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#C9A96E]" />
                  <p className="text-xs text-[#d6d3d1] truncate">
                    {user.email || user.username || "Atelier Member"}
                  </p>
                </div>
                <button
                  onClick={onLogoutClick}
                  className="w-full py-2.5 rounded-full text-[0.62rem] tracking-[0.2em] uppercase text-[#fbf9f6] bg-[#292522] hover:bg-[#C9A96E] hover:text-[#0d0d0b] transition-colors font-medium cursor-pointer"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-2.5">
                <button
                  onClick={() => navigate("/login")}
                  className="w-full py-2.5 rounded-full text-[0.62rem] tracking-[0.2em] uppercase font-semibold text-[#0d0d0b] bg-[#C9A96E] hover:bg-[#d8bd88] transition-colors cursor-pointer"
                >
                  Sign In
                </button>
                <button
                  onClick={() => navigate("/register")}
                  className="w-full py-2.5 rounded-full text-[0.62rem] tracking-[0.2em] uppercase text-[#fbf9f6] border border-[#3d3834] hover:border-white transition-colors cursor-pointer"
                >
                  Create Account
                </button>
              </div>
            )}
            <p className="text-[0.55rem] text-[#78716c] tracking-widest uppercase text-center mt-2">
              Luxurisen Haute Couture — SS&apos;26
            </p>
          </div>
        </aside>
      </div>
    </>
  );
};

export default Nav;
