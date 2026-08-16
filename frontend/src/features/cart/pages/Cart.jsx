import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useCart } from "../hooks/useCart";
import { removeFromCart, setCart } from "../state/cart.slice";
import { useNavigate } from "react-router";
import { useRazorpay } from "react-razorpay";

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

/* ── CartItemRow ──────────────────────────────────────────────── */
const CartItemRow = ({ item, idx, onRemove, removing, onQtyChange }) => {
  const [visible, setVisible] = useState(false);
  const [hovered, setHovered] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), idx * 90 + 100);
    return () => clearTimeout(t);
  }, [idx]);

  const product = item.product ?? {};
  const price = item.price ?? product.price ?? { amount: 0, currency: "INR" };
  const quantity = item.quantity ?? 1;

  const thumb = product.images?.[0]?.url ?? null;

  const matchedVariant = item.variant
    ? ((Array.isArray(product.variants)
        ? product.variants
        : product.variants
          ? [product.variants]
          : []
      ).find((v) => v._id === item.variant) ?? null)
    : null;

  const variantAttrs = matchedVariant?.attributes
    ? Object.entries(matchedVariant.attributes)
        .map(([k, v]) => `${k.replace(/_\d+$/, "")}: ${v}`)
        .join(" · ")
    : item.variant
      ? "Variant Selected"
      : null;

  const stock =
    matchedVariant != null ? (matchedVariant.stock ?? 0) : (product.stock ?? 0);
  const isOutOfStock = stock === 0;

  const cartPrice = price.amount;
  const currentPrice =
    (matchedVariant?.price?.amount != null
      ? matchedVariant.price.amount
      : product.price?.amount) ?? cartPrice;

  const priceDiff = cartPrice - currentPrice;
  const hasPriceChanged = Math.abs(priceDiff) > 0;
  const isPriceDrop = priceDiff > 0;
  const isPriceHike = priceDiff < 0;
  const discountPct = isPriceDrop
    ? Math.round((priceDiff / cartPrice) * 100)
    : 0;
  const hikePct = isPriceHike
    ? Math.round((Math.abs(priceDiff) / cartPrice) * 100)
    : 0;

  const effectiveUnitPrice = currentPrice;
  const lineTotal = effectiveUnitPrice * quantity;

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={`border-b border-[#e4e2df] dark:border-[#292522] py-7 flex gap-5 items-start transition-all duration-500 ${
        removing
          ? "opacity-0 -translate-x-5 pointer-events-none"
          : visible
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-4"
      }`}
    >
      {/* Product image */}
      <div
        onClick={() => navigate(`/product/${product._id}`)}
        className="w-24 h-28 flex-shrink-0 bg-[#f0ede9] dark:bg-[#1f1c19] rounded-sm overflow-hidden cursor-pointer relative"
      >
        {thumb ? (
          <img
            src={thumb}
            alt={product.title}
            className={`w-full h-full object-cover transition-transform duration-500 ${
              hovered ? "scale-105" : "scale-100"
            }`}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-[#a8a29e]">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1}
              stroke="currentColor"
              className="w-7 h-7"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
              />
            </svg>
          </div>
        )}

        {/* Out of stock overlay */}
        {isOutOfStock && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
            <span className="text-[0.5rem] tracking-[0.15em] uppercase text-red-400 font-medium bg-black/80 px-2 py-1 rounded">
              Out of Stock
            </span>
          </div>
        )}
      </div>

      {/* Product details */}
      <div className="flex-1 min-w-0 flex flex-col gap-1.5">
        {/* Title */}
        <h3
          onClick={() => navigate(`/product/${product._id}`)}
          className="m-0 text-base md:text-lg font-light text-[#0d0d0b] dark:text-[#fbf9f6] hover:text-[#C9A96E] dark:hover:text-[#C9A96E] cursor-pointer transition-colors leading-snug truncate"
          style={{ fontFamily: "'Cormorant Garamond', serif" }}
        >
          {product.title ?? "—"}
        </h3>

        {/* Variant */}
        {variantAttrs && (
          <p className="m-0 text-[0.6rem] tracking-[0.15em] uppercase text-[#6b6158] dark:text-[#a8a29e]">
            {variantAttrs}
          </p>
        )}

        {/* Stock badge */}
        <div className="flex items-center gap-2 mt-0.5">
          <span
            className={`text-[0.55rem] tracking-[0.15em] uppercase font-medium ${
              isOutOfStock ? "text-red-500" : "text-emerald-600 dark:text-emerald-400"
            }`}
          >
            {isOutOfStock ? "Out of stock" : `${stock} in stock`}
          </span>

          {/* Tags */}
          {["Authentic", "Easy Returns"].map((tag) => (
            <span
              key={tag}
              className="text-[0.5rem] tracking-[0.12em] uppercase px-1.5 py-0.5 rounded bg-[#f0ede9] dark:bg-[#1c1916] text-[#6b6158] dark:text-[#a8a29e] border border-transparent dark:border-[#292522]"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* ── Discount badge ── */}
        {isPriceDrop && (
          <div className="mt-1">
            <span className="inline-flex items-center gap-1 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[0.5rem] font-semibold tracking-wider uppercase px-2 py-0.5 rounded border border-emerald-500/20">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="w-2.5 h-2.5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 6h.008v.008H6V6z"
                />
              </svg>
              You save {discountPct}%
            </span>
          </div>
        )}

        {/* Qty row */}
        <div className="flex items-center gap-2.5 mt-2">
          <span className="text-[0.6rem] tracking-[0.18em] uppercase text-[#6b6158] dark:text-[#a8a29e]">
            Qty
          </span>

          {/* Stepper */}
          <div className="flex items-center border border-[#e4e2df] dark:border-[#292522] rounded overflow-hidden">
            {/* Decrease */}
            <button
              id={`qty-dec-${item._id}`}
              onClick={() =>
                onQtyChange(
                  { productId: product._id, variantId: item.variant },
                  quantity - 1,
                )
              }
              disabled={quantity <= 1}
              className={`w-7 h-7 flex items-center justify-center border-r border-[#e4e2df] dark:border-[#292522] text-sm cursor-pointer transition-colors ${
                quantity <= 1
                  ? "bg-[#f5f3f0] dark:bg-[#161412] text-[#a8a29e] cursor-not-allowed"
                  : "bg-[#fbf9f6] dark:bg-[#1f1c19] text-[#0d0d0b] dark:text-[#fbf9f6] hover:bg-[#e4e2df] dark:hover:bg-[#292522]"
              }`}
            >
              −
            </button>

            {/* Count */}
            <span className="px-3 text-xs font-medium text-[#0d0d0b] dark:text-[#fbf9f6] bg-[#f5f3f0] dark:bg-[#161412] h-7 flex items-center justify-center min-w-[32px] select-none">
              {quantity}
            </span>

            {/* Increase */}
            <button
              id={`qty-inc-${item._id}`}
              onClick={() =>
                onQtyChange(
                  { productId: product._id, variantId: item.variant },
                  quantity + 1,
                )
              }
              disabled={stock > 0 && quantity >= stock}
              className={`w-7 h-7 flex items-center justify-center border-l border-[#e4e2df] dark:border-[#292522] text-sm cursor-pointer transition-colors ${
                stock > 0 && quantity >= stock
                  ? "bg-[#f5f3f0] dark:bg-[#161412] text-[#a8a29e] cursor-not-allowed"
                  : "bg-[#fbf9f6] dark:bg-[#1f1c19] text-[#0d0d0b] dark:text-[#fbf9f6] hover:bg-[#e4e2df] dark:hover:bg-[#292522]"
              }`}
            >
              +
            </button>
          </div>

          {/* Max stock hint */}
          {stock > 0 && stock <= 5 && (
            <span className="text-[0.55rem] tracking-wider text-amber-600 dark:text-amber-400">
              Only {stock} left
            </span>
          )}
        </div>
      </div>

      {/* Price + remove */}
      <div className="flex flex-col items-flex-end text-right gap-2 flex-shrink-0">
        {/* Price hike badge */}
        {isPriceHike && (
          <span className="inline-flex items-center gap-1 bg-red-500/10 text-red-500 text-[0.5rem] font-semibold tracking-wider uppercase px-2 py-0.5 rounded border border-red-500/20">
            Price up {hikePct}%
          </span>
        )}

        {/* Line total */}
        <span
          className={`text-base md:text-lg font-medium ${
            isPriceHike ? "text-red-500" : "text-[#C9A96E]"
          }`}
        >
          {fmt(lineTotal, price.currency)}
        </span>

        {/* Strikethrough original price if changed */}
        {hasPriceChanged && (
          <span className="text-[0.65rem] text-[#a89e94] line-through tracking-wider">
            {fmt(cartPrice * quantity, price.currency)}
          </span>
        )}

        {/* Remove button */}
        <button
          id={`cart-remove-${item._id}`}
          onClick={() =>
            onRemove({ productId: product._id, variantId: item.variant })
          }
          disabled={removing}
          className="bg-transparent border-none cursor-pointer flex items-center gap-1 text-[#6b6158] dark:text-[#a8a29e] hover:text-red-500 dark:hover:text-red-400 text-[0.55rem] tracking-[0.18em] uppercase transition-colors p-0"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-3.5 h-3.5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
            />
          </svg>
          Remove
        </button>
      </div>
    </div>
  );
};

