import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useProduct } from "../hooks/useProduct";

// ── Helpers ──────────────────────────────────────────────────────

const StarIcon = ({ filled, half = false, size = 14 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill={filled ? "#C9A96E" : "none"}
    stroke="#C9A96E"
    strokeWidth={1.5}
    style={{ display: "inline-block", flexShrink: 0 }}
  >
    {half ? (
      <>
        <defs>
          <linearGradient id="half-fill">
            <stop offset="50%" stopColor="#C9A96E" />
            <stop offset="50%" stopColor="transparent" />
          </linearGradient>
        </defs>
        <polygon
          points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"
          fill="url(#half-fill)"
          stroke="#C9A96E"
          strokeWidth={1.5}
        />
      </>
    ) : (
      <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
    )}
  </svg>
);

const StarRow = ({ rating, size = 14, interactive = false, onChange }) => {
  const [hovered, setHovered] = useState(0);
  const display = interactive ? hovered || rating : rating;

  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((n) => (
        <span
          key={n}
          onClick={() => interactive && onChange?.(n)}
          onMouseEnter={() => interactive && setHovered(n)}
          onMouseLeave={() => interactive && setHovered(0)}
          className={interactive ? "cursor-pointer" : "cursor-default"}
        >
          <StarIcon filled={n <= display} size={size} />
        </span>
      ))}
    </div>
  );
};

const RatingBar = ({ star, count, total }) => {
  const pct = total > 0 ? Math.round((count / total) * 100) : 0;
  return (
    <div className="flex items-center gap-2.5">
      <span className="text-[0.6rem] tracking-[0.12em] text-[#6b6158] dark:text-[#a8a29e] w-8 text-right font-sans">
        {star} ★
      </span>
      <div className="flex-1 h-1 bg-[#e4e2df] dark:bg-[#292522] rounded-full overflow-hidden">
        <div
          style={{ width: `${pct}%` }}
          className="h-full bg-[#C9A96E] rounded-full transition-all duration-500"
        />
      </div>
      <span className="text-[0.6rem] text-[#6b6158] dark:text-[#a8a29e] w-6 font-sans">
        {count}
      </span>
    </div>
  );
};

// ── Review Form (add / edit) ─────────────────────────────────────

const ReviewForm = ({ productId, existingReview = null, onDone, onCancel }) => {
  const { handleAddReview, handleEditReview } = useProduct();

  const isEdit = !!existingReview;
  const [rating, setRating] = useState(existingReview?.rating ?? 0);
  const [title, setTitle] = useState(existingReview?.title ?? "");
  const [body, setBody] = useState(existingReview?.body ?? "");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    if (rating === 0) return setError("Please select a star rating.");
    if (!title.trim()) return setError("Please add a short title.");
    if (!body.trim()) return setError("Please write your review.");
    setError("");
    setSubmitting(true);
    try {
      if (isEdit) {
        await handleEditReview(existingReview._id, { rating, title, body });
      } else {
        await handleAddReview(productId, { rating, title, body });
      }
      onDone?.();
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.errors?.[0]?.msg ||
        "Something went wrong. Please try again.";
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="border border-[#e4e2df] dark:border-[#292522] rounded-lg p-6 sm:p-7 bg-[#faf8f5] dark:bg-[#161412] flex flex-col gap-4">
      <p className="m-0 text-[0.6rem] tracking-[0.25em] uppercase text-[#C9A96E] font-medium">
        {isEdit ? "Edit your review" : "Write a review"}
      </p>

      {/* Star picker */}
      <div className="flex flex-col gap-2">
        <label className="text-[0.6rem] tracking-[0.15em] uppercase text-[#6b6158] dark:text-[#a8a29e]">
          Your Rating
        </label>
        <StarRow rating={rating} size={22} interactive onChange={setRating} />
      </div>

      {/* Title */}
      <div className="flex flex-col gap-2">
        <label className="text-[0.6rem] tracking-[0.15em] uppercase text-[#6b6158] dark:text-[#a8a29e]">
          Title
        </label>
        <input
          type="text"
          value={title}
          maxLength={100}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Summarise your experience"
          className="w-full bg-[#f5f3f0] dark:bg-[#1f1c19] border border-[#e4e2df] dark:border-[#292522] rounded px-3.5 py-2.5 text-xs text-[#0d0d0b] dark:text-[#fbf9f6] outline-none focus:border-[#C9A96E] transition-all"
        />
      </div>

      {/* Body */}
      <div className="flex flex-col gap-2">
        <label className="text-[0.6rem] tracking-[0.15em] uppercase text-[#6b6158] dark:text-[#a8a29e]">
          Review
        </label>
        <textarea
          value={body}
          maxLength={1000}
          onChange={(e) => setBody(e.target.value)}
          placeholder="Tell others what you think about this product..."
          rows={4}
          className="w-full bg-[#f5f3f0] dark:bg-[#1f1c19] border border-[#e4e2df] dark:border-[#292522] rounded px-3.5 py-2.5 text-xs text-[#0d0d0b] dark:text-[#fbf9f6] outline-none focus:border-[#C9A96E] transition-all resize-y leading-relaxed"
        />
        <span className="text-[0.55rem] text-[#9d9089] text-right">
          {body.length}/1000
        </span>
      </div>

      {/* Error */}
      {error && (
        <p className="m-0 text-xs text-red-500 font-light">
          {error}
        </p>
      )}

      {/* Actions */}
      <div className="flex gap-2.5 pt-1">
        <button
          onClick={handleSubmit}
          disabled={submitting}
          className="flex-1 py-3 bg-[#0d0d0b] dark:bg-[#fbf9f6] text-[#fbf9f6] dark:text-[#0d0d0b] rounded text-[0.62rem] tracking-[0.22em] uppercase font-semibold hover:bg-[#C9A96E] hover:text-[#0d0d0b] dark:hover:bg-[#C9A96E] dark:hover:text-[#0d0d0b] transition-all cursor-pointer"
        >
          {submitting ? "Saving…" : isEdit ? "Save Changes" : "Submit Review"}
        </button>
        {onCancel && (
          <button
            onClick={onCancel}
            className="px-5 py-3 bg-transparent text-[#6b6158] dark:text-[#a8a29e] border border-[#e4e2df] dark:border-[#292522] rounded text-[0.62rem] tracking-[0.15em] uppercase hover:text-[#0d0d0b] dark:hover:text-white transition-all cursor-pointer"
          >
            Cancel
          </button>
        )}
      </div>
    </div>
  );
};

