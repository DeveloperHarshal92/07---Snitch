import React, { useState } from "react";
import { LuxurisenLogo } from "./LuxurisenLogo";

/* ─────────────────────────────────────────────────────────────────
   LuxurisenFooter
   Restyled for Luxurisen brand: #fbf9f6 bg, #C9A96E gold
───────────────────────────────────────────────────────────────────*/

const NAV_COLUMNS = [
  {
    title: "Shop",
    links: [
      { label: "New Arrivals", href: "/" },
      { label: "Men", href: "/" },
      { label: "Women", href: "/" },
      { label: "Accessories", href: "/" },
      { label: "Sale", href: "/" },
    ],
  },
  {
    title: "Help",
    links: [
      { label: "Size Guide", href: "/" },
      { label: "Shipping & Returns", href: "/" },
      { label: "Track My Order", href: "/" },
      { label: "FAQs", href: "/" },
      { label: "Contact Us", href: "/" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About Luxurisen", href: "/" },
      { label: "Careers", href: "/" },
      { label: "Press", href: "/" },
      { label: "Sustainability", href: "/" },
      { label: "Affiliates", href: "/" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy Policy", href: "/" },
      { label: "Terms of Use", href: "/" },
      { label: "Cookie Policy", href: "/" },
      { label: "Refund Policy", href: "/" },
      { label: "Accessibility", href: "/" },
    ],
  },
];

const SOCIALS = [
  {
    name: "Instagram",
    href: "https://instagram.com",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
        <path d="M7.75 2h8.5A5.75 5.75 0 0 1 22 7.75v8.5A5.75 5.75 0 0 1 16.25 22h-8.5A5.75 5.75 0 0 1 2 16.25v-8.5A5.75 5.75 0 0 1 7.75 2Zm0 1.5A4.25 4.25 0 0 0 3.5 7.75v8.5A4.25 4.25 0 0 0 7.75 20.5h8.5A4.25 4.25 0 0 0 20.5 16.25v-8.5A4.25 4.25 0 0 0 16.25 3.5h-8.5ZM12 7a5 5 0 1 1 0 10A5 5 0 0 1 12 7Zm0 1.5a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7Zm5.25-2.25a.875.875 0 1 1 0 1.75.875.875 0 0 1 0-1.75Z" />
      </svg>
    ),
  },
  {
    name: "Twitter / X",
    href: "https://x.com",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
        <path d="M4.5 4h4l3.5 5L16 4h4l-5.5 7.5L20 20h-4l-4-5.5L7.5 20H3.5l6-8.5L4.5 4Z" />
      </svg>
    ),
  },
  {
    name: "YouTube",
    href: "https://youtube.com",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
        <path d="M21.8 7.2s-.2-1.4-.8-2a2.9 2.9 0 0 0-2-.9C16.8 4 12 4 12 4s-4.8 0-7 .3a2.9 2.9 0 0 0-2 .9c-.6.6-.8 2-.8 2S2 8.7 2 10.2v1.5c0 1.5.2 3 .2 3s.2 1.4.8 2a3 3 0 0 0 2.1.9C6.5 18 12 18 12 18s4.8 0 7-.3a3 3 0 0 0 2-.9c.6-.6.8-2 .8-2S22 13.3 22 11.7v-1.5c0-1.5-.2-3-.2-3ZM10 14V9l5 2.5-5 2.5Z" />
      </svg>
    ),
  },
  {
    name: "Pinterest",
    href: "https://pinterest.com",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
        <path d="M12 2C6.48 2 2 6.48 2 12c0 4.24 2.65 7.86 6.39 9.29-.09-.78-.17-1.98.04-2.83.18-.77 1.23-5.22 1.23-5.22s-.32-.63-.32-1.56c0-1.46.85-2.55 1.9-2.55.9 0 1.33.67 1.33 1.48 0 .9-.58 2.26-.87 3.51-.25 1.05.52 1.9 1.55 1.9 1.86 0 3.11-2.38 3.11-5.19 0-2.14-1.44-3.74-4.03-3.74-2.94 0-4.77 2.2-4.77 4.65 0 .84.25 1.44.63 1.9.18.22.2.3.14.55-.05.17-.14.59-.19.76-.06.25-.25.34-.46.25-1.29-.53-1.9-1.96-1.9-3.57 0-2.65 2.23-5.82 6.65-5.82 3.56 0 5.9 2.58 5.9 5.36 0 3.67-2.03 6.41-5.01 6.41-.99 0-1.93-.54-2.25-1.14l-.62 2.35c-.22.87-.82 1.95-1.22 2.6.92.28 1.9.44 2.91.44 5.52 0 10-4.48 10-10S17.52 2 12 2Z" />
      </svg>
    ),
  },
];