/* ── OrderSummary ─────────────────────────────────────────────── */
const OrderSummary = ({ cart, visible }) => {
  const cartItems = cart?.items || [];
  const navigate = useNavigate();
  const { error, isLoading, Razorpay } = useRazorpay();
  const [couponCode, setCouponCode] = useState("");
  const [isCouponApplied, setIsCouponApplied] = useState(false);
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [couponError, setCouponError] = useState("");
  const [isValidatingCoupon, setIsValidatingCoupon] = useState(false);
  const { user } = useSelector((state) => state.auth);

  const {
    handleCreateCartOrder,
    handleVerifyCartOrder,
    handleValidateCoupon,
  } = useCart();

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return;
    const code = couponCode.trim().toUpperCase();
    setIsValidatingCoupon(true);
    setCouponError("");
    try {
      const res = await handleValidateCoupon(code);
      if (res.valid) {
        setIsCouponApplied(true);
        setCouponDiscount(res.discountAmount || 0);
        setCouponError("");
      } else {
        setIsCouponApplied(false);
        setCouponDiscount(0);
        setCouponError(res.message || "Invalid coupon code");
      }
    } catch (err) {
      setIsCouponApplied(false);
      setCouponDiscount(0);
      setCouponError(
        err?.response?.data?.message ||
          err.message ||
          "Failed to validate coupon"
      );
    } finally {
      setIsValidatingCoupon(false);
    }
  };

  const removeCoupon = () => {
    setCouponCode("");
    setIsCouponApplied(false);
    setCouponDiscount(0);
    setCouponError("");
  };

  const subtotal = cart?.totalPrice || 0;

  useEffect(() => {
    if (isCouponApplied && couponCode) {
      handleValidateCoupon(couponCode)
        .then((res) => {
          if (res.valid) {
            setCouponDiscount(res.discountAmount || 0);
            setCouponError("");
          } else {
            setIsCouponApplied(false);
            setCouponDiscount(0);
            setCouponError(
              res.message || "Coupon no longer valid for updated cart"
            );
          }
        })
        .catch(() => {
          setIsCouponApplied(false);
          setCouponDiscount(0);
        });
    }
  }, [subtotal]);

  const totalSavings = cartItems.reduce((acc, item) => {
    const product = item.product ?? {};
    const matchedVariant = item.variant
      ? ((Array.isArray(product.variants)
          ? product.variants
          : product.variants
            ? [product.variants]
            : []
        ).find((v) => v._id === item.variant) ?? null)
      : null;
    const cartPrice = item.price?.amount ?? 0;
    const livePrice =
      (matchedVariant?.price?.amount != null
        ? matchedVariant.price.amount
        : product.price?.amount) ?? cartPrice;
    const saving = (cartPrice - livePrice) * (item.quantity ?? 1);
    return acc + (saving > 0 ? saving : 0);
  }, 0);

  const hasSavings = totalSavings > 0;

  const currency =
    cartItems[0]?.price?.currency ??
    cartItems[0]?.product?.price?.currency ??
    "INR";

  const shippingThreshold = 999;
  const shippingFree = subtotal >= shippingThreshold;
  const shipping = shippingFree ? 0 : 99;

  const total = Math.max(0, subtotal + shipping - couponDiscount);
  const progressPct = Math.min((subtotal / shippingThreshold) * 100, 100);

  const handleCheckout = async () => {
    const codeToSend = isCouponApplied
      ? couponCode.trim().toUpperCase()
      : undefined;
    const response = await handleCreateCartOrder(codeToSend);

    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: response.order.amount,
      currency: response.order.currency,
      name: "LUXURISEN",
      description: "Test Transaction",
      order_id: response.order.id,
      handler: async (response) => {
        const isValid = await handleVerifyCartOrder(response);
        if (isValid) {
          navigate(`/orders-success?order_id=${response.razorpay_order_id}`, {
            state: {
              cartItems,
              summary: {
                subtotal,
                total,
                couponDiscount,
                shipping,
                currency,
                totalSavings,
              },
            },
          });
        }
      },
      prefill: {
        name: user?.fullname,
        email: user?.email,
        contact: user?.contact,
      },
      theme: {
        color: "#C9A96E",
      },
    };

    const razorpayInstance = new Razorpay(options);
    razorpayInstance.open();
  };

  return (
    <aside
      className={`w-full lg:w-[340px] flex-shrink-0 self-start lg:sticky lg:top-[88px] transition-all duration-500 ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
      }`}
    >
      <div className="border border-[#e4e2df] dark:border-[#292522] rounded-lg p-6 sm:p-7 bg-[#fbf9f6] dark:bg-[#141210] shadow-sm">
        {/* Title */}
        <p className="m-0 mb-6 text-[0.6rem] tracking-[0.28em] uppercase text-[#6b6158] dark:text-[#a8a29e] font-medium">
          Order Summary
        </p>

        {/* Free shipping progress */}
        {!shippingFree && (
          <div className="mb-6">
            <div className="flex justify-between mb-2">
              <span className="text-[0.55rem] tracking-[0.12em] uppercase text-[#6b6158] dark:text-[#a8a29e]">
                Add {fmt(shippingThreshold - subtotal, currency)} for free
                shipping
              </span>
            </div>
            <div className="h-1 bg-[#e4e2df] dark:bg-[#292522] rounded-full overflow-hidden">
              <div
                style={{ width: `${progressPct}%` }}
                className="h-full bg-[#C9A96E] rounded-full transition-all duration-500"
              />
            </div>
          </div>
        )}

        {shippingFree && (
          <div className="mb-5 p-2.5 bg-emerald-500/10 dark:bg-emerald-500/15 rounded flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 flex-shrink-0"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
              />
            </svg>
            <span className="text-[0.55rem] tracking-[0.12em] uppercase text-emerald-600 dark:text-emerald-400 font-medium">
              You&apos;ve unlocked free shipping!
            </span>
          </div>
        )}

        {/* Line items */}
        <div className="flex flex-col gap-3.5">
          <div className="flex justify-between items-start">
            <span className="text-[0.65rem] tracking-[0.08em] text-[#3d342c] dark:text-[#d6d3d1]">
              Subtotal ({cartItems.length}{" "}
              {cartItems.length === 1 ? "item" : "items"})
            </span>
            <div className="flex flex-col items-end gap-0.5">
              {hasSavings && (
                <span className="text-[11px] text-[#a8a29e] line-through">
                  {fmt(subtotal + totalSavings, currency)}
                </span>
              )}
              <span className="text-sm font-semibold text-[#0d0d0b] dark:text-[#fbf9f6]">
                {fmt(subtotal, currency)}
              </span>
              {hasSavings && (
                <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
                  ✓ Saving {fmt(totalSavings, currency)}
                </span>
              )}
            </div>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-[0.65rem] tracking-[0.08em] text-[#3d342c] dark:text-[#d6d3d1]">
              Shipping
            </span>
            <span
              className={`text-xs ${
                shippingFree
                  ? "text-emerald-600 dark:text-emerald-400 font-normal"
                  : "text-[#0d0d0b] dark:text-[#fbf9f6] font-medium"
              }`}
            >
              {shippingFree ? "Free" : fmt(shipping, currency)}
            </span>
          </div>

          {/* Divider */}
          <div className="border-t border-[#e4e2df] dark:border-[#292522] my-1" />

          {/* Promo Code Input Section */}
          <div className="my-1">
            <p className="m-0 mb-2 text-[0.6rem] tracking-wider uppercase text-[#6b6158] dark:text-[#a8a29e] font-medium">
              Have a promo code?
            </p>
            {!isCouponApplied ? (
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Enter code (e.g. LUX10)"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                  className="flex-1 px-3 py-2 text-xs bg-white dark:bg-[#1a1715] border border-[#e4e2df] dark:border-[#292522] rounded text-[#0d0d0b] dark:text-[#fbf9f6] outline-none focus:border-[#C9A96E]"
                />
                <button
                  onClick={handleApplyCoupon}
                  disabled={isValidatingCoupon || !couponCode.trim()}
                  className="px-4 py-2 bg-[#3d342c] dark:bg-[#2a2622] hover:bg-[#0d0d0b] dark:hover:bg-[#C9A96E] dark:hover:text-[#0d0d0b] text-white text-[0.62rem] tracking-wider uppercase font-medium rounded transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isValidatingCoupon ? "..." : "Apply"}
                </button>
              </div>
            ) : (
              <div className="flex items-center justify-between p-2.5 bg-emerald-500/10 dark:bg-emerald-500/15 border border-dashed border-emerald-500/30 rounded">
                <div className="flex items-center gap-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                    className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                    />
                  </svg>
                  <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                    {couponCode} Applied
                  </span>
                </div>
                <button
                  onClick={removeCoupon}
                  className="bg-transparent border-none p-0 text-[0.6rem] text-[#6b6158] dark:text-[#a8a29e] hover:text-red-500 underline cursor-pointer"
                >
                  Remove
                </button>
              </div>
            )}
            {couponError && (
              <p className="m-0 mt-1.5 text-xs text-red-500">
                {couponError}
              </p>
            )}
          </div>

          {/* Coupon Discount Row (if applied) */}
          {isCouponApplied && (
            <div className="flex justify-between items-center">
              <span className="text-[0.65rem] tracking-[0.08em] text-emerald-600 dark:text-emerald-400">
                Coupon ({couponCode})
              </span>
              <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                -{fmt(couponDiscount, currency)}
              </span>
            </div>
          )}

          {/* Divider */}
          <div className="border-t border-[#e4e2df] dark:border-[#292522] my-1" />

          {/* Total */}
          <div className="flex justify-between items-center">
            <span className="text-[0.7rem] tracking-[0.18em] uppercase text-[#0d0d0b] dark:text-[#fbf9f6] font-semibold">
              Total
            </span>
            <span className="text-lg font-semibold text-[#C9A96E]">
              {fmt(total, currency)}
            </span>
          </div>
          <p className="m-0 -mt-1.5 text-[0.55rem] tracking-[0.1em] text-[#6b6158] dark:text-[#a8a29e] text-right">
            incl. of all taxes
          </p>
        </div>

        {/* Checkout button */}
        <button
          id="btn-checkout"
          onClick={handleCheckout}
          className="mt-6 w-full py-4 rounded-full bg-[#0d0d0b] dark:bg-[#fbf9f6] text-[#fbf9f6] dark:text-[#0d0d0b] text-[0.65rem] tracking-[0.22em] uppercase font-semibold hover:bg-[#C9A96E] hover:text-[#0d0d0b] dark:hover:bg-[#C9A96E] dark:hover:text-[#0d0d0b] transition-all duration-300 shadow-md flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99]"
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
              d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25Z"
            />
          </svg>
          Proceed to Checkout
        </button>

        {/* Test Mode Disclaimer */}
        <div className="mt-3 p-2 bg-amber-500/10 dark:bg-amber-500/15 border border-amber-500/20 rounded flex items-center gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className="w-4 h-4 text-amber-600 dark:text-amber-400 flex-shrink-0"
          >
            <path
              fillRule="evenodd"
              d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z"
              clipRule="evenodd"
            />
          </svg>
          <span className="text-[0.62rem] text-amber-700 dark:text-amber-300 font-medium">
            Test Mode Only. Do not enter real payment details.
          </span>
        </div>

        {/* Continue shopping */}
        <button
          onClick={() => navigate("/")}
          className="mt-3 w-full py-3 bg-transparent text-[#3d342c] dark:text-[#d6d3d1] border border-[#e4e2df] dark:border-[#292522] rounded-full hover:border-[#0d0d0b] dark:hover:border-white hover:text-[#0d0d0b] dark:hover:text-white transition-all text-[0.62rem] tracking-[0.18em] uppercase font-medium cursor-pointer"
        >
          Continue Shopping
        </button>

        {/* Trust badges */}
        <div className="mt-5 pt-4 border-t border-[#e4e2df] dark:border-[#292522] flex justify-center gap-5 text-[#6b6158] dark:text-[#a8a29e]">
          {[
            {
              icon: (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-3.5 h-3.5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z"
                  />
                </svg>
              ),
              label: "Secure",
            },
            {
              icon: (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-3.5 h-3.5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M8.25 18.75a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 0 1-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 0 0-3.213-9.193 2.056 2.056 0 0 0-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 0 0-10.026 0 1.106 1.106 0 0 0-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12"
                  />
                </svg>
              ),
              label: "Fast Ship",
            },
            {
              icon: (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-3.5 h-3.5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99"
                  />
                </svg>
              ),
              label: "Easy Return",
            },
          ].map(({ icon, label }) => (
            <div
              key={label}
              className="flex flex-col items-center gap-1 text-[0.5rem] tracking-[0.12em] uppercase font-sans"
            >
              {icon}
              <span>{label}</span>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
};

/* ── Loading Skeleton ─────────────────────────────────────────── */
const LoadingSkeleton = () => (
  <div className="max-w-[1200px] mx-auto px-6 lg:px-12 py-12 flex gap-12 items-start">
    <div className="flex-1 flex flex-col gap-0">
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className="flex gap-5 py-7 border-b border-[#e4e2df] dark:border-[#292522] animate-pulse"
        >
          <div className="w-24 h-28 bg-[#e4e2df] dark:bg-[#1f1c19] rounded" />
          <div className="flex-1 flex flex-col gap-2.5">
            <div className="h-4 w-48 bg-[#e4e2df] dark:bg-[#1f1c19] rounded" />
            <div className="h-3 w-28 bg-[#e4e2df] dark:bg-[#1f1c19] rounded" />
            <div className="h-3 w-16 bg-[#e4e2df] dark:bg-[#1f1c19] rounded" />
          </div>
        </div>
      ))}
    </div>
    <div className="hidden lg:block w-[340px] p-7 border border-[#e4e2df] dark:border-[#292522] rounded-lg bg-[#fbf9f6] dark:bg-[#141210] animate-pulse">
      <div className="h-4 w-32 bg-[#e4e2df] dark:bg-[#1f1c19] rounded mb-6" />
      <div className="h-3 w-full bg-[#e4e2df] dark:bg-[#1f1c19] rounded mb-4" />
      <div className="h-3 w-full bg-[#e4e2df] dark:bg-[#1f1c19] rounded mb-4" />
      <div className="h-10 w-full bg-[#e4e2df] dark:bg-[#1f1c19] rounded mt-6" />
    </div>
  </div>
);

/* ── Empty State ──────────────────────────────────────────────── */
const EmptyCart = ({ navigate }) => {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 80);
    return () => clearTimeout(t);
  }, []);

  return (
    <div
      className={`flex-1 flex flex-col items-center justify-center py-24 px-6 gap-5 transition-all duration-500 ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
      }`}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={0.75}
        stroke="#d0c5b5"
        className="w-16 h-16 text-[#C9A96E]"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007Z"
        />
      </svg>

      <div className="text-center flex flex-col gap-2">
        <h2
          className="m-0 text-3xl sm:text-4xl font-light text-[#0d0d0b] dark:text-white"
          style={{ fontFamily: "'Cormorant Garamond', serif" }}
        >
          Your bag is empty
        </h2>
        <p className="m-0 text-xs text-[#6b6158] dark:text-[#a8a29e] font-light max-w-xs leading-relaxed">
          Explore the collection and add pieces you love.
        </p>
      </div>

      <button
        id="btn-explore-collection"
        onClick={() => navigate("/")}
        className="mt-2 px-8 py-3.5 rounded-full bg-[#0d0d0b] dark:bg-[#fbf9f6] text-[#fbf9f6] dark:text-[#0d0d0b] text-[0.65rem] tracking-[0.22em] uppercase font-semibold hover:bg-[#C9A96E] hover:text-[#0d0d0b] dark:hover:bg-[#C9A96E] dark:hover:text-[#0d0d0b] transition-all cursor-pointer shadow-sm"
      >
        Explore Collection
      </button>
    </div>
  );
};

