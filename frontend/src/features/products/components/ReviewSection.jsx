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
    <div style={{ display: "flex", gap: "3px", alignItems: "center" }}>
      {[1, 2, 3, 4, 5].map((n) => (
        <span
          key={n}
          onClick={() => interactive && onChange?.(n)}
          onMouseEnter={() => interactive && setHovered(n)}
          onMouseLeave={() => interactive && setHovered(0)}
          style={{ cursor: interactive ? "pointer" : "default" }}
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
    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
      <span
        style={{
          fontSize: "0.6rem",
          letterSpacing: "0.12em",
          color: "#6b6158",
          width: "32px",
          textAlign: "right",
          fontFamily: "'Inter', sans-serif",
        }}
      >
        {star} ★
      </span>
      <div
        style={{
          flex: 1,
          height: "4px",
          backgroundColor: "#e4e2df",
          borderRadius: "2px",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            width: `${pct}%`,
            height: "100%",
            backgroundColor: "#C9A96E",
            borderRadius: "2px",
            transition: "width 0.6s ease",
          }}
        />
      </div>
      <span
        style={{
          fontSize: "0.6rem",
          color: "#6b6158",
          width: "24px",
          fontFamily: "'Inter', sans-serif",
        }}
      >
        {count}
      </span>
    </div>
  );
};

// ── Review Form ──────────────────────────────────────────────────

const ReviewForm = ({ productId, existingReview = null, onDone, onCancel }) => {
  const { handleAddReview, handleEditReview } = useProduct();
  const [rating, setRating] = useState(existingReview?.rating ?? 0);
  const [title, setTitle] = useState(existingReview?.title ?? "");
  const [body, setBody] = useState(existingReview?.body ?? "");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const isEdit = Boolean(existingReview);

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

  const inputStyle = {
    width: "100%",
    backgroundColor: "#f5f3f0",
    border: "1px solid #e4e2df",
    borderRadius: "2px",
    padding: "10px 14px",
    fontSize: "0.8rem",
    color: "#0d0d0b",
    fontFamily: "'Inter', sans-serif",
    outline: "none",
    boxSizing: "border-box",
  };

  return (
    <div
      style={{
        border: "1px solid #e4e2df",
        borderRadius: "2px",
        padding: "28px",
        backgroundColor: "#faf8f5",
        display: "flex",
        flexDirection: "column",
        gap: "18px",
      }}
    >
      <p
        style={{
          margin: 0,
          fontSize: "0.6rem",
          letterSpacing: "0.25em",
          textTransform: "uppercase",
          color: "#C9A96E",
          fontFamily: "'Inter', sans-serif",
        }}
      >
        {isEdit ? "Edit your review" : "Write a review"}
      </p>

      {/* Star picker */}
      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        <label
          style={{
            fontSize: "0.6rem",
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            color: "#6b6158",
            fontFamily: "'Inter', sans-serif",
          }}
        >
          Your Rating
        </label>
        <StarRow rating={rating} size={22} interactive onChange={setRating} />
      </div>

      {/* Title */}
      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        <label
          style={{
            fontSize: "0.6rem",
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            color: "#6b6158",
            fontFamily: "'Inter', sans-serif",
          }}
        >
          Title
        </label>
        <input
          type="text"
          value={title}
          maxLength={100}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Summarise your experience"
          style={inputStyle}
        />
      </div>

      {/* Body */}
      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        <label
          style={{
            fontSize: "0.6rem",
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            color: "#6b6158",
            fontFamily: "'Inter', sans-serif",
          }}
        >
          Review
        </label>
        <textarea
          value={body}
          maxLength={1000}
          onChange={(e) => setBody(e.target.value)}
          placeholder="Tell others what you think about this product..."
          rows={4}
          style={{ ...inputStyle, resize: "vertical", lineHeight: 1.7 }}
        />
        <span
          style={{
            fontSize: "0.55rem",
            color: "#9d9089",
            fontFamily: "'Inter', sans-serif",
            textAlign: "right",
          }}
        >
          {body.length}/1000
        </span>
      </div>

      {/* Error */}
      {error && (
        <p
          style={{
            margin: 0,
            fontSize: "0.65rem",
            color: "#c0392b",
            fontFamily: "'Inter', sans-serif",
          }}
        >
          {error}
        </p>
      )}

      {/* Actions */}
      <div style={{ display: "flex", gap: "10px" }}>
        <button
          onClick={handleSubmit}
          disabled={submitting}
          style={{
            flex: 1,
            padding: "12px",
            backgroundColor: submitting ? "#6b6158" : "#0d0d0b",
            color: "#fbf9f6",
            border: "none",
            borderRadius: "2px",
            fontSize: "0.6rem",
            letterSpacing: "0.22em",
            textTransform: "uppercase",
            fontFamily: "'Inter', sans-serif",
            cursor: submitting ? "not-allowed" : "pointer",
            transition: "background-color 0.2s",
          }}
        >
          {submitting ? "Saving…" : isEdit ? "Save Changes" : "Submit Review"}
        </button>
        {onCancel && (
          <button
            onClick={onCancel}
            style={{
              padding: "12px 20px",
              backgroundColor: "transparent",
              color: "#6b6158",
              border: "1px solid #e4e2df",
              borderRadius: "2px",
              fontSize: "0.6rem",
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              fontFamily: "'Inter', sans-serif",
              cursor: "pointer",
            }}
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
    <div
      style={{
        padding: "22px 0",
        borderBottom: "1px solid #e4e2df",
        display: "flex",
        flexDirection: "column",
        gap: "10px",
      }}
    >
      {/* Top row */}
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          gap: "12px",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
          <StarRow rating={review.rating} size={13} />
          <p
            style={{
              margin: 0,
              fontSize: "0.9rem",
              fontFamily: "'Cormorant Garamond', serif",
              fontWeight: 500,
              color: "#0d0d0b",
              lineHeight: 1.3,
            }}
          >
            {review.title}
          </p>
        </div>

        {isOwn && (
          <div style={{ display: "flex", gap: "10px", flexShrink: 0 }}>
            <button
              onClick={() => onEdit(review)}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                fontSize: "0.55rem",
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                color: "#6b6158",
                fontFamily: "'Inter', sans-serif",
                textDecoration: "underline",
                textUnderlineOffset: "3px",
                padding: 0,
              }}
            >
              Edit
            </button>
            <button
              onClick={() => onDelete(review._id)}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                fontSize: "0.55rem",
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                color: "#c0392b",
                fontFamily: "'Inter', sans-serif",
                textDecoration: "underline",
                textUnderlineOffset: "3px",
                padding: 0,
              }}
            >
              Delete
            </button>
          </div>
        )}
      </div>

      {/* Body */}
      <p
        style={{
          margin: 0,
          fontSize: "0.8rem",
          color: "#3d342c",
          lineHeight: 1.75,
          fontFamily: "'Inter', sans-serif",
          fontWeight: 300,
        }}
      >
        {review.body}
      </p>

      {/* Author + date */}
      <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
        <span
          style={{
            fontSize: "0.6rem",
            letterSpacing: "0.1em",
            color: "#6b6158",
            fontFamily: "'Inter', sans-serif",
          }}
        >
          {review.user?.fullname ?? "Anonymous"}
        </span>
        <span style={{ color: "#d0c5b5", fontSize: "0.6rem" }}>·</span>
        <span
          style={{
            fontSize: "0.6rem",
            color: "#9d9089",
            fontFamily: "'Inter', sans-serif",
          }}
        >
          {new Date(review.createdAt).toLocaleDateString("en-IN", {
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
        </span>
        {isOwn && (
          <>
            <span style={{ color: "#d0c5b5", fontSize: "0.6rem" }}>·</span>
            <span
              style={{
                fontSize: "0.55rem",
                letterSpacing: "0.1em",
                color: "#C9A96E",
                fontFamily: "'Inter', sans-serif",
                textTransform: "uppercase",
              }}
            >
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
    window.scrollTo({ top: document.getElementById("review-form-anchor")?.offsetTop - 80, behavior: "smooth" });
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
    currentUser && currentUser.role === "buyer" && !userHasReviewed && !editingReview;

  return (
    <section
      style={{
        borderTop: "1px solid #e4e2df",
        paddingTop: "56px",
        paddingBottom: "64px",
      }}
    >
      <style>{`
        @keyframes reviewFadeIn {
          from { opacity: 0; transform: translateY(14px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .review-card-animate { animation: reviewFadeIn 0.4s ease both; }
      `}</style>

      <div className="max-w-[1200px] mx-auto px-6 lg:px-12">

        {/* ── Section header ──────────────────────────────────── */}
        <div style={{ marginBottom: "36px" }}>
          <p
            style={{
              margin: "0 0 6px",
              fontSize: "0.6rem",
              letterSpacing: "0.28em",
              textTransform: "uppercase",
              color: "#C9A96E",
              fontFamily: "'Inter', sans-serif",
            }}
          >
            What customers say
          </p>
          <h2
            style={{
              margin: 0,
              fontSize: "clamp(1.6rem, 3vw, 2.2rem)",
              fontFamily: "'Cormorant Garamond', serif",
              fontWeight: 300,
              color: "#0d0d0b",
              lineHeight: 1.1,
            }}
          >
            Customer Reviews
          </h2>
        </div>

        {/* ── Stats + Write CTA row ────────────────────────── */}
        {stats && stats.totalReviews > 0 && (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "auto 1fr",
              gap: "40px",
              alignItems: "start",
              marginBottom: "40px",
              flexWrap: "wrap",
            }}
          >
            {/* Average rating block */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "8px",
                minWidth: "110px",
              }}
            >
              <span
                style={{
                  fontSize: "3rem",
                  fontFamily: "'Cormorant Garamond', serif",
                  fontWeight: 300,
                  color: "#0d0d0b",
                  lineHeight: 1,
                }}
              >
                {stats.averageRating.toFixed(1)}
              </span>
              <StarRow rating={Math.round(stats.averageRating)} size={16} />
              <span
                style={{
                  fontSize: "0.6rem",
                  letterSpacing: "0.12em",
                  color: "#6b6158",
                  fontFamily: "'Inter', sans-serif",
                }}
              >
                {stats.totalReviews} {stats.totalReviews === 1 ? "review" : "reviews"}
              </span>
            </div>

            {/* Distribution bars */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "7px",
                paddingTop: "6px",
              }}
            >
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
        <div id="review-form-anchor" style={{ marginBottom: "32px" }}>
          {!currentUser && (
            <p
              style={{
                fontSize: "0.7rem",
                color: "#6b6158",
                fontFamily: "'Inter', sans-serif",
              }}
            >
              Please sign in to leave a review.
            </p>
          )}

          {canWriteReview && !showForm && (
            <button
              onClick={() => setShowForm(true)}
              style={{
                padding: "13px 28px",
                backgroundColor: "transparent",
                color: "#0d0d0b",
                border: "1px solid #0d0d0b",
                borderRadius: "2px",
                fontSize: "0.6rem",
                letterSpacing: "0.22em",
                textTransform: "uppercase",
                fontFamily: "'Inter', sans-serif",
                cursor: "pointer",
                transition: "background-color 0.25s, color 0.25s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "#0d0d0b";
                e.currentTarget.style.color = "#fbf9f6";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "transparent";
                e.currentTarget.style.color = "#0d0d0b";
              }}
            >
              Write a Review
            </button>
          )}

          {/* New review form */}
          {showForm && !editingReview && (
            <div className="review-card-animate">
              <ReviewForm
                productId={productId}
                onDone={handleFormDone}
                onCancel={() => setShowForm(false)}
              />
            </div>
          )}

          {/* Edit review form */}
          {editingReview && (
            <div className="review-card-animate">
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
          <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                style={{
                  padding: "22px 0",
                  borderBottom: "1px solid #e4e2df",
                  display: "flex",
                  flexDirection: "column",
                  gap: "10px",
                }}
              >
                <div
                  className="animate-pulse"
                  style={{
                    height: "10px",
                    width: "80px",
                    backgroundColor: "#e4e2df",
                    borderRadius: "4px",
                  }}
                />
                <div
                  className="animate-pulse"
                  style={{
                    height: "14px",
                    width: "200px",
                    backgroundColor: "#e4e2df",
                    borderRadius: "4px",
                  }}
                />
                <div
                  className="animate-pulse"
                  style={{
                    height: "10px",
                    width: "100%",
                    backgroundColor: "#e4e2df",
                    borderRadius: "4px",
                  }}
                />
              </div>
            ))}
          </div>
        ) : reviews.length === 0 ? (
          <p
            style={{
              fontSize: "0.75rem",
              color: "#9d9089",
              fontFamily: "'Inter', sans-serif",
              fontStyle: "italic",
              paddingTop: "8px",
            }}
          >
            No reviews yet. Be the first to share your thoughts.
          </p>
        ) : (
          <div>
            {reviews.map((review, idx) => (
              <div
                key={review._id}
                className="review-card-animate"
                style={{ animationDelay: `${idx * 0.07}s` }}
              >
                {deletingId === review._id ? (
                  <div
                    style={{
                      padding: "22px 0",
                      borderBottom: "1px solid #e4e2df",
                      fontSize: "0.65rem",
                      color: "#9d9089",
                      fontFamily: "'Inter', sans-serif",
                    }}
                  >
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