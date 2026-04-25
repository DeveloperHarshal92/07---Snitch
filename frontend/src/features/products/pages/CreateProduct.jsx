import React, { useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router";
import { useProduct } from "../hooks/useProduct";

const CURRENCIES = ["INR", "USD", "EUR", "GBP"];
const MAX_IMAGES = 7;

/* ── shared inline tokens ────────────────────────────────────── */
const T = {
  bg:       "#fbf9f6",
  surface:  "#f5f3f0",
  border:   "#e4e2df",
  borderMd: "#d0c5b5",
  text:     "#0d0d0b",
  muted:    "#3d342c",
  subtle:   "#6b6158",
  gold:     "#C9A96E",
  serif:    "'Cormorant Garamond', serif",
  sans:     "'Inter', sans-serif",
};

const inputBase = {
  backgroundColor: "transparent",
  color: T.text,
  borderBottom: `1px solid ${T.borderMd}`,
  fontFamily: T.sans,
  outline: "none",
  paddingTop:    "0.5rem",
  paddingBottom: "1rem",
  paddingLeft:   "0.25rem",
  paddingRight:  "0.25rem",
  width: "100%",
};

const onFocus = (e) => { e.target.style.borderBottomColor = T.gold; };
const onBlur  = (e) => { e.target.style.borderBottomColor = T.borderMd; };

/* ── CreateProduct ───────────────────────────────────────────── */
const CreateProduct = () => {
  const { handleCreateProducts } = useProduct();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    priceAmount: "",
    priceCurrency: "INR",
  });
  const [images, setImages]       = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const addFiles = useCallback(
    (files) => {
      const remaining = MAX_IMAGES - images.length;
      if (remaining <= 0) return;
      const accepted = Array.from(files)
        .filter((f) => f.type.startsWith("image/"))
        .slice(0, remaining)
        .map((file) => ({ file, preview: URL.createObjectURL(file) }));
      setImages((prev) => [...prev, ...accepted]);
    },
    [images.length]
  );

  const removeImage = (idx) => {
    setImages((prev) => {
      URL.revokeObjectURL(prev[idx].preview);
      return prev.filter((_, i) => i !== idx);
    });
  };

  const onDragOver  = (e) => { e.preventDefault(); setIsDragging(true); };
  const onDragLeave = ()  => setIsDragging(false);
  const onDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    addFiles(e.dataTransfer.files);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const payload = new FormData();
      payload.append("title",         formData.title);
      payload.append("description",   formData.description);
      payload.append("priceAmount",   formData.priceAmount);
      payload.append("priceCurrency", formData.priceCurrency);
      images.forEach(({ file }) => payload.append("images", file));
      await handleCreateProducts(payload);
      navigate("/seller/dashboard");
    } catch (err) {
      console.error("Create product failed:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <link
        href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=Inter:wght@300;400;500;600&display=swap"
        rel="stylesheet"
      />

      <div
        className="min-h-screen selection:bg-[#C9A96E]/30"
        style={{ backgroundColor: T.bg, fontFamily: T.sans, color: T.text }}
      >

        {/* ── Header ──────────────────────────────────────────── */}
        <header
          className="sticky top-0 z-50 flex items-center justify-between px-8 md:px-16 py-5 border-b"
          style={{ backgroundColor: T.bg, borderColor: T.border }}
        >
          <span
            className="text-sm tracking-[0.35em] uppercase select-none"
            style={{ fontFamily: T.serif, color: T.gold }}
          >
            Snitch.
          </span>

          <nav className="hidden md:flex items-center gap-8">
            <button
              onClick={() => navigate("/seller/dashboard")}
              className="text-[10px] tracking-[0.2em] uppercase font-medium transition-colors duration-200"
              style={{ color: T.subtle }}
              onMouseEnter={e => e.target.style.color = T.text}
              onMouseLeave={e => e.target.style.color = T.subtle}
            >
              Dashboard
            </button>
            <button
              onClick={() => navigate("/seller/create-product")}
              className="text-[10px] tracking-[0.2em] uppercase font-medium"
              style={{ color: T.gold, borderBottom: `1px solid ${T.gold}`, paddingBottom: "2px" }}
            >
              New Listing
            </button>
          </nav>

          {/* discard */}
          <button
            onClick={() => navigate(-1)}
            className="text-[10px] tracking-[0.18em] uppercase transition-colors duration-200"
            style={{ color: T.subtle }}
            onMouseEnter={e => e.target.style.color = T.text}
            onMouseLeave={e => e.target.style.color = T.subtle}
          >
            ← Back
          </button>
        </header>

        {/* ── Content ─────────────────────────────────────────── */}
        <main className="px-8 sm:px-12 lg:px-20 xl:px-28 py-14 lg:py-20">

          {/* Page heading */}
          <div className="mb-12 lg:mb-16">
            <p className="text-[10px] uppercase tracking-[0.22em] mb-3 font-medium" style={{ color: T.gold }}>
              Create Product
            </p>
            <h1
              className="text-5xl md:text-6xl font-light leading-[1.05]"
              style={{ fontFamily: T.serif, color: T.text }}
            >
              New Listing
            </h1>
          </div>

          {/* ── Two-col form ─────────────────────────────────── */}
          <form
            onSubmit={handleSubmit}
            className="flex flex-col lg:flex-row lg:gap-16 xl:gap-24 gap-12"
          >

            {/* ── LEFT: text fields ─────────────────────────── */}
            <div className="flex flex-col gap-10 flex-1 min-w-0">

              {/* Title */}
              <div className="flex flex-col gap-2">
                <label
                  htmlFor="title"
                  className="text-[10px] uppercase tracking-[0.18em] font-medium"
                  style={{ color: T.muted }}
                >
                  Title
                </label>
                <input
                  id="title"
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  autoComplete="off"
                  placeholder="Collection name or garment title"
                  style={{ ...inputBase, fontSize: "1rem" }}
                  onFocus={onFocus}
                  onBlur={onBlur}
                />
              </div>

              {/* Description */}
              <div className="flex flex-col gap-2">
                <label
                  htmlFor="description"
                  className="text-[10px] uppercase tracking-[0.18em] font-medium"
                  style={{ color: T.muted }}
                >
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                  rows={6}
                  placeholder="Detail the cut, fabric, and silhouette..."
                  style={{ ...inputBase, resize: "none", lineHeight: "1.7", fontSize: "0.875rem" }}
                  onFocus={onFocus}
                  onBlur={onBlur}
                />
              </div>

              {/* Price row */}
              <div className="grid grid-cols-2 gap-8">

                {/* Amount */}
                <div className="flex flex-col gap-2">
                  <label
                    htmlFor="priceAmount"
                    className="text-[10px] uppercase tracking-[0.18em] font-medium"
                    style={{ color: T.muted }}
                  >
                    Price Amount
                  </label>
                  <input
                    id="priceAmount"
                    type="number"
                    name="priceAmount"
                    value={formData.priceAmount}
                    onChange={handleChange}
                    required
                    min="0"
                    step="0.01"
                    placeholder="0.00"
                    style={{ ...inputBase, fontSize: "1rem" }}
                    className="[appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                    onFocus={onFocus}
                    onBlur={onBlur}
                  />
                </div>

                {/* Currency */}
                <div className="flex flex-col gap-2">
                  <label
                    htmlFor="priceCurrency"
                    className="text-[10px] uppercase tracking-[0.18em] font-medium"
                    style={{ color: T.muted }}
                  >
                    Currency
                  </label>
                  <select
                    id="priceCurrency"
                    name="priceCurrency"
                    value={formData.priceCurrency}
                    onChange={handleChange}
                    style={{ ...inputBase, fontSize: "1rem", cursor: "pointer", appearance: "none" }}
                    onFocus={onFocus}
                    onBlur={onBlur}
                  >
                    {CURRENCIES.map((c) => (
                      <option key={c} value={c} style={{ backgroundColor: T.bg, color: T.text }}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Mobile CTA */}
              <div className="flex flex-col items-center gap-4 pt-2 lg:hidden">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  id="list-product-btn-mobile"
                  className="w-full py-4 text-[11px] uppercase tracking-[0.25em] font-medium transition-all duration-300"
                  style={{ backgroundColor: T.text, color: T.bg }}
                  onMouseEnter={e => { e.currentTarget.style.backgroundColor = T.gold; e.currentTarget.style.color = T.text; }}
                  onMouseLeave={e => { e.currentTarget.style.backgroundColor = T.text; e.currentTarget.style.color = T.bg; }}
                >
                  {isSubmitting ? "Listing…" : "List Product"}
                </button>
                <button
                  type="button"
                  onClick={() => navigate(-1)}
                  className="text-[10px] tracking-[0.18em] uppercase transition-colors duration-200"
                  style={{ color: T.subtle, textDecoration: "underline", textUnderlineOffset: "3px" }}
                >
                  Cancel
                </button>
              </div>
            </div>

            {/* ── RIGHT: images + desktop CTA ───────────────── */}
            <div className="flex flex-col gap-8 lg:w-[45%] xl:w-[42%] flex-shrink-0">

              {/* Images */}
              <div className="flex flex-col">
                <label className="text-[10px] uppercase tracking-[0.18em] font-medium mb-4" style={{ color: T.muted }}>
                  Product Images{" "}
                  <span style={{ color: T.subtle }}>({images.length}/{MAX_IMAGES})</span>
                </label>

                {/* Drop zone */}
                {images.length < MAX_IMAGES && (
                  <div
                    role="button"
                    tabIndex={0}
                    onClick={() => fileInputRef.current?.click()}
                    onKeyDown={(e) => e.key === "Enter" && fileInputRef.current?.click()}
                    onDragOver={onDragOver}
                    onDragLeave={onDragLeave}
                    onDrop={onDrop}
                    className="flex flex-col items-center justify-center gap-3 py-14 cursor-pointer select-none transition-all duration-300 border"
                    style={{
                      backgroundColor: isDragging ? `${T.gold}0d` : T.surface,
                      borderColor: isDragging ? T.gold : T.border,
                      borderStyle: "dashed",
                    }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1}
                      stroke="currentColor"
                      className="w-7 h-7 transition-colors duration-300"
                      style={{ color: isDragging ? T.gold : T.border }}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V9.75m0 0 3 3m-3-3-3 3M6.75 19.5a4.5 4.5 0 0 1-1.41-8.775 5.25 5.25 0 0 1 10.338-2.32 5.75 5.75 0 0 1 1.026 11.095" />
                    </svg>
                    <p className="text-[10px] tracking-[0.18em] uppercase" style={{ color: T.muted }}>
                      Drop files or{" "}
                      <span style={{ color: T.gold, textDecoration: "underline", textUnderlineOffset: "3px" }}>
                        click to upload
                      </span>
                    </p>
                    <p className="text-[9px] tracking-wider" style={{ color: T.subtle }}>
                      PNG, JPG, WEBP · Max {MAX_IMAGES} images
                    </p>
                  </div>
                )}

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={(e) => addFiles(e.target.files)}
                />

                {/* 7-slot grid */}
                <div className="mt-4 grid grid-cols-7 gap-1.5">
                  {images.map((img, i) => (
                    <div key={i} className="relative group aspect-square">
                      <img
                        src={img.preview}
                        alt={`Product ${i + 1}`}
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(i)}
                        aria-label="Remove image"
                        className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                        style={{ backgroundColor: "rgba(27,24,20,0.55)" }}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 text-white">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  ))}
                  {Array.from({ length: MAX_IMAGES - images.length }).map((_, i) => (
                    <div
                      key={`e-${i}`}
                      onClick={() => fileInputRef.current?.click()}
                      className="aspect-square cursor-pointer transition-colors duration-200 border"
                      style={{ backgroundColor: T.surface, borderColor: T.border, borderStyle: "dashed" }}
                      onMouseEnter={e => e.currentTarget.style.borderColor = T.gold}
                      onMouseLeave={e => e.currentTarget.style.borderColor = T.border}
                    />
                  ))}
                </div>
              </div>

              {/* Divider */}
              <div className="hidden lg:block border-t" style={{ borderColor: T.border }} />

              {/* Desktop CTA */}
              <div className="hidden lg:flex flex-col gap-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  id="list-product-btn"
                  className="w-full py-4 text-[11px] uppercase tracking-[0.25em] font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ backgroundColor: T.text, color: T.bg }}
                  onMouseEnter={e => { if (!isSubmitting) { e.currentTarget.style.backgroundColor = T.gold; e.currentTarget.style.color = T.text; } }}
                  onMouseLeave={e => { e.currentTarget.style.backgroundColor = T.text; e.currentTarget.style.color = T.bg; }}
                >
                  {isSubmitting ? "Listing…" : "List Product"}
                </button>
                <button
                  type="button"
                  onClick={() => navigate(-1)}
                  className="w-full py-2 text-[10px] uppercase tracking-[0.18em] transition-colors duration-200"
                  style={{ color: T.subtle, textDecoration: "underline", textUnderlineOffset: "3px" }}
                  onMouseEnter={e => e.target.style.color = T.muted}
                  onMouseLeave={e => e.target.style.color = T.subtle}
                >
                  Cancel
                </button>
              </div>

            </div>
          </form>
        </main>
      </div>
    </>
  );
};

export default CreateProduct;