/* ── Cart Page ────────────────────────────────────────────────── */
const Cart = () => {
  const cart = useSelector((state) => state.cart);
  const cartItems = cart.items;
  const {
    handleGetCart,
    handleRemoveFromCart,
    handleIncrementCartItem,
    handleDecrementCartItem,
  } = useCart();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(true);
  const [visible, setVisible] = useState(false);
  const [removingIds, setRemovingIds] = useState(new Set());

  useEffect(() => {
    handleGetCart().finally(() => {
      setIsLoading(false);
      setTimeout(() => setVisible(true), 60);
    });
  }, []);

  const handleRemove = async ({ productId, variantId }) => {
    const item = cartItems.find((i) => {
      const matchProduct =
        i.product?._id === productId || i.product === productId;
      const matchVariant = variantId ? i.variant === variantId : !i.variant;
      return matchProduct && matchVariant;
    });
    const itemId = item?._id;

    if (itemId) setRemovingIds((prev) => new Set([...prev, itemId]));
    try {
      await handleRemoveFromCart({ productId, variantId });
      if (itemId) dispatch(removeFromCart(itemId));
    } catch (err) {
      console.error(err);
    } finally {
      if (itemId) {
        setTimeout(() => {
          setRemovingIds((prev) => {
            const next = new Set(prev);
            next.delete(itemId);
            return next;
          });
        }, 380);
      }
    }
  };

  const handleQtyChange = async ({ productId, variantId }, newQty) => {
    if (newQty < 1) return;

    const item = cartItems.find((i) => {
      const matchProduct =
        i.product?._id === productId || i.product === productId;
      const matchVariant = variantId ? i.variant === variantId : !i.variant;
      return matchProduct && matchVariant;
    });
    if (!item) return;
    const itemId = item._id;

    const delta = newQty - item.quantity;
    if (delta === 0) return;

    const updated = cartItems.map((cartItem) =>
      cartItem._id === itemId ? { ...cartItem, quantity: newQty } : cartItem,
    );
    dispatch(setCart({ ...cart, items: updated }));

    try {
      if (delta > 0) {
        for (let i = 0; i < delta; i++) {
          await handleIncrementCartItem({ productId, variantId });
        }
      } else {
        for (let i = 0; i < Math.abs(delta); i++) {
          await handleDecrementCartItem({ productId, variantId });
        }
      }
    } catch (err) {
      console.error(err);
      handleGetCart();
    }
  };

  return (
    <>
      <FontLink />
      <div className="min-h-screen bg-[#fbf9f6] dark:bg-[#0a0908] text-[#0d0d0b] dark:text-[#fbf9f6] transition-colors duration-300 flex flex-col font-sans">
        {/* Loading */}
        {isLoading && <LoadingSkeleton />}

        {/* Empty cart */}
        {!isLoading && cartItems.length === 0 && (
          <EmptyCart navigate={navigate} />
        )}

        {/* Cart content */}
        {!isLoading && cartItems.length > 0 && (
          <main className="max-w-[1200px] mx-auto px-6 lg:px-12 py-10 pb-24 w-full flex-1">
            {/* Page header */}
            <div
              className={`mb-10 transition-all duration-500 ${
                visible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-4"
              }`}
            >
              {/* Breadcrumb */}
              <div className="flex items-center gap-2 mb-4">
                <button
                  onClick={() => navigate("/")}
                  className="bg-transparent border-none cursor-pointer text-[0.6rem] tracking-[0.2em] uppercase text-[#6b6158] dark:text-[#a8a29e] hover:text-[#C9A96E] p-0"
                >
                  Collection
                </button>
                <span className="text-[0.6rem] text-[#d0c5b5] dark:text-[#38332e]">
                  /
                </span>
                <span className="text-[0.6rem] tracking-[0.2em] uppercase text-[#3d342c] dark:text-[#d6d3d1]">
                  Your Bag
                </span>
              </div>

              <h1
                className="m-0 text-3xl sm:text-5xl font-light text-[#0d0d0b] dark:text-white leading-tight"
                style={{ fontFamily: "'Cormorant Garamond', serif" }}
              >
                Your Bag
              </h1>
              <p className="m-0 mt-2 text-xs text-[#6b6158] dark:text-[#a8a29e] font-light">
                {cartItems.length} {cartItems.length === 1 ? "item" : "items"}{" "}
                selected
              </p>
            </div>

            {/* Two-column layout */}
            <div className="flex flex-col lg:flex-row gap-10 lg:gap-14 items-start">
              {/* LEFT: Cart items list */}
              <div className="flex-1 w-full min-w-0">
                {/* Column header */}
                <div
                  className={`grid grid-cols-[1fr_auto] pb-3 border-b border-[#e4e2df] dark:border-[#292522] transition-opacity duration-500 ${
                    visible ? "opacity-100" : "opacity-0"
                  }`}
                >
                  <span className="text-[0.55rem] tracking-[0.2em] uppercase text-[#6b6158] dark:text-[#a8a29e] font-medium">
                    Product
                  </span>
                  <span className="text-[0.55rem] tracking-[0.2em] uppercase text-[#6b6158] dark:text-[#a8a29e] font-medium">
                    Total
                  </span>
                </div>

                {/* Items */}
                <div className="divide-y divide-[#e4e2df] dark:divide-[#292522]">
                  {cartItems.map((item, idx) => (
                    <CartItemRow
                      key={item._id}
                      item={item}
                      idx={idx}
                      onRemove={handleRemove}
                      removing={removingIds.has(item._id)}
                      onQtyChange={handleQtyChange}
                    />
                  ))}
                </div>
              </div>

              {/* RIGHT: Order summary */}
              <OrderSummary cart={cart} visible={visible} />
            </div>
          </main>
        )}

        {/* Footer */}
        <footer className="border-t border-[#e4e2df] dark:border-[#292522] max-w-[1200px] w-full mx-auto px-6 lg:px-12 py-10 flex items-center justify-between flex-wrap gap-4">
          <span
            className="text-[0.9rem] tracking-[0.35em] uppercase text-[#C9A96E] cursor-pointer"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
            onClick={() => navigate("/")}
          >
            Luxurisen
          </span>
          <p className="m-0 text-[0.6rem] tracking-[0.15em] uppercase text-[#6b6158] dark:text-[#a8a29e]">
            © {new Date().getFullYear()} Luxurisen — All rights reserved
          </p>
        </footer>
      </div>
    </>
  );
};

export default Cart;