// ── Single Review Card ───────────────────────────────────────────

const ReviewCard = ({ review, currentUserId, onEdit, onDelete }) => {
  const isOwn = review.user?._id === currentUserId;

  return (
    <div className="py-5 border-b border-[#e4e2df] dark:border-[#292522] flex flex-col gap-2.5">
      {/* Top row */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex flex-col gap-1.5">
          <StarRow rating={review.rating} size={13} />
          <p
            className="m-0 text-sm md:text-base font-light text-[#0d0d0b] dark:text-[#fbf9f6] leading-snug"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            {review.title}
          </p>
        </div>

        {isOwn && (
          <div className="flex gap-2.5 flex-shrink-0">
            <button
              onClick={() => onEdit(review)}
              className="bg-transparent border-none cursor-pointer text-[0.55rem] tracking-[0.15em] uppercase text-[#6b6158] dark:text-[#a8a29e] hover:text-[#C9A96E] underline underline-offset-4 p-0"
            >
              Edit
            </button>
            <button
              onClick={() => onDelete(review._id)}
              className="bg-transparent border-none cursor-pointer text-[0.55rem] tracking-[0.15em] uppercase text-red-500 hover:text-red-600 underline underline-offset-4 p-0"
            >
              Delete
            </button>
          </div>
        )}
      </div>

      {/* Body */}
      <p className="m-0 text-xs md:text-sm text-[#3d342c] dark:text-[#d6d3d1] leading-relaxed font-light">
        {review.body}
      </p>

      {/* Author + date */}
      <div className="flex gap-2 items-center text-xs text-[#6b6158] dark:text-[#a8a29e]">
        <span className="font-medium text-[#0d0d0b] dark:text-[#fbf9f6]">
          {review.user?.fullname ?? "Anonymous"}
        </span>
        <span>·</span>
        <span>
          {new Date(review.createdAt).toLocaleDateString("en-IN", {
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
        </span>
        {isOwn && (
          <>
            <span>·</span>
            <span className="text-[0.55rem] tracking-wider uppercase text-[#C9A96E] font-semibold">
              Your review
            </span>
          </>
        )}
      </div>
    </div>
  );
};

// ── Main ReviewSection ───────────────────────────────────────────

const ReviewSection = ({ productId }) => {
  const { handleGetProductReviews, handleDeleteReview } = useProduct();

  const reviews = useSelector((state) => state.product.reviews);
  const stats = useSelector((state) => state.product.reviewStats);
  const currentUser = useSelector((state) => state.auth.user);

  const [showForm, setShowForm] = useState(false);
  const [editingReview, setEditingReview] = useState(null);
  const [loadingReviews, setLoadingReviews] = useState(true);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    setLoadingReviews(true);
    handleGetProductReviews(productId).finally(() => setLoadingReviews(false));
  }, [productId]);

  const userHasReviewed = reviews.some(
    (r) => r.user?._id === currentUser?._id,
  );

  const handleEdit = (review) => {
    setEditingReview(review);
    setShowForm(false);
    window.scrollTo({
      top: document.getElementById("review-form-anchor")?.offsetTop - 80,
      behavior: "smooth",
    });
  };

  const handleDelete = async (reviewId) => {
    if (!window.confirm("Delete your review?")) return;
    setDeletingId(reviewId);
    try {
      await handleDeleteReview(reviewId);
    } finally {
      setDeletingId(null);
    }
  };

  const handleFormDone = () => {
    setShowForm(false);
    setEditingReview(null);
  };

  const canWriteReview =
    currentUser &&
    currentUser.role === "buyer" &&
    !userHasReviewed &&
    !editingReview;

  return (
    <section className="border-t border-[#e4e2df] dark:border-[#292522] py-14">
      <div className="max-w-[1200px] mx-auto px-6 lg:px-12">
        {/* ── Section header ──────────────────────────────────── */}
        <div className="mb-9">
          <p className="m-0 mb-1.5 text-[0.6rem] tracking-[0.28em] uppercase text-[#C9A96E] font-medium">
            What customers say
          </p>
          <h2
            className="m-0 text-3xl md:text-4xl font-light text-[#0d0d0b] dark:text-white leading-tight"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            Customer Reviews
          </h2>
        </div>

        {/* ── Stats + Write CTA row ────────────────────────── */}
        {stats && stats.totalReviews > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-[auto_1fr] gap-8 sm:gap-12 items-start mb-10">
            {/* Average rating block */}
            <div className="flex flex-col items-center gap-2 min-w-[110px]">
              <span
                className="text-5xl font-light text-[#0d0d0b] dark:text-white leading-none"
                style={{ fontFamily: "'Cormorant Garamond', serif" }}
              >
                {stats.averageRating.toFixed(1)}
              </span>
              <StarRow rating={Math.round(stats.averageRating)} size={16} />
              <span className="text-[0.6rem] tracking-[0.12em] text-[#6b6158] dark:text-[#a8a29e]">
                {stats.totalReviews}{" "}
                {stats.totalReviews === 1 ? "review" : "reviews"}
              </span>
            </div>

            {/* Distribution bars */}
            <div className="flex flex-col gap-1.5 pt-1">
              {[5, 4, 3, 2, 1].map((star) => (
                <RatingBar
                  key={star}
                  star={star}
                  count={stats.ratingDistribution?.[star] ?? 0}
                  total={stats.totalReviews}
                />
              ))}
            </div>
          </div>
        )}

        {/* ── Write Review button ─────────────────────────── */}
        <div id="review-form-anchor" className="mb-8">
          {!currentUser && (
            <p className="text-xs text-[#6b6158] dark:text-[#a8a29e]">
              Please sign in to leave a review.
            </p>
          )}

          {canWriteReview && !showForm && (
            <button
              onClick={() => setShowForm(true)}
              className="px-7 py-3 bg-transparent text-[#0d0d0b] dark:text-[#fbf9f6] border border-[#0d0d0b] dark:border-white/40 rounded text-[0.62rem] tracking-[0.22em] uppercase font-semibold hover:bg-[#0d0d0b] hover:text-[#fbf9f6] dark:hover:bg-white dark:hover:text-[#0d0d0b] transition-all cursor-pointer"
            >
              Write a Review
            </button>
          )}

          {/* New review form */}
          {showForm && !editingReview && (
            <div className="animate-fadeIn">
              <ReviewForm
                productId={productId}
                onDone={handleFormDone}
                onCancel={() => setShowForm(false)}
              />
            </div>
          )}

          {/* Edit review form */}
          {editingReview && (
            <div className="animate-fadeIn">
              <ReviewForm
                productId={productId}
                existingReview={editingReview}
                onDone={handleFormDone}
                onCancel={() => setEditingReview(null)}
              />
            </div>
          )}
        </div>

        {/* ── Review list ─────────────────────────────────── */}
        {loadingReviews ? (
          <div className="flex flex-col gap-6">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="py-5 border-b border-[#e4e2df] dark:border-[#292522] flex flex-col gap-2.5 animate-pulse"
              >
                <div className="h-2.5 w-20 bg-[#e4e2df] dark:bg-[#292522] rounded" />
                <div className="h-3.5 w-48 bg-[#e4e2df] dark:bg-[#292522] rounded" />
                <div className="h-2.5 w-full bg-[#e4e2df] dark:bg-[#292522] rounded" />
              </div>
            ))}
          </div>
        ) : reviews.length === 0 ? (
          <p className="text-xs text-[#9d9089] dark:text-[#78716c] italic pt-2">
            No reviews yet. Be the first to share your thoughts.
          </p>
        ) : (
          <div className="divide-y divide-[#e4e2df] dark:divide-[#292522]">
            {reviews.map((review) => (
              <div key={review._id}>
                {deletingId === review._id ? (
                  <div className="py-5 text-xs text-[#9d9089]">
                    Deleting…
                  </div>
                ) : (
                  <ReviewCard
                    review={review}
                    currentUserId={currentUser?._id}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                  />
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default ReviewSection;