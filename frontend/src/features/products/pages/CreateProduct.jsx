import React, { useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router";
import { useProduct } from "../hooks/useProduct";
import LuxurisenFooter from "../../Shared/components/LuxurisenFooter";
import ThemeToggle from "../../Shared/components/ThemeToggle";

const CURRENCIES = ["INR", "USD", "EUR", "GBP"];
const MAX_IMAGES = 7;

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
  const [images, setImages] = useState([]);
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
    [images.length],
  );

  const removeImage = (idx) => {
    setImages((prev) => {
      URL.revokeObjectURL(prev[idx].preview);
      return prev.filter((_, i) => i !== idx);
    });
  };

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

      <div className="min-h-screen bg-[#fbf9f6] dark:bg-[#0a0908] text-[#0d0d0b] dark:text-[#fbf9f6] transition-colors duration-300 font-sans flex flex-col justify-between">
        <div>
          {/* ── Header ──────────────────────────────────────────── */}
          <header className="sticky top-0 z-40 flex items-center justify-between px-6 sm:px-12 py-4 border-b border-[#e4e2df] dark:border-[#292522] bg-[#fbf9f6]/90 dark:bg-[#0a0908]/90 backdrop-blur-md">
            <span
              className="text-sm tracking-[0.35em] uppercase select-none text-[#C9A96E] cursor-pointer"
              onClick={() => navigate("/")}
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
            >
              Luxurisen
            </span>

            <nav className="hidden md:flex items-center gap-8">
              <button
                onClick={() => navigate("/seller/dashboard")}
                className="text-[10px] tracking-[0.2em] uppercase font-medium text-[#6b6158] dark:text-[#a8a29e] hover:text-[#0d0d0b] dark:hover:text-white transition-colors duration-200 cursor-pointer bg-transparent border-none"
              >
                Dashboard
              </button>
              <button
                onClick={() => navigate("/seller/create-product")}
                className="text-[10px] tracking-[0.2em] uppercase font-medium text-[#C9A96E] border-b border-[#C9A96E] pb-0.5 cursor-pointer bg-transparent"
              >
                New Listing
              </button>
            </nav>

            <div className="flex items-center gap-4">
              <ThemeToggle />
              <button
                onClick={() => navigate(-1)}
                className="text-[10px] tracking-[0.18em] uppercase text-[#6b6158] dark:text-[#a8a29e] hover:text-[#0d0d0b] dark:hover:text-white transition-colors duration-200 cursor-pointer bg-transparent border-none"
              >
                ← Back
              </button>
            </div>
          </header>

          {/* ── Content ─────────────────────────────────────────── */}
          <main className="max-w-[1200px] mx-auto px-6 sm:px-12 py-10 lg:py-14">
            {/* Page heading */}
            <div className="mb-10">
              <p className="text-[10px] uppercase tracking-[0.25em] mb-2 font-medium text-[#C9A96E]">
                Create Product
              </p>
              <h1
                className="text-4xl md:text-5xl font-light text-[#0d0d0b] dark:text-white leading-tight"
                style={{ fontFamily: "'Cormorant Garamond', serif" }}
              >
                New Listing
              </h1>
            </div>

            {/* ── Two-col form ─────────────────────────────────── */}
            <form
              onSubmit={handleSubmit}
              className="flex flex-col lg:flex-row lg:gap-16 gap-10"
            >
              {/* ── LEFT: text fields ─────────────────────────── */}
              <div className="flex flex-col gap-8 flex-1 min-w-0">
                {/* Title */}
                <div className="flex flex-col gap-2">
                  <label
                    htmlFor="title"
                    className="text-[10px] uppercase tracking-[0.18em] font-medium text-[#6b6158] dark:text-[#a8a29e]"
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
                    className="bg-transparent border-b border-[#d0c5b5] dark:border-[#38332e] py-2 text-base text-[#0d0d0b] dark:text-[#fbf9f6] outline-none focus:border-[#C9A96E] transition-colors"
                  />
                </div>

                {/* Description */}
                <div className="flex flex-col gap-2">
                  <label
                    htmlFor="description"
                    className="text-[10px] uppercase tracking-[0.18em] font-medium text-[#6b6158] dark:text-[#a8a29e]"
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
                    className="bg-transparent border-b border-[#d0c5b5] dark:border-[#38332e] py-2 text-sm text-[#0d0d0b] dark:text-[#fbf9f6] outline-none focus:border-[#C9A96E] transition-colors resize-none leading-relaxed"
                  />
                </div>

                {/* Price row */}
                <div className="grid grid-cols-2 gap-8">
                  {/* Amount */}
                  <div className="flex flex-col gap-2">
                    <label
                      htmlFor="priceAmount"
                      className="text-[10px] uppercase tracking-[0.18em] font-medium text-[#6b6158] dark:text-[#a8a29e]"
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
                      className="bg-transparent border-b border-[#d0c5b5] dark:border-[#38332e] py-2 text-base text-[#0d0d0b] dark:text-[#fbf9f6] outline-none focus:border-[#C9A96E] transition-colors [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                    />
                  </div>

                  {/* Currency */}
                  <div className="flex flex-col gap-2">
                    <label
                      htmlFor="priceCurrency"
                      className="text-[10px] uppercase tracking-[0.18em] font-medium text-[#6b6158] dark:text-[#a8a29e]"
                    >
                      Currency
                    </label>
                    <select
                      id="priceCurrency"
                      name="priceCurrency"
                      value={formData.priceCurrency}
                      onChange={handleChange}
                      className="bg-transparent border-b border-[#d0c5b5] dark:border-[#38332e] py-2 text-base text-[#0d0d0b] dark:text-[#fbf9f6] outline-none focus:border-[#C9A96E] transition-colors cursor-pointer"
                    >
                      {CURRENCIES.map((c) => (
                        <option
                          key={c}
                          value={c}
                          className="bg-[#fbf9f6] dark:bg-[#141210] text-[#0d0d0b] dark:text-[#fbf9f6]"
                        >
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Mobile CTA */}
                <div className="flex flex-col items-center gap-3 pt-2 lg:hidden">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    id="list-product-btn-mobile"
                    className="w-full py-4 text-[11px] uppercase tracking-[0.25em] font-semibold bg-[#0d0d0b] dark:bg-[#fbf9f6] text-[#fbf9f6] dark:text-[#0d0d0b] hover:bg-[#C9A96E] hover:text-[#0d0d0b] dark:hover:bg-[#C9A96E] dark:hover:text-[#0d0d0b] rounded-full transition-all duration-300 cursor-pointer disabled:opacity-50"
                  >
                    {isSubmitting ? "Listing…" : "List Product"}
                  </button>
                  <button
                    type="button"
                    onClick={() => navigate(-1)}
                    className="text-[10px] tracking-[0.18em] uppercase text-[#6b6158] dark:text-[#a8a29e] underline underline-offset-4 cursor-pointer bg-transparent border-none"
                  >
                    Cancel
                  </button>
                </div>
              </div>

              {/* ── RIGHT: images + desktop CTA ───────────────── */}
              <div className="flex flex-col gap-8 lg:w-[45%] xl:w-[42%] flex-shrink-0">
                {/* Images */}
                <div className="flex flex-col">
                  <label className="text-[10px] uppercase tracking-[0.18em] font-medium mb-4 text-[#6b6158] dark:text-[#a8a29e]">
                    Product Images{" "}
                    <span className="text-[#a8a29e]">
                      ({images.length}/{MAX_IMAGES})
                    </span>
                  </label>

                  {/* Drop zone */}
                  {images.length < MAX_IMAGES && (
                    <div
                      role="button"
                      tabIndex={0}
                      onClick={() => fileInputRef.current?.click()}
                      onKeyDown={(e) =>
                        e.key === "Enter" && fileInputRef.current?.click()
                      }
                      onDragOver={onDragOver}
                      onDragLeave={onDragLeave}
                      onDrop={onDrop}
                      className={`flex flex-col items-center justify-center gap-3 py-12 rounded-lg cursor-pointer select-none transition-all duration-300 border border-dashed ${
                        isDragging
                          ? "bg-[#C9A96E]/10 border-[#C9A96E]"
                          : "bg-[#f5f3f0] dark:bg-[#141210] border-[#d0c5b5] dark:border-[#292522] hover:border-[#C9A96E]"
                      }`}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1}
                        stroke="currentColor"
                        className="w-8 h-8 text-[#C9A96E]"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M12 16.5V9.75m0 0 3 3m-3-3-3 3M6.75 19.5a4.5 4.5 0 0 1-1.41-8.775 5.25 5.25 0 0 1 10.338-2.32 5.75 5.75 0 0 1 1.026 11.095"
                        />
                      </svg>
                      <p className="text-[10px] tracking-[0.18em] uppercase text-[#0d0d0b] dark:text-[#fbf9f6]">
                        Drop files or{" "}
                        <span className="text-[#C9A96E] underline underline-offset-4">
                          click to upload
                        </span>
                      </p>
                      <p className="text-[9px] tracking-wider text-[#6b6158] dark:text-[#a8a29e]">
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
                  <div className="mt-4 grid grid-cols-7 gap-2">
                    {images.map((img, i) => (
                      <div
                        key={i}
                        className="relative group aspect-square rounded overflow-hidden border border-[#e4e2df] dark:border-[#292522]"
                      >
                        <img
                          src={img.preview}
                          alt={`Product ${i + 1}`}
                          className="w-full h-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(i)}
                          aria-label="Remove image"
                          className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-black/60 cursor-pointer border-none"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={2}
                            stroke="currentColor"
                            className="w-4 h-4 text-white"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M6 18 18 6M6 6l12 12"
                            />
                          </svg>
                        </button>
                      </div>
                    ))}
                    {Array.from({ length: MAX_IMAGES - images.length }).map(
                      (_, i) => (
                        <div
                          key={`e-${i}`}
                          onClick={() => fileInputRef.current?.click()}
                          className="aspect-square cursor-pointer transition-colors duration-200 border border-dashed border-[#e4e2df] dark:border-[#292522] rounded bg-[#f5f3f0] dark:bg-[#141210] hover:border-[#C9A96E]"
                        />
                      ),
                    )}
                  </div>
                </div>

                {/* Divider */}
                <div className="hidden lg:block border-t border-[#e4e2df] dark:border-[#292522]" />

                {/* Desktop CTA */}
                <div className="hidden lg:flex flex-col gap-3">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    id="list-product-btn"
                    className="w-full py-4 text-[11px] uppercase tracking-[0.25em] font-semibold bg-[#0d0d0b] dark:bg-[#fbf9f6] text-[#fbf9f6] dark:text-[#0d0d0b] hover:bg-[#C9A96E] hover:text-[#0d0d0b] dark:hover:bg-[#C9A96E] dark:hover:text-[#0d0d0b] rounded-full transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer shadow-sm"
                  >
                    {isSubmitting ? "Listing…" : "List Product"}
                  </button>
                  <button
                    type="button"
                    onClick={() => navigate(-1)}
                    className="w-full py-2 text-[10px] uppercase tracking-[0.18em] text-[#6b6158] dark:text-[#a8a29e] hover:text-[#0d0d0b] dark:hover:text-white underline underline-offset-4 transition-colors duration-200 cursor-pointer bg-transparent border-none text-center"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </form>
          </main>
        </div>

        <LuxurisenFooter />
      </div>
    </>
  );
};

export default CreateProduct;
