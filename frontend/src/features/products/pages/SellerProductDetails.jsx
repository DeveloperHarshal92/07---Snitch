import React, { useState, useEffect } from "react";
import { useProduct } from "../hooks/useProduct";
import { useParams, useNavigate } from "react-router";

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
    currency,
    maximumFractionDigits: 0,
  }).format(amount);

/* ── Design tokens ────────────────────────────────────────────── */
const T = {
  bg: "#fbf9f6",
  surface: "#f5f3f0",
  border: "#e4e2df",
  borderMd: "#d0c5b5",
  text: "#0d0d0b",
  muted: "#3d342c",
  subtle: "#6b6158",
  gold: "#C9A96E",
  serif: "'Cormorant Garamond', serif",
  sans: "'Inter', sans-serif",
};

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
    attributes: { "": "" },
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
    setNewVariant((v) => ({ ...v, attributes: { ...v.attributes, "": "" } }));

  const removeAttribute = (key) =>
    setNewVariant((v) => {
      const next = { ...v.attributes };
      delete next[key];
      return { ...v, attributes: next };
    });

  const changeAttribute = (oldKey, field, val) => {
    setNewVariant((v) => {
      const entries = Object.entries(v.attributes);
      const idx = entries.findIndex(([k]) => k === oldKey);
      if (idx === -1) return v;
      if (field === "key") {
        entries[idx] = [val, entries[idx][1]];
      } else {
        entries[idx] = [entries[idx][0], val];
      }
      return { ...v, attributes: Object.fromEntries(entries) };
    });
  };

  /* ── Reset form ────────────────────────────────────────────── */
  const resetForm = () => {
    setNewVariant({
      images: [],
      stock: "",
      price: { amount: "", currency: "INR" },
      attributes: { "": "" },
    });
    setPreviewUrls([]);
    setShowForm(false);
  };

  /* ── Submit variant ────────────────────────────────────────── */
  const submitVariant = async (e) => {
    e.preventDefault();
    if (!newVariant.images || newVariant.images.length === 0) {
      alert("Please upload at least one image.");
      return;
    }
    setIsCreating(true);

    const attrMap = Object.fromEntries(
      Object.entries(newVariant.attributes).filter(
        ([k, v]) => k.trim() && v.trim(),
      ),
    );

    const priceAmount =
      newVariant.price.amount !== ""
        ? Number(newVariant.price.amount)
        : Number(product?.price?.amount ?? 0);

    try {
      // Pass a formatted object matching the expected structure in product.api.js
      const formattedVariant = {
        images: newVariant.images.map((file) => ({ file })),
        stock: Number(newVariant.stock),
        price: {
          amount: priceAmount,
          currency: newVariant.price.currency,
        },
        attributes: attrMap,
      };

      await handleAddProductVariant(productId, formattedVariant);
      await fetchProduct();
      resetForm();
    } catch (err) {
      console.error(err);
    } finally {
      setIsCreating(false);
    }
  };



  /* ── Loading ───────────────────────────────────────────────── */
  if (isLoading) {
    return (
      <>
        <FontLink />
        <div
          className="min-h-screen flex items-center justify-center"
          style={{ backgroundColor: T.bg, fontFamily: T.sans }}
        >
          <div className="flex flex-col items-center gap-4">
            <div
              className="w-8 h-8 rounded-full border-2 animate-spin"
              style={{ borderColor: T.gold, borderTopColor: "transparent" }}
            />
            <span
              className="text-[0.6rem] tracking-[0.28em] uppercase"
              style={{ color: T.subtle }}
            >
              Loading
            </span>
          </div>
        </div>
      </>
    );
  }

  if (!product) return null;

  const totalStock =
    product.variants?.reduce((s, v) => s + (v.stock ?? 0), 0) ?? 0;

  /* ── Main render ───────────────────────────────────────────── */
  return (
    <>
      <FontLink />
      <style>{`
        .input-line {
          width: 100%;
          background: transparent;
          border: none;
          border-bottom: 1px solid ${T.borderMd};
          padding: 0.5rem 0.25rem 0.75rem;
          font-size: 0.875rem;
          color: ${T.text};
          outline: none;
          font-family: ${T.sans};
          transition: border-color 0.2s;
        }
        .input-line:focus { border-bottom-color: ${T.gold}; }
        .input-line::placeholder { color: ${T.subtle}; opacity: 0.65; }
        .select-line {
          width: 100%;
          background: transparent;
          border: none;
          border-bottom: 1px solid ${T.borderMd};
          padding: 0.5rem 0.25rem 0.75rem;
          font-size: 0.875rem;
          color: ${T.text};
          outline: none;
          font-family: ${T.sans};
          cursor: pointer;
          appearance: none;
          transition: border-color 0.2s;
        }
        .select-line:focus { border-bottom-color: ${T.gold}; }
        .btn-gold {
          background: ${T.text};
          color: ${T.bg};
          transition: background 0.3s, color 0.3s;
        }
        .btn-gold:hover:not(:disabled) { background: ${T.gold}; color: ${T.text}; }
        .btn-outline {
          background: transparent;
          color: ${T.text};
          border: 1px solid ${T.borderMd};
          transition: background 0.3s, color 0.3s, border-color 0.3s;
        }
        .btn-outline:hover { background: ${T.text}; color: ${T.bg}; border-color: ${T.text}; }
        .drop-zone {
          border: 1.5px dashed ${T.borderMd};
          background: ${T.bg};
          transition: border-color 0.2s, background 0.2s;
          cursor: pointer;
        }
        .drop-zone.drag-active {
          border-color: ${T.gold};
          background: rgba(201,169,110,0.06);
        }
        .variant-card {
          border: 1px solid ${T.border};
          background: #fff;
          transition: border-color 0.2s, box-shadow 0.2s;
        }
        .variant-card:hover {
          border-color: ${T.borderMd};
          box-shadow: 0 4px 24px rgba(27,24,20,0.06);
        }
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .slide-down { animation: slideDown 0.28s ease forwards; }
        ::selection { background: rgba(201,169,110,0.25); }
        /* Hide number input spinners — Chrome, Safari, Edge, Opera */
        input[type=number]::-webkit-inner-spin-button,
        input[type=number]::-webkit-outer-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }
        /* Hide number input spinners — Firefox */
        input[type=number] {
          -moz-appearance: textfield;
          appearance: textfield;
        }
      `}</style>

      <div
        className="min-h-screen"
        style={{ backgroundColor: T.bg, fontFamily: T.sans, color: T.text }}
      >
        {/* ── Navbar ─────────────────────────────────────────── */}
        <header
          className="sticky top-0 z-40 border-b flex items-center justify-between px-8 lg:px-16 h-[64px]"
          style={{ backgroundColor: T.bg, borderColor: T.border }}
        >
          <span
            className="text-sm tracking-[0.35em] uppercase select-none cursor-pointer"
            style={{ fontFamily: T.serif, color: T.gold }}
            onClick={() => navigate("/")}
          >
            Snitch
          </span>
          <span
            className="text-[0.6rem] tracking-[0.25em] uppercase"
            style={{ color: T.subtle }}
          >
            Seller Portal
          </span>
        </header>

        {/* ── Breadcrumb ─────────────────────────────────────── */}
        <div
          className="max-w-[1200px] mx-auto px-8 lg:px-16 pt-8 pb-2 flex items-center gap-2"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(8px)",
            transition: "opacity 0.5s ease, transform 0.5s ease",
          }}
        >
          <button
            onClick={() => navigate("/seller/dashboard")}
            className="text-[0.6rem] tracking-[0.2em] uppercase bg-transparent border-none cursor-pointer"
            style={{ color: T.subtle }}
            onMouseEnter={(e) => (e.target.style.color = T.gold)}
            onMouseLeave={(e) => (e.target.style.color = T.subtle)}
          >
            Dashboard
          </button>
          <span style={{ color: T.borderMd }} className="text-[0.6rem]">
            /
          </span>
          <span
            className="text-[0.6rem] tracking-[0.2em] uppercase"
            style={{ color: T.muted }}
          >
            {product.title}
          </span>
        </div>

        {/* ── Main ───────────────────────────────────────────── */}
        <main
          className="max-w-[1200px] mx-auto px-8 lg:px-16 py-8 pb-28"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(16px)",
            transition: "opacity 0.6s ease 0.08s, transform 0.6s ease 0.08s",
          }}
        >
          {/* ── Product summary ──────────────────────────────── */}
          <div
            className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-10 pb-10 border-b"
            style={{ borderColor: T.border }}
          >
            {/* Thumbnail */}
            <div className="lg:col-span-2">
              <div
                className="aspect-[3/4] rounded-sm overflow-hidden"
                style={{ backgroundColor: T.surface }}
              >
                {product.images?.[0] ? (
                  <img
                    src={product.images[0].url}
                    alt={product.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <svg
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1}
                      stroke={T.borderMd}
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
              </div>
            </div>

            {/* Info */}
            <div className="lg:col-span-7 flex flex-col justify-center gap-3">
              <p
                className="text-[0.55rem] tracking-[0.28em] uppercase m-0"
                style={{ color: T.gold }}
              >
                Product Settings
              </p>
              <h1
                className="m-0 font-light leading-[1.1] text-[clamp(1.6rem,3vw,2.4rem)]"
                style={{ fontFamily: T.serif }}
              >
                {product.title}
              </h1>
              <p
                className="m-0 text-xs leading-relaxed font-light line-clamp-2"
                style={{ color: T.muted }}
              >
                {product.description}
              </p>
              <div className="flex items-center gap-4 mt-1">
                <span
                  className="text-base font-medium"
                  style={{ color: T.gold }}
                >
                  {fmt(product.price?.amount, product.price?.currency)}
                </span>
                <span
                  className="text-[0.55rem] tracking-[0.15em] uppercase px-2.5 py-1 rounded-sm"
                  style={{ backgroundColor: T.surface, color: T.muted }}
                >
                  Base price
                </span>
              </div>
            </div>

            {/* Stats */}
            <div
              className="lg:col-span-3 grid grid-cols-3 lg:grid-cols-1 gap-4 lg:gap-0 lg:border-l lg:pl-6"
              style={{ borderColor: T.border }}
            >
              {[
                { label: "Variants", value: product.variants?.length ?? 0 },
                { label: "Total Stock", value: totalStock },
                { label: "Images", value: product.images?.length ?? 0 },
              ].map(({ label, value }) => (
                <div
                  key={label}
                  className="flex flex-col gap-1 py-3 lg:border-b last:border-b-0"
                  style={{ borderColor: T.border }}
                >
                  <span
                    className="text-[0.55rem] tracking-[0.2em] uppercase"
                    style={{ color: T.subtle }}
                  >
                    {label}
                  </span>
                  <span
                    className="text-2xl font-light"
                    style={{ fontFamily: T.serif }}
                  >
                    {value}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* ── Variants box ─────────────────────────────────── */}
          <div className="border rounded-sm" style={{ borderColor: T.border }}>
            {/* Box header */}
            <div
              className="flex items-center justify-between px-6 py-5 border-b"
              style={{ borderColor: T.border }}
            >
              <div>
                <p
                  className="text-[0.55rem] tracking-[0.28em] uppercase mb-0.5 m-0"
                  style={{ color: T.gold }}
                >
                  Inventory
                </p>
                <h2
                  className="m-0 font-light"
                  style={{
                    fontFamily: T.serif,
                    fontSize: "clamp(1.2rem, 2vw, 1.6rem)",
                  }}
                >
                  Variants ({product.variants?.length ?? 0})
                </h2>
              </div>

              {!showForm && (
                <button
                  onClick={() => setShowForm(true)}
                  className="btn-gold flex items-center gap-2 px-5 py-2.5 text-[0.6rem] tracking-[0.22em] uppercase font-medium cursor-pointer border-none rounded-sm"
                  style={{ fontFamily: T.sans }}
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

            {/* ── Inline form (appears below header) ───────── */}
            {showForm && (
              <div
                className="slide-down border-b px-6 py-8"
                style={{ borderColor: T.border, backgroundColor: "#fdfcfa" }}
              >
                {/* Form title row */}
                <div className="flex items-center justify-between mb-7">
                  <div>
                    <p
                      className="text-[0.55rem] tracking-[0.28em] uppercase mb-0.5 m-0"
                      style={{ color: T.gold }}
                    >
                      New
                    </p>
                    <h3
                      className="m-0 font-light text-xl"
                      style={{ fontFamily: T.serif }}
                    >
                      Add Variant
                    </h3>
                  </div>
                  <button
                    type="button"
                    onClick={resetForm}
                    className="w-8 h-8 flex items-center justify-center rounded-full bg-transparent border-none cursor-pointer transition-colors"
                    style={{ color: T.muted }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.backgroundColor = T.surface)
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.backgroundColor = "transparent")
                    }
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

                <form onSubmit={submitVariant} className="flex flex-col gap-7">
                  {/* Images */}
                  <div className="flex flex-col gap-3">
                    <label
                      className="text-[0.6rem] tracking-[0.2em] uppercase"
                      style={{ color: T.subtle }}
                    >
                      Images
                    </label>
                    <div
                      className={`drop-zone ${dragOver ? "drag-active" : ""} rounded-sm py-7 flex flex-col items-center justify-center gap-2`}
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
                        stroke={dragOver ? T.gold : T.subtle}
                        className="w-6 h-6 mb-1 transition-colors"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M12 16.5V9.75m0 0 3 3m-3-3-3 3M6.75 19.5a4.5 4.5 0 0 1-1.41-8.775 5.25 5.25 0 0 1 10.338-2.32 5.75 5.75 0 0 1 1.026 11.095"
                        />
                      </svg>
                      <p
                        className="text-[0.65rem] tracking-[0.15em] uppercase m-0"
                        style={{ color: T.muted }}
                      >
                        {newVariant.images.length > 0
                          ? `${newVariant.images.length} file${newVariant.images.length > 1 ? "s" : ""} selected`
                          : "Drop images or click to upload"}
                      </p>
                      <p
                        className="text-[0.55rem] tracking-wider m-0"
                        style={{ color: T.subtle }}
                      >
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
                      <div className="grid grid-cols-6 gap-2">
                        {previewUrls.map((url, i) => (
                          <div key={i} className="relative group aspect-square">
                            <img
                              src={url}
                              alt={`Preview ${i + 1}`}
                              className="w-full h-full object-cover rounded-sm aspect-video"
                            />
                            <button
                              type="button"
                              onClick={() => removeImage(i)}
                              className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-sm border-none cursor-pointer"
                              style={{ backgroundColor: "rgba(13,13,11,0.5)" }}
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
                  <div className="grid grid-cols-3 gap-8">
                    <div className="flex flex-col gap-2">
                      <label
                        className="text-[0.6rem] tracking-[0.2em] uppercase"
                        style={{ color: T.subtle }}
                      >
                        Price
                        {product?.price?.amount && (
                          <span
                            className="ml-2 normal-case tracking-normal"
                            style={{ color: T.borderMd }}
                          >
                            (defaults to{" "}
                            {fmt(product.price.amount, product.price.currency)})
                          </span>
                        )}
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
                        className="input-line"
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label
                        className="text-[0.6rem] tracking-[0.2em] uppercase"
                        style={{ color: T.subtle }}
                      >
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
                        className="select-line"
                      >
                        {["INR", "USD", "EUR", "GBP", "JPY"].map((c) => (
                          <option
                            key={c}
                            value={c}
                            style={{ backgroundColor: T.bg }}
                          >
                            {c}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="flex flex-col gap-2">
                      <label
                        className="text-[0.6rem] tracking-[0.2em] uppercase"
                        style={{ color: T.subtle }}
                      >
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
                        className="input-line"
                      />
                    </div>
                  </div>

                  {/* Attributes */}
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center justify-between">
                      <label
                        className="text-[0.6rem] tracking-[0.2em] uppercase"
                        style={{ color: T.subtle }}
                      >
                        Attributes
                      </label>
                      <button
                        type="button"
                        onClick={addAttribute}
                        className="text-[0.6rem] tracking-[0.18em] uppercase bg-transparent border-none cursor-pointer underline underline-offset-2"
                        style={{ color: T.gold }}
                      >
                        + Add
                      </button>
                    </div>
                    {Object.entries(newVariant.attributes).map(
                      ([key, value], idx) => (
                        <div key={idx} className="flex items-center gap-3">
                          <input
                            type="text"
                            required
                            placeholder="e.g. Size"
                            value={key}
                            onChange={(e) =>
                              changeAttribute(key, "key", e.target.value)
                            }
                            className="input-line flex-1"
                          />
                          <span
                            style={{ color: T.borderMd }}
                            className="text-sm flex-shrink-0"
                          >
                            :
                          </span>
                          <input
                            type="text"
                            required
                            placeholder="e.g. XL"
                            value={value}
                            onChange={(e) =>
                              changeAttribute(key, "value", e.target.value)
                            }
                            className="input-line flex-1"
                          />
                          <button
                            type="button"
                            onClick={() => removeAttribute(key)}
                            disabled={
                              Object.keys(newVariant.attributes).length === 1
                            }
                            className="flex-shrink-0 w-6 h-6 flex items-center justify-center bg-transparent border-none cursor-pointer"
                            style={{
                              color: T.muted,
                              opacity:
                                Object.keys(newVariant.attributes).length === 1
                                  ? 0.25
                                  : 1,
                            }}
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
                      ),
                    )}
                  </div>

                  {/* Actions */}
                  <div
                    className="flex gap-3 pt-4 border-t"
                    style={{ borderColor: T.border }}
                  >
                    <button
                      type="button"
                      onClick={resetForm}
                      className="btn-outline flex-1 py-3 text-[0.6rem] tracking-[0.22em] uppercase font-medium rounded-sm cursor-pointer"
                      style={{ fontFamily: T.sans }}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isCreating}
                      className="btn-gold flex-1 py-3 text-[0.6rem] tracking-[0.22em] uppercase font-medium rounded-sm border-none"
                      style={{
                        fontFamily: T.sans,
                        opacity: isCreating ? 0.65 : 1,
                        cursor: isCreating ? "not-allowed" : "pointer",
                      }}
                    >
                      {isCreating ? "Saving…" : "Save Variant"}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* ── Variants list / empty state ───────────────── */}
            <div className="p-6">
              {/* Empty state */}
              {(!product.variants || product.variants.length === 0) &&
                !showForm && (
                  <div
                    className="py-16 flex flex-col items-center justify-center border border-dashed rounded-sm"
                    style={{ borderColor: T.borderMd }}
                  >
                    <svg
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1}
                      stroke={T.borderMd}
                      className="w-9 h-9 mb-4"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M9.568 3H5.25A2.25 2.25 0 0 0 3 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 0 0 5.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 0 0 9.568 3ZM6 6h.008v.008H6V6Z"
                      />
                    </svg>
                    <p
                      className="text-[0.65rem] tracking-[0.2em] uppercase mb-4"
                      style={{ color: T.subtle }}
                    >
                      No variants yet
                    </p>
                    <button
                      onClick={() => setShowForm(true)}
                      className="text-[0.65rem] tracking-[0.18em] uppercase underline underline-offset-4 bg-transparent border-none cursor-pointer"
                      style={{ color: T.gold }}
                    >
                      Create first variant →
                    </button>
                  </div>
                )}

              {/* Variant cards */}
              {product.variants && product.variants.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                  {product.variants.map((variant, idx) => (
                    <VariantCard
                      key={variant._id || idx}
                      variant={variant}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

/* ── VariantCard ──────────────────────────────────────────────── */
const VariantCard = ({ variant }) => {
  const [activeImg, setActiveImg] = useState(0);
  const images = variant.images ?? [];

  return (
    <div className="variant-card rounded-sm flex flex-col overflow-hidden">
      {/* Image */}
      <div
        className="relative"
        style={{ backgroundColor: "#f0ede9", height: "180px" }}
      >
        {images.length > 0 ? (
          <img
            src={images[activeImg]?.url}
            alt="Variant"
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <svg
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1}
              stroke="#d0c5b5"
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
          <span
            className="absolute top-2 right-2 text-[0.5rem] tracking-[0.1em] uppercase px-2 py-0.5"
            style={{
              backgroundColor: "rgba(251,249,246,0.88)",
              color: "#3d342c",
            }}
          >
            {activeImg + 1}/{images.length}
          </span>
        )}
        {images.length > 1 && (
          <div
            className="absolute bottom-0 left-0 right-0 flex gap-1 px-3 pb-2.5 pt-4"
            style={{
              background:
                "linear-gradient(to top, rgba(27,24,20,0.35) 0%, transparent 100%)",
            }}
          >
            {images.map((_, i) => (
              <button
                key={i}
                onMouseEnter={() => setActiveImg(i)}
                onClick={() => setActiveImg(i)}
                className="flex-1 h-0.5 border-none cursor-pointer transition-colors duration-200"
                style={{
                  backgroundColor:
                    i === activeImg ? "#C9A96E" : "rgba(255,255,255,0.45)",
                }}
              />
            ))}
          </div>
        )}
      </div>

      {/* Body */}
      <div className="p-4 flex flex-col gap-3 flex-1">
        <div className="flex items-center justify-between">
          <span
            className="text-base font-medium"
            style={{
              color: "#C9A96E",
              fontFamily: "'Cormorant Garamond', serif",
            }}
          >
            {fmt(variant.price?.amount, variant.price?.currency)}
          </span>
          <span
            className="text-[0.5rem] tracking-[0.15em] uppercase px-2 py-1 rounded-sm"
            style={{
              backgroundColor: variant.stock === 0 ? "#fdf2f2" : "#f0ede9",
              color: variant.stock === 0 ? "#c0392b" : "#3d342c",
            }}
          >
            {variant.stock === 0 ? "Out of stock" : `${variant.stock} in stock`}
          </span>
        </div>

        {variant.attributes && Object.keys(variant.attributes).length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {Object.entries(variant.attributes).map(([key, val]) => (
              <span
                key={key}
                className="text-[0.5rem] tracking-[0.1em] uppercase px-2 py-1 rounded-sm"
                style={{ backgroundColor: "#f5f3f0", color: "#3d342c" }}
              >
                {key}: {val}
                
              </span>
            ))}
          </div>
        )}

        <div className="border-t" style={{ borderColor: "#e4e2df" }} />
      </div>
    </div>
  );
};

export default SellerProductDetails;