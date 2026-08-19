import PDFDocument from "pdfkit";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const outputPath = path.resolve(__dirname, "../../../LinkedInPost.pdf");

const doc = new PDFDocument({
  size: "A4",
  margins: { top: 40, bottom: 40, left: 45, right: 45 },
});

const stream = fs.createWriteStream(outputPath);
doc.pipe(stream);

// Primary colors
const GOLD = "#C9A96E";
const CHARCOAL = "#1A1410";
const DARK = "#0D0D0B";
const MUTED = "#5A524C";
const LIGHT_BG = "#F9F7F4";
const BORDER = "#E4E0D8";

// Draw Header Banner
doc.rect(45, 40, 505, 55).fill(DARK);

doc
  .fillColor(GOLD)
  .fontSize(18)
  .font("Helvetica-Bold")
  .text("LUXURISEN", 60, 50, { characterSpacing: 2 });

doc
  .fillColor("#FFFFFF")
  .fontSize(9)
  .font("Helvetica")
  .text("Portfolio Project Showcase — LinkedIn Post Draft & Visual Guide", 60, 72, { characterSpacing: 0.5 });

let y = 115;

// Section 1: Post Draft
doc
  .fillColor(CHARCOAL)
  .fontSize(13)
  .font("Helvetica-Bold")
  .text("1. LinkedIn Post Draft (Optimized for Feed Retention)", 45, y);

y += 20;

// Post Container Box
const boxY = y;
const boxHeight = 270;
doc.roundedRect(45, boxY, 505, boxHeight, 6).fillAndStroke(LIGHT_BG, BORDER);

let textY = boxY + 14;

// Hook
doc
  .fillColor(DARK)
  .fontSize(9.5)
  .font("Helvetica-Bold")
  .text(
    "Most e-commerce demos stop at UI. I built Luxurisen to focus on backend resilience, distributed caching, and tamper-proof transactional architecture under the hood.",
    60,
    textY,
    { width: 475, lineGap: 3 }
  );

textY += 34;

// Stack line
doc
  .fillColor(MUTED)
  .fontSize(9)
  .font("Helvetica")
  .text("Stack: React 19, Vite, Tailwind CSS 4, Node/Express 5, MongoDB, Redis (ioredis). Deployed on Render.", 60, textY, {
    width: 475,
  });

textY += 20;

// Highlights
doc.fillColor(DARK).font("Helvetica-Bold").text("Key engineering highlights:", 60, textY);
textY += 14;

const bullets = [
  "• Distributed Redis Layer: Caches catalog and review endpoints (5–10 min TTL with X-Cache headers) and enforces cross-instance rate limiting via rate-limit-redis (200 req/15m global, 10 req/15m auth), gracefully falling back to in-memory limits and DB queries if Redis disconnects.",
  "• Tamper-Proof Logic: Discount caps, expiry, and cart thresholds are calculated strictly server-side. Razorpay signatures are verified before coupon usage counters atomically increment.",
  "• Catalog & Roles: Buyer/seller RBAC with route guards, Google OAuth + JWT in httpOnly cookies, multi-attribute product variants, ImageKit CDN pipelines, and detailed order audit histories.",
];

doc.font("Helvetica").fontSize(8.5).fillColor(CHARCOAL);

bullets.forEach((b) => {
  doc.text(b, 60, textY, { width: 475, lineGap: 2 });
  textY += 34;
});

// Disclaimer
doc
  .font("Helvetica-Oblique")
  .fontSize(8)
  .fillColor(MUTED)
  .text("(Note: This is a portfolio/educational project — no real commercial transactions take place.)", 60, textY, {
    width: 475,
  });

textY += 18;

// CTA
doc
  .font("Helvetica-Bold")
  .fontSize(8.5)
  .fillColor(DARK)
  .text(
    "How do you typically handle distributed rate limiting and cache invalidation across services? I’d love to hear your feedback and approaches in the comments!",
    60,
    textY,
    { width: 475 }
  );

y = boxY + boxHeight + 25;

// Section 2: Visual Placement Guide
doc
  .fillColor(CHARCOAL)
  .fontSize(13)
  .font("Helvetica-Bold")
  .text("2. Recommended Visual Placement Sequence", 45, y);

y += 20;

// Table Header
const tableY = y;
doc.rect(45, tableY, 505, 20).fill(DARK);

doc.fillColor(GOLD).fontSize(8.5).font("Helvetica-Bold");
doc.text("Slide / Media", 55, tableY + 6);
doc.text("Asset Name", 160, tableY + 6);
doc.text("Context & Purpose", 300, tableY + 6);

let rowY = tableY + 20;
const rows = [
  { slide: "Video / Slide 1", file: "Interactive Recording (30-45s)", desc: "End-to-end user flow (catalog ➔ variant ➔ cart ➔ checkout)." },
  { slide: "Slide 2", file: "01_homepage_hero.png", desc: "Editorial hero slider with Cormorant Garamond typography." },
  { slide: "Slide 3", file: "02_the_edits_carousel.png", desc: "Interactive 3D Depth Carousel with collection drops." },
  { slide: "Slide 4", file: "04_product_detail.png", desc: "Product variant matrix (size/stock/price) & ImageKit CDN gallery." },
  { slide: "Slide 5", file: "05_cart_page.png", desc: "Server-authoritative cart summary & promo code engine." },
  { slide: "Slide 6", file: "06_auth_login.png", desc: "Dual-role authentication portal (Google OAuth + JWT cookies)." },
  { slide: "Slide 7", file: "08_homepage_mobile.png", desc: "Mobile viewport (375px) responsive showcase." },
];

rows.forEach((r, idx) => {
  const bg = idx % 2 === 0 ? LIGHT_BG : "#FFFFFF";
  doc.rect(45, rowY, 505, 22).fillAndStroke(bg, BORDER);

  doc.fillColor(DARK).fontSize(8).font("Helvetica-Bold").text(r.slide, 55, rowY + 6);
  doc.fillColor(MUTED).font("Helvetica").text(r.file, 160, rowY + 6, { width: 130 });
  doc.fillColor(CHARCOAL).text(r.desc, 300, rowY + 6, { width: 240 });

  rowY += 22;
});

// Footer note
doc
  .fillColor(MUTED)
  .fontSize(7.5)
  .font("Helvetica")
  .text("Generated automatically for Luxurisen Portfolio Project | Full Stack MERN + Redis Architecture", 45, 780, {
    align: "center",
    width: 505,
  });

doc.end();

stream.on("finish", () => {
  console.log("PDF created successfully at:", outputPath);
});
