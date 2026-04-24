import React, { useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router";
import { useProduct } from "../hooks/useProduct";

const CURRENCIES = ["USD", "EUR", "GBP", "INR"];
const MAX_IMAGES = 7;

const CreateProduct = () => {
  const { handleCreateProducts } = useProduct();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    priceAmount: "",
    priceCurrency: "INR",
  });
  const [images, setImages] = useState([]); // Array of { file, preview }
  const [isDragging, setIsDragging] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef(null);

  /* ── helpers ─────────────────────────────────────────────────── */
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
    [images.length],
  );

  const removeImage = (idx) => {
    setImages((prev) => {
      URL.revokeObjectURL(prev[idx].preview);
      return prev.filter((_, i) => i !== idx);
    });
  };

  /* ── drag-and-drop ───────────────────────────────────────────── */
  const onDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };
  const onDragLeave = () => setIsDragging(false);
  const onDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    addFiles(e.dataTransfer.files);
  };

  /* ── submit ──────────────────────────────────────────────────── */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const payload = new FormData();
      payload.append("title", formData.title);
      payload.append("description", formData.description);
      payload.append("priceAmount", formData.priceAmount);
      payload.append("priceCurrency", formData.priceCurrency);
      images.forEach(({ file }) => payload.append("images", file));
      await handleCreateProducts(payload);
      navigate("/");
    } catch (err) {
      console.error("Create product failed:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  /* ── render ──────────────────────────────────────────────────── */
  return (
    <div className="min-h-screen bg-[#0e0e0e] text-[#e5e2e1] font-sans selection:bg-[#FFD700] selection:text-[#131313]">
      {/* ── Header ─────────────────────────────────────────────── */}
      <header className="sticky top-0 z-50 flex items-center justify-between px-8 md:px-16 py-5 border-b border-[#1c1b1b] bg-[#0e0e0e]/90 backdrop-blur-sm">
        <span className="text-[#FFD700] text-lg font-bold tracking-widest uppercase select-none">
          Snitch
        </span>

        {/* Right nav icons */}
        <div className="flex items-center gap-6">
          {/* Bag icon */}
          <button
            aria-label="Cart"
            className="text-[#999077] hover:text-[#FFD700] transition-colors duration-200"
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
          </button>

          {/* User icon */}
          <button
            aria-label="Profile"
            className="text-[#999077] hover:text-[#FFD700] transition-colors duration-200"
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
                d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
              />
            </svg>
          </button>
        </div>
      </header>

      {/* ── Page Content ───────────────────────────────────────── */}
      <main className="px-6 sm:px-10 lg:px-20 xl:px-28 py-14 lg:py-20">

        {/* Page title block */}
        <div className="mb-12 lg:mb-16">
          <p className="text-xs font-semibold tracking-[0.2em] uppercase text-[#FFD700] mb-3">
            Create Product
          </p>
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-white leading-[1.05]">
            New Listing
          </h1>
        </div>

        {/* ── Two-column form on lg+, single column on mobile ───── */}
        <form onSubmit={handleSubmit} className="flex flex-col lg:flex-row lg:gap-16 xl:gap-24 gap-12">

          {/* ── LEFT COLUMN: text fields ──────────────────────── */}
          <div className="flex flex-col gap-10 flex-1 min-w-0">

            {/* Title */}
            <div className="flex flex-col group">
              <label
                htmlFor="title"
                className="text-xs font-medium tracking-[0.15em] uppercase text-[#999077] mb-3 group-focus-within:text-[#FFD700] transition-colors duration-200"
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
                className="bg-transparent text-white text-lg border-b border-[#4d4732] focus:border-[#FFD700] outline-none pt-2 pb-4 px-1 placeholder-[#4d4732] transition-colors duration-300 w-full"
              />
            </div>

            {/* Description */}
            <div className="flex flex-col group">
              <label
                htmlFor="description"
                className="text-xs font-medium tracking-[0.15em] uppercase text-[#999077] mb-3 group-focus-within:text-[#FFD700] transition-colors duration-200"
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
                className="bg-transparent text-white text-base border-b border-[#4d4732] focus:border-[#FFD700] outline-none pt-2 pb-4 px-1 resize-none placeholder-[#4d4732] leading-relaxed transition-colors duration-300 w-full"
              />
            </div>

            {/* Price row — amount + currency side by side */}
            <div className="grid grid-cols-2 gap-8">
              {/* Price Amount */}
              <div className="flex flex-col group">
                <label
                  htmlFor="priceAmount"
                  className="text-xs font-medium tracking-[0.15em] uppercase text-[#999077] mb-3 group-focus-within:text-[#FFD700] transition-colors duration-200"
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
                  className="bg-transparent text-white text-lg border-b border-[#4d4732] focus:border-[#FFD700] outline-none pt-2 pb-4 px-1 placeholder-[#4d4732] transition-colors duration-300 [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none w-full"
                />
              </div>

              {/* Price Currency */}
              <div className="flex flex-col group">
                <label
                  htmlFor="priceCurrency"
                  className="text-xs font-medium tracking-[0.15em] uppercase text-[#999077] mb-3 group-focus-within:text-[#FFD700] transition-colors duration-200"
                >
                  Currency
                </label>
                <select
                  id="priceCurrency"
                  name="priceCurrency"
                  value={formData.priceCurrency}
                  onChange={handleChange}
                  className="bg-transparent text-white text-lg border-b border-[#4d4732] focus:border-[#FFD700] outline-none pt-2 pb-4 px-1 cursor-pointer transition-colors duration-300 appearance-none w-full"
                  style={{ backgroundImage: "none" }}
                >
                  {CURRENCIES.map((c) => (
                    <option key={c} value={c} className="bg-[#131313] text-white">
                      {c}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* On mobile: Actions sit below price fields */}
            <div className="flex flex-col items-center gap-5 pt-2 lg:hidden">
              <button
                type="submit"
                disabled={isSubmitting}
                id="list-product-btn-mobile"
                className="w-full bg-gradient-to-r from-[#e9c400] to-[#ffd700] text-[#1a1400] font-bold tracking-widest uppercase py-4 px-8 hover:from-[#ffd700] hover:to-[#ffe44d] hover:-translate-y-0.5 active:translate-y-0 hover:shadow-[0_0_30px_rgba(255,215,0,0.2)] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
              >
                {isSubmitting ? "Listing…" : "List Product"}
              </button>
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="text-xs tracking-[0.15em] uppercase text-[#999077] hover:text-[#e5e2e1] transition-colors duration-200"
              >
                Cancel
              </button>
            </div>
          </div>

          {/* ── RIGHT COLUMN: images + desktop actions ─────────── */}
          <div className="flex flex-col gap-8 lg:w-[45%] xl:w-[42%] flex-shrink-0">

            {/* Images label */}
            <div className="flex flex-col">
              <label className="text-xs font-medium tracking-[0.15em] uppercase text-[#999077] mb-4">
                Product Images{" "}
                <span className="text-[#4d4732]">({images.length}/{MAX_IMAGES})</span>
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
                  className={`flex flex-col items-center justify-center gap-3 border border-dashed py-14 cursor-pointer transition-all duration-300 select-none ${
                    isDragging
                      ? "border-[#FFD700] bg-[#FFD700]/5"
                      : "border-[#2a2a2a] hover:border-[#999077] bg-[#131313]"
                  }`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1}
                    stroke="currentColor"
                    className={`w-8 h-8 transition-colors duration-300 ${
                      isDragging ? "text-[#FFD700]" : "text-[#4d4732]"
                    }`}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 16.5V9.75m0 0 3 3m-3-3-3 3M6.75 19.5a4.5 4.5 0 0 1-1.41-8.775 5.25 5.25 0 0 1 10.338-2.32 5.75 5.75 0 0 1 1.026 11.095"
                    />
                  </svg>
                  <p className="text-xs tracking-[0.15em] uppercase text-[#999077]">
                    Drop files or{" "}
                    <span className="text-[#FFD700] underline underline-offset-2">
                      click to upload
                    </span>
                  </p>
                  <p className="text-[10px] text-[#4d4732] tracking-wider">
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

              {/* Unified 7-slot thumbnail grid */}
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
                      className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={2}
                        stroke="currentColor"
                        className="w-4 h-4 text-white"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ))}
                {Array.from({ length: MAX_IMAGES - images.length }).map((_, i) => (
                  <div
                    key={`empty-${i}`}
                    onClick={() => fileInputRef.current?.click()}
                    className="aspect-square bg-[#131313] border border-dashed border-[#2a2a2a] hover:border-[#999077] cursor-pointer transition-colors duration-200"
                  />
                ))}
              </div>
            </div>

            {/* Desktop-only divider line */}
            <div className="hidden lg:block border-t border-[#1c1b1b]" />

            {/* Desktop Actions */}
            <div className="hidden lg:flex flex-col gap-4">
              <button
                type="submit"
                disabled={isSubmitting}
                id="list-product-btn"
                className="w-full bg-gradient-to-r from-[#e9c400] to-[#ffd700] text-[#1a1400] font-bold tracking-widest uppercase py-4 px-8 hover:from-[#ffd700] hover:to-[#ffe44d] hover:-translate-y-0.5 active:translate-y-0 hover:shadow-[0_0_30px_rgba(255,215,0,0.2)] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
              >
                {isSubmitting ? "Listing…" : "List Product"}
              </button>
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="w-full text-xs tracking-[0.15em] uppercase text-[#999077] hover:text-[#e5e2e1] transition-colors duration-200 py-2"
              >
                Cancel
              </button>
            </div>
          </div>

        </form>
      </main>
    </div>
  );
};

export default CreateProduct;
