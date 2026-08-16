import React, { useState, useEffect } from "react";
import { useProduct } from "../hooks/useProduct";
import { useParams, useNavigate } from "react-router";
import LuxurisenFooter from "../../Shared/components/LuxurisenFooter";
import ThemeToggle from "../../Shared/components/ThemeToggle";

/* ── Google Fonts ─────────────────────────────────────────────── */
const FontLink = () => (
  <link
    href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=Inter:wght@300;400;500;600&display=swap"
    rel="stylesheet"
  />
);

/* ── Currency formatter ───────────────────────────────────────── */
const fmt = (amount, currency = "INR") =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: currency || "INR",
    maximumFractionDigits: 0,
  }).format(amount);

/* ── SellerProductDetails ─────────────────────────────────────── */
const SellerProductDetails = () => {
  const { productId } = useParams();
  const navigate = useNavigate();

  const { handleGetProductDetails, handleAddProductVariant } = useProduct();

  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [visible, setVisible] = useState(false);

  /* Inline form state */
  const [showForm, setShowForm] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [newVariant, setNewVariant] = useState({
    images: [],
    stock: "",
    price: { amount: "", currency: "INR" },
    attributes: [{ id: Date.now(), key: "", value: "" }],
  });
  const [dragOver, setDragOver] = useState(false);
  const [previewUrls, setPreviewUrls] = useState([]);

  /* ── Data fetching ─────────────────────────────────────────── */
  const fetchProduct = async () => {
    setIsLoading(true);
    const data = await handleGetProductDetails(productId);
    setProduct(data);
    setIsLoading(false);
    setTimeout(() => setVisible(true), 60);
  };

  useEffect(() => {
    fetchProduct();
  }, [productId]);

  /* ── Image helpers ─────────────────────────────────────────── */
  const addFiles = (files) => {
    const accepted = Array.from(files).filter((f) =>
      f.type.startsWith("image/"),
    );
    const combined = [...(newVariant.images || []), ...accepted];
    setPreviewUrls(combined.map((f) => URL.createObjectURL(f)));
    setNewVariant((v) => ({ ...v, images: combined }));
  };

  const removeImage = (idx) => {
    const imgs = [...newVariant.images];
    imgs.splice(idx, 1);
    setPreviewUrls(imgs.map((f) => URL.createObjectURL(f)));
    setNewVariant((v) => ({ ...v, images: imgs }));
  };

  /* ── Attribute helpers ─────────────────────────────────────── */
  const addAttribute = () =>
    setNewVariant((v) => ({
      ...v,
      attributes: [...v.attributes, { id: Date.now(), key: "", value: "" }],
    }));

  const removeAttribute = (id) =>
    setNewVariant((v) => ({
      ...v,
      attributes: v.attributes.filter((a) => a.id !== id),
    }));

  const changeAttribute = (id, field, val) =>
    setNewVariant((v) => ({
      ...v,
      attributes: v.attributes.map((a) =>
        a.id === id ? { ...a, [field]: val } : a,
      ),
    }));

  /* ── Form reset ────────────────────────────────────────────── */
  const resetForm = () => {
    previewUrls.forEach((u) => URL.revokeObjectURL(u));
    setPreviewUrls([]);
    setNewVariant({
      images: [],
      stock: "",
      price: { amount: "", currency: "INR" },
      attributes: [{ id: Date.now(), key: "", value: "" }],
    });
    setShowForm(false);
  };

  /* ── Submit variant ────────────────────────────────────────── */
  const submitVariant = async (e) => {
    e.preventDefault();
    setIsCreating(true);

    try {
      const payload = new FormData();
      payload.append("stock", newVariant.stock);

      const priceToSend = newVariant.price.amount
        ? newVariant.price.amount
        : (product.price?.amount ?? 0);
      payload.append("priceAmount", priceToSend);
      payload.append(
        "priceCurrency",
        newVariant.price.currency || (product.price?.currency ?? "INR"),
      );

      const attrObj = {};
      newVariant.attributes.forEach((a) => {
        if (a.key.trim() && a.value.trim()) {
          attrObj[a.key.trim()] = a.value.trim();
        }
      });
      payload.append("attributes", JSON.stringify(attrObj));

      newVariant.images.forEach((file) => {
        payload.append("images", file);
      });

      await handleAddProductVariant(productId, payload);
      resetForm();
      fetchProduct();
    } catch (err) {
      console.error(err);
    } finally {
      setIsCreating(false);
    }
  };

  /* ── Skeleton loading ──────────────────────────────────────── */
  if (isLoading && !product) {
    return (
      <>
        <FontLink />
        <div className="min-h-screen bg-[#fbf9f6] dark:bg-[#0a0908] font-sans flex flex-col">
          <div className="max-w-[1200px] w-full mx-auto px-6 sm:px-12 py-12 flex-1">
            <div className="h-4 w-28 bg-[#e4e2df] dark:bg-[#1f1c19] rounded mb-8 animate-pulse" />
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12 animate-pulse">
              <div className="lg:col-span-3 aspect-[3/4] bg-[#e4e2df] dark:bg-[#1f1c19] rounded" />
              <div className="lg:col-span-9 flex flex-col gap-4">
                <div className="h-8 w-1/2 bg-[#e4e2df] dark:bg-[#1f1c19] rounded" />
                <div className="h-4 w-3/4 bg-[#e4e2df] dark:bg-[#1f1c19] rounded" />
                <div className="h-6 w-1/4 bg-[#e4e2df] dark:bg-[#1f1c19] rounded mt-4" />
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  if (!product) return null;

  const totalStock =
    product.variants?.reduce((s, v) => s + (v.stock ?? 0), 0) ?? 0;

  return (
    <>
      <FontLink />
      <div className="min-h-screen bg-[#fbf9f6] dark:bg-[#0a0908] text-[#0d0d0b] dark:text-[#fbf9f6] transition-colors duration-300 font-sans flex flex-col justify-between">
        <div>
          {/* ── Navbar ─────────────────────────────────────────── */}
          <header className="sticky top-0 z-40 border-b border-[#e4e2df] dark:border-[#292522] flex items-center justify-between px-6 sm:px-12 h-16 bg-[#fbf9f6]/90 dark:bg-[#0a0908]/90 backdrop-blur-md">
            <span
              className="text-sm tracking-[0.35em] uppercase select-none cursor-pointer text-[#C9A96E]"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
              onClick={() => navigate("/")}
            >
              Luxurisen
            </span>
            <div className="flex items-center gap-4">
              <ThemeToggle />
              <span className="text-[0.6rem] tracking-[0.25em] uppercase text-[#6b6158] dark:text-[#a8a29e]">
                Seller Portal
              </span>
            </div>
          </header>

          {/* ── Breadcrumb ─────────────────────────────────────── */}
          <div
            className={`max-w-[1200px] mx-auto px-6 sm:px-12 pt-8 pb-2 flex items-center gap-2 transition-all duration-500 ${
              visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
            }`}
          >
            <button
              onClick={() => navigate("/seller/dashboard")}
              className="text-[0.6rem] tracking-[0.2em] uppercase bg-transparent border-none cursor-pointer text-[#6b6158] dark:text-[#a8a29e] hover:text-[#C9A96E] p-0"
            >
              Dashboard
            </button>
            <span className="text-[0.6rem] text-[#d0c5b5] dark:text-[#38332e]">
              /
            </span>
            <span className="text-[0.6rem] tracking-[0.2em] uppercase text-[#3d342c] dark:text-[#d6d3d1] truncate max-w-xs">
              {product.title}
            </span>
          </div>

          {/* ── Main ───────────────────────────────────────────── */}
          <main
            className={`max-w-[1200px] mx-auto px-6 sm:px-12 py-8 pb-28 transition-all duration-500 ${
              visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
          >
            {/* ── Product summary ──────────────────────────────── */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-10 pb-10 border-b border-[#e4e2df] dark:border-[#292522]">
              {/* Thumbnail */}
              <div className="lg:col-span-3">
                <div className="aspect-[3/4] rounded-lg overflow-hidden bg-[#f5f3f0] dark:bg-[#141210] border border-[#e4e2df] dark:border-[#292522]">
                  {product.images?.[0] ? (
                    <img
                      src={product.images[0].url}
                      alt={product.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-[#a8a29e]">
                      <svg
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1}
                        stroke="currentColor"
                        className="w-10 h-10"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Z"
                        />
                      </svg>
                    </div>
                  )}
                </div>
              </div>

              {/* Info */}
              <div className="lg:col-span-6 flex flex-col justify-center gap-3">
                <p className="text-[0.55rem] tracking-[0.28em] uppercase m-0 text-[#C9A96E] font-medium">
                  Product Settings
                </p>
                <h1
                  className="m-0 font-light leading-tight text-3xl sm:text-4xl text-[#0d0d0b] dark:text-white"
                  style={{ fontFamily: "'Cormorant Garamond', serif" }}
                >
                  {product.title}
                </h1>
                <p className="m-0 text-xs sm:text-sm leading-relaxed font-light text-[#3d342c] dark:text-[#a8a29e] line-clamp-3">
                  {product.description}
                </p>
                <div className="flex items-center gap-4 mt-2">
                  <span className="text-xl font-medium text-[#C9A96E]">
                    {fmt(product.price?.amount, product.price?.currency)}
                  </span>
                  <span className="text-[0.55rem] tracking-[0.15em] uppercase px-2.5 py-1 rounded bg-[#f5f3f0] dark:bg-[#161412] text-[#3d342c] dark:text-[#d6d3d1] border border-transparent dark:border-[#292522]">
                    Base price
                  </span>
                </div>
              </div>

              {/* Stats */}
              <div className="lg:col-span-3 grid grid-cols-3 lg:grid-cols-1 gap-4 lg:gap-0 lg:border-l border-[#e4e2df] dark:border-[#292522] lg:pl-8">
                {[
                  { label: "Variants", value: product.variants?.length ?? 0 },
                  { label: "Total Stock", value: totalStock },
                  { label: "Images", value: product.images?.length ?? 0 },
                ].map(({ label, value }) => (
                  <div
                    key={label}
                    className="flex flex-col gap-1 py-3 lg:border-b border-[#e4e2df] dark:border-[#292522] last:border-b-0"
                  >
                    <span className="text-[0.55rem] tracking-[0.2em] uppercase text-[#6b6158] dark:text-[#a8a29e]">
                      {label}
                    </span>
                    <span
                      className="text-2xl font-light text-[#0d0d0b] dark:text-[#fbf9f6]"
                      style={{ fontFamily: "'Cormorant Garamond', serif" }}
                    >
                      {value}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* ── Variants box ─────────────────────────────────── */}
            <div className="border border-[#e4e2df] dark:border-[#292522] rounded-lg overflow-hidden bg-white dark:bg-[#141210]">
              {/* Box header */}
              <div className="flex items-center justify-between px-6 py-5 border-b border-[#e4e2df] dark:border-[#292522]">
                <div>
                  <p className="text-[0.55rem] tracking-[0.28em] uppercase mb-0.5 m-0 text-[#C9A96E] font-medium">
                    Inventory
                  </p>
                  <h2
                    className="m-0 font-light text-2xl text-[#0d0d0b] dark:text-white"
                    style={{ fontFamily: "'Cormorant Garamond', serif" }}
                  >
                    Variants ({product.variants?.length ?? 0})
                  </h2>
                </div>

                {!showForm && (
                  <button
                    onClick={() => setShowForm(true)}
                    className="flex items-center gap-2 px-5 py-2.5 text-[0.6rem] tracking-[0.22em] uppercase font-semibold bg-[#0d0d0b] dark:bg-[#fbf9f6] text-[#fbf9f6] dark:text-[#0d0d0b] hover:bg-[#C9A96E] hover:text-[#0d0d0b] dark:hover:bg-[#C9A96E] dark:hover:text-[#0d0d0b] rounded-full transition-all cursor-pointer shadow-sm border-none"
                  >
                    <svg
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={2.5}
                      stroke="currentColor"
                      className="w-3 h-3"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 4.5v15m7.5-7.5h-15"
                      />
                    </svg>
                    Add Variant
                  </button>
                )}
              </div>

              {/* ── Inline form ───────── */}
              {showForm && (
                <div className="border-b border-[#e4e2df] dark:border-[#292522] px-6 py-8 bg-[#fdfcfa] dark:bg-[#1a1715]">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <p className="text-[0.55rem] tracking-[0.28em] uppercase mb-0.5 m-0 text-[#C9A96E] font-medium">
                        New
                      </p>
                      <h3
                        className="m-0 font-light text-2xl text-[#0d0d0b] dark:text-white"
                        style={{ fontFamily: "'Cormorant Garamond', serif" }}
                      >
                        Add Variant
                      </h3>
                    </div>
                    <button
                      type="button"
                      onClick={resetForm}
                      className="w-8 h-8 flex items-center justify-center rounded-full text-[#6b6158] dark:text-[#a8a29e] hover:text-[#0d0d0b] dark:hover:text-white bg-transparent border-none cursor-pointer"
                    >
                      <svg
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={2}
                        stroke="currentColor"
                        className="w-4 h-4"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M6 18 18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </div>

                  <form onSubmit={submitVariant} className="flex flex-col gap-6">
                    {/* Images */}
                    <div className="flex flex-col gap-2.5">
                      <label className="text-[0.6rem] tracking-[0.2em] uppercase text-[#6b6158] dark:text-[#a8a29e]">
                        Images
                      </label>
                      <div
                        className={`rounded-lg py-8 flex flex-col items-center justify-center gap-2 border border-dashed cursor-pointer transition-all ${
                          dragOver
                            ? "bg-[#C9A96E]/10 border-[#C9A96E]"
                            : "bg-[#f5f3f0] dark:bg-[#141210] border-[#d0c5b5] dark:border-[#292522] hover:border-[#C9A96E]"
                        }`}
                        onDragOver={(e) => {
                          e.preventDefault();
                          setDragOver(true);
                        }}
                        onDragLeave={() => setDragOver(false)}
                        onDrop={(e) => {
                          e.preventDefault();
                          setDragOver(false);
                          addFiles(e.dataTransfer.files);
                        }}
                        onClick={() =>
                          document.getElementById("variant-img-input").click()
                        }
                      >
                        <svg
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="w-6 h-6 mb-1 text-[#C9A96E]"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M12 16.5V9.75m0 0 3 3m-3-3-3 3M6.75 19.5a4.5 4.5 0 0 1-1.41-8.775 5.25 5.25 0 0 1 10.338-2.32 5.75 5.75 0 0 1 1.026 11.095"
                          />
                        </svg>
                        <p className="text-[0.65rem] tracking-[0.15em] uppercase m-0 text-[#0d0d0b] dark:text-[#fbf9f6]">
                          {newVariant.images.length > 0
                            ? `${newVariant.images.length} file${newVariant.images.length > 1 ? "s" : ""} selected`
                            : "Drop images or click to upload"}
                        </p>
                        <p className="text-[0.55rem] tracking-wider m-0 text-[#6b6158] dark:text-[#a8a29e]">
                          PNG · JPG · WEBP
                        </p>
                        <input
                          id="variant-img-input"
                          type="file"
                          multiple
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => addFiles(e.target.files)}
                        />
                      </div>

                      {previewUrls.length > 0 && (
                        <div className="grid grid-cols-6 gap-2 mt-2">
                          {previewUrls.map((url, i) => (
                            <div
                              key={i}
                              className="relative group aspect-square rounded overflow-hidden"
                            >
                              <img
                                src={url}
                                alt={`Preview ${i + 1}`}
                                className="w-full h-full object-cover"
                              />
                              <button
                                type="button"
                                onClick={() => removeImage(i)}
                                className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/60 border-none cursor-pointer"
                              >
                                <svg
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  strokeWidth={2.5}
                                  stroke="white"
                                  className="w-3.5 h-3.5"
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
                        </div>
                      )}
                    </div>

                    {/* Price + Currency + Stock */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[0.6rem] tracking-[0.2em] uppercase text-[#6b6158] dark:text-[#a8a29e]">
                          Price
                        </label>
                        <input
                          type="number"
                          min="0"
                          placeholder={product?.price?.amount ?? "0"}
                          value={newVariant.price.amount}
                          onChange={(e) =>
                            setNewVariant((v) => ({
                              ...v,
                              price: { ...v.price, amount: e.target.value },
                            }))
                          }
                          className="bg-transparent border-b border-[#d0c5b5] dark:border-[#38332e] py-2 text-sm text-[#0d0d0b] dark:text-[#fbf9f6] outline-none focus:border-[#C9A96E]"
                        />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[0.6rem] tracking-[0.2em] uppercase text-[#6b6158] dark:text-[#a8a29e]">
                          Currency
                        </label>
                        <select
                          value={newVariant.price.currency}
                          onChange={(e) =>
                            setNewVariant((v) => ({
                              ...v,
                              price: { ...v.price, currency: e.target.value },
                            }))
                          }
                          className="bg-transparent border-b border-[#d0c5b5] dark:border-[#38332e] py-2 text-sm text-[#0d0d0b] dark:text-[#fbf9f6] outline-none focus:border-[#C9A96E]"
                        >
                          {["INR", "USD", "EUR", "GBP", "JPY"].map((c) => (
                            <option
                              key={c}
                              value={c}
                              className="bg-[#fbf9f6] dark:bg-[#141210]"
                            >
                              {c}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[0.6rem] tracking-[0.2em] uppercase text-[#6b6158] dark:text-[#a8a29e]">
                          Stock
                        </label>
                        <input
                          type="number"
                          required
                          min="0"
                          placeholder="0"
                          value={newVariant.stock}
                          onChange={(e) =>
                            setNewVariant((v) => ({
                              ...v,
                              stock: e.target.value,
                            }))
                          }
                          className="bg-transparent border-b border-[#d0c5b5] dark:border-[#38332e] py-2 text-sm text-[#0d0d0b] dark:text-[#fbf9f6] outline-none focus:border-[#C9A96E]"
                        />
                      </div>
                    </div>

                    {/* Attributes */}
                    <div className="flex flex-col gap-3">
                      <div className="flex items-center justify-between">
                        <label className="text-[0.6rem] tracking-[0.2em] uppercase text-[#6b6158] dark:text-[#a8a29e]">
                          Attributes
                        </label>
                        <button
                          type="button"
                          onClick={addAttribute}
                          className="text-[0.6rem] tracking-[0.18em] uppercase bg-transparent border-none cursor-pointer underline underline-offset-4 text-[#C9A96E]"
                        >
                          + Add Attribute
                        </button>
                      </div>
                      {newVariant.attributes.map((attr) => (
                        <div key={attr.id} className="flex items-center gap-3">
                          <input
                            type="text"
                            required
                            placeholder="e.g. Size"
                            value={attr.key}
                            onChange={(e) =>
                              changeAttribute(attr.id, "key", e.target.value)
                            }
                            className="bg-transparent border-b border-[#d0c5b5] dark:border-[#38332e] py-2 text-sm text-[#0d0d0b] dark:text-[#fbf9f6] outline-none focus:border-[#C9A96E] flex-1"
                          />
                          <span className="text-sm text-[#a8a29e]">:</span>
                          <input
                            type="text"
                            required
                            placeholder="e.g. XL"
                            value={attr.value}
                            onChange={(e) =>
                              changeAttribute(attr.id, "value", e.target.value)
                            }
                            className="bg-transparent border-b border-[#d0c5b5] dark:border-[#38332e] py-2 text-sm text-[#0d0d0b] dark:text-[#fbf9f6] outline-none focus:border-[#C9A96E] flex-1"
                          />
                          <button
                            type="button"
                            onClick={() => removeAttribute(attr.id)}
                            disabled={newVariant.attributes.length === 1}
                            className="w-6 h-6 flex items-center justify-center bg-transparent border-none cursor-pointer text-[#6b6158] dark:text-[#a8a29e] hover:text-red-500 disabled:opacity-30"
                          >
                            <svg
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth={2}
                              stroke="currentColor"
                              className="w-4 h-4"
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
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3 pt-4 border-t border-[#e4e2df] dark:border-[#292522]">
                      <button
                        type="button"
                        onClick={resetForm}
                        className="flex-1 py-3 text-[0.6rem] tracking-[0.22em] uppercase font-semibold rounded-full border border-[#d5cfc8] dark:border-[#38332e] bg-transparent text-[#3d342c] dark:text-[#d6d3d1] hover:border-[#0d0d0b] dark:hover:border-white hover:text-[#0d0d0b] dark:hover:text-white transition-all cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={isCreating}
                        className="flex-1 py-3 text-[0.6rem] tracking-[0.22em] uppercase font-semibold rounded-full bg-[#0d0d0b] dark:bg-[#fbf9f6] text-[#fbf9f6] dark:text-[#0d0d0b] hover:bg-[#C9A96E] hover:text-[#0d0d0b] dark:hover:bg-[#C9A96E] dark:hover:text-[#0d0d0b] transition-all border-none cursor-pointer disabled:opacity-50"
                      >
                        {isCreating ? "Saving…" : "Save Variant"}
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* ── Variants list / empty state ───────────────── */}
              <div className="p-6">
                {(!product.variants || product.variants.length === 0) &&
                  !showForm && (
                    <div className="py-16 flex flex-col items-center justify-center border border-dashed border-[#d0c5b5] dark:border-[#292522] rounded-lg">
                      <svg
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1}
                        stroke="currentColor"
                        className="w-10 h-10 mb-4 text-[#C9A96E]"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M9.568 3H5.25A2.25 2.25 0 0 0 3 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 0 0 5.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 0 0 9.568 3ZM6 6h.008v.008H6V6Z"
                        />
                      </svg>
                      <p className="text-xs tracking-[0.2em] uppercase mb-4 text-[#6b6158] dark:text-[#a8a29e]">
                        No variants yet
                      </p>
                      <button
                        onClick={() => setShowForm(true)}
                        className="text-xs tracking-wider uppercase text-[#0d0d0b] dark:text-[#fbf9f6] hover:text-[#C9A96E] dark:hover:text-[#C9A96E] underline underline-offset-4 bg-transparent border-none cursor-pointer"
                      >
                        Create first variant →
                      </button>
                    </div>
                  )}

                {product.variants && product.variants.length > 0 && (
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                    {product.variants.map((variant, idx) => (
                      <VariantCard key={variant._id || idx} variant={variant} />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </main>
        </div>

        <LuxurisenFooter />
      </div>
    </>
  );
};

/* ── VariantCard ──────────────────────────────────────────────── */
const VariantCard = ({ variant }) => {
  const [activeImg, setActiveImg] = useState(0);
  const images = variant.images ?? [];

  return (
    <div className="rounded-lg flex flex-col overflow-hidden bg-[#f5f3f0] dark:bg-[#1a1715] border border-[#e4e2df] dark:border-[#292522] transition-all hover:border-[#C9A96E] dark:hover:border-[#C9A96E]">
      {/* Image */}
      <div className="relative aspect-[4/3] bg-[#e4e2df] dark:bg-[#141210] overflow-hidden">
        {images.length > 0 ? (
          <img
            src={images[activeImg]?.url}
            alt="Variant"
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-[#a8a29e]">
            <svg
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1}
              stroke="currentColor"
              className="w-8 h-8"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Z"
              />
            </svg>
          </div>
        )}
        {images.length > 1 && (
          <span className="absolute top-2 right-2 text-[0.5rem] tracking-[0.1em] uppercase px-2 py-0.5 bg-black/60 text-white rounded">
            {activeImg + 1}/{images.length}
          </span>
        )}
        {images.length > 1 && (
          <div className="absolute bottom-0 left-0 right-0 flex gap-1 px-3 pb-2 pt-4 bg-gradient-to-t from-black/50 to-transparent">
            {images.map((_, i) => (
              <button
                key={i}
                onMouseEnter={() => setActiveImg(i)}
                onClick={() => setActiveImg(i)}
                className={`flex-1 h-0.5 border-none cursor-pointer transition-colors ${
                  i === activeImg ? "bg-[#C9A96E]" : "bg-white/40"
                }`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Body */}
      <div className="p-4 flex flex-col gap-3 flex-1">
        <div className="flex items-center justify-between">
          <span className="text-base font-semibold text-[#C9A96E]">
            {fmt(variant.price?.amount, variant.price?.currency)}
          </span>
          <span
            className={`text-[0.5rem] tracking-[0.15em] uppercase px-2 py-0.5 rounded font-medium ${
              variant.stock === 0
                ? "bg-red-500/10 text-red-600 dark:text-red-400"
                : "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
            }`}
          >
            {variant.stock === 0 ? "Out of stock" : `${variant.stock} in stock`}
          </span>
        </div>

        {variant.attributes && Object.keys(variant.attributes).length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {Object.entries(variant.attributes).map(([key, val]) => (
              <span
                key={key}
                className="text-[0.55rem] tracking-[0.1em] uppercase px-2 py-1 rounded bg-[#e4e2df] dark:bg-[#201c19] text-[#3d342c] dark:text-[#d6d3d1] font-medium"
              >
                {key}: {val}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SellerProductDetails;