/* ── Sub-components ─────────────────────────────────────────── */
const NavColumn = ({ title, links }) => (
  <div className="flex flex-col gap-3">
    <h3
      className="text-[0.55rem] tracking-[0.22em] uppercase font-medium"
      style={{ color: "#C9A96E" }}
    >
      {title}
    </h3>
    <ul className="flex flex-col gap-2">
      {links.map((l) => (
        <li key={l.label}>
          <a
            href={l.href}
            className="text-[0.72rem] leading-relaxed transition-colors duration-200 text-[#6b6158] dark:text-[#a8a29e] hover:text-[#0d0d0b] dark:hover:text-[#fbf9f6]"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            {l.label}
          </a>
        </li>
      ))}
    </ul>
  </div>
);

const SocialRow = () => (
  <div className="flex items-center gap-4">
    {SOCIALS.map((s) => (
      <a
        key={s.name}
        href={s.href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={s.name}
        className="w-8 h-8 rounded-full flex items-center justify-center border border-[#e4e2df] dark:border-[#292522] text-[#6b6158] dark:text-[#a8a29e] hover:border-[#C9A96E] dark:hover:border-[#C9A96E] hover:text-[#C9A96E] transition-all duration-200"
      >
        {s.icon}
      </a>
    ))}
  </div>
);

const Newsletter = () => {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email.trim()) {
      setSent(true);
      setEmail("");
    }
  };

  return (
    <div className="flex flex-col gap-3 max-w-[320px]">
      <p
        className="text-[0.55rem] tracking-[0.22em] uppercase font-medium"
        style={{ color: "#C9A96E" }}
      >
        Stay in the loop
      </p>
      <p className="text-[0.72rem] leading-relaxed text-[#6b6158] dark:text-[#a8a29e]">
        New drops, exclusive offers, and curated edits — straight to your inbox.
      </p>
      {sent ? (
        <p
          className="text-[0.7rem] tracking-[0.1em] uppercase"
          style={{ color: "#C9A96E" }}
        >
          ✓ You&apos;re on the list
        </p>
      ) : (
        <form onSubmit={handleSubmit} className="flex gap-0">
          <input
            type="email"
            required
            placeholder="your@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="flex-1 text-[0.7rem] px-3 py-2 border border-[#d0c5b5] dark:border-[#38332e] outline-none bg-transparent min-w-0 text-[#0d0d0b] dark:text-[#fbf9f6] focus:border-[#C9A96E]"
            style={{
              fontFamily: "'Inter', sans-serif",
            }}
          />
          <button
            type="submit"
            className="px-4 py-2 text-[0.6rem] tracking-[0.18em] uppercase font-medium border border-l-0 border-[#d0c5b5] dark:border-[#38332e] text-[#0d0d0b] dark:text-[#fbf9f6] bg-transparent hover:bg-[#C9A96E] hover:text-[#0d0d0b] dark:hover:bg-[#C9A96E] dark:hover:text-[#0d0d0b] transition-all duration-200 cursor-pointer"
            style={{
              fontFamily: "'Inter', sans-serif",
            }}
          >
            Subscribe
          </button>
        </form>
      )}
    </div>
  );
};

/* ── LuxurisenFooter ───────────────────────────────────────────── */
const LuxurisenFooter = () => (
  <footer
    className="w-full border-t mt-0 bg-[#fbf9f6] dark:bg-[#0a0908] border-[#e4e2df] dark:border-[#292522] transition-colors duration-300"
  >
    {/* ── Main grid ─── */}
    <div className="max-w-[1400px] mx-auto px-8 py-14 grid grid-cols-1 md:grid-cols-[1fr_auto] gap-12">
      {/* Left: brand + nav columns */}
      <div className="flex flex-col gap-10">
        {/* Brand mark */}
        <div className="flex flex-col gap-2">
          <LuxurisenLogo iconSize={26} textSize="1.25rem" />
          <p
            className="text-[0.7rem] leading-relaxed max-w-[280px] text-[#6b6158] dark:text-[#a8a29e]"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            Curated luxury essentials for the considered wardrobe. Craft, finish, and
            enduring elegance.
          </p>
          <SocialRow />
        </div>

        {/* Nav columns */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-8">
          {NAV_COLUMNS.map((col) => (
            <NavColumn key={col.title} title={col.title} links={col.links} />
          ))}
        </div>
      </div>

      {/* Right: newsletter */}
      <div className="flex items-start">
        <Newsletter />
      </div>
    </div>

    {/* ── Bottom bar ─── */}
    <div
      className="border-t border-[#e4e2df] dark:border-[#292522] max-w-[1400px] mx-auto px-8 py-5 flex flex-wrap items-center justify-between gap-3"
    >
      <p
        className="text-[0.6rem] tracking-[0.14em] uppercase text-[#9b9089] dark:text-[#78716c]"
        style={{ fontFamily: "'Inter', sans-serif" }}
      >
        © {new Date().getFullYear()} Luxurisen — All rights reserved
      </p>
      <div className="flex items-center gap-5">
        {["Privacy", "Terms", "Cookies"].map((t) => (
          <a
            key={t}
            href="/"
            className="text-[0.6rem] tracking-[0.12em] uppercase text-[#9b9089] dark:text-[#78716c] hover:text-[#C9A96E] transition-colors duration-150"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            {t}
          </a>
        ))}
      </div>
    </div>
  </footer>
);

export default LuxurisenFooter;
