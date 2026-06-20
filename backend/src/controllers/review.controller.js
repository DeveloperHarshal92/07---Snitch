import mongoose from "mongoose";
import {
  createReview,
  getReviewsByProduct,
  getReviewByUserAndProduct,
  updateReview,
  deleteReview,
  getAverageRating,
} from "../dao/review.dao.js";

// POST /api/reviews/:productId
export const addReview = async (req, res) => {
  const { productId } = req.params;
  const userId = req.user._id;
  const { rating, title, body } = req.body;

  try {
    const existing = await getReviewByUserAndProduct(userId, productId);
    if (existing) {
      return res.status(409).json({
        message: "You have already reviewed this product",
        success: false,
      });
    }

    const review = await createReview({ productId, userId, rating, title, body });
    await review.populate("user", "fullname");

    res.status(201).json({
      message: "Review added successfully",
      success: true,
      review,
    });
  } catch (err) {
    console.error(err);
    const status = err.name === "ValidationError" ? 400 : 500;
    res.status(status).json({
      message: err.message || "Failed to add review",
      success: false,
    });
  }
};

// GET /api/reviews/:productId
export const getProductReviews = async (req, res) => {
  const { productId } = req.params;

  try {
    const [reviews, stats] = await Promise.all([
      getReviewsByProduct(productId),
      getAverageRating(new mongoose.Types.ObjectId(productId)),
    ]);

    res.status(200).json({
      message: "Reviews retrieved successfully",
      success: true,
      reviews,
      stats,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Failed to retrieve reviews",
      success: false,
    });
  }
};

// PUT /api/reviews/:reviewId
export const editReview = async (req, res) => {
  const { reviewId } = req.params;
  const userId = req.user._id;
  const { rating, title, body } = req.body;

  try {
    const updated = await updateReview(reviewId, userId, { rating, title, body });

    if (!updated) {
      return res.status(404).json({
        message: "Review not found or you are not the author",
        success: false,
      });
    }

    await updated.populate("user", "fullname");

    res.status(200).json({
      message: "Review updated successfully",
      success: true,
      review: updated,
    });
  } catch (err) {
    console.error(err);
    const status = err.name === "ValidationError" ? 400 : 500;
    res.status(status).json({
      message: err.message || "Failed to update review",
      success: false,
    });
  }
};

// DELETE /api/reviews/:reviewId
export const removeReview = async (req, res) => {
  const { reviewId } = req.params;
  const userId = req.user._id;

  try {
    const deleted = await deleteReview(reviewId, userId);

    if (!deleted) {
      return res.status(404).json({
        message: "Review not found or you are not the author",
        success: false,
      });
    }

    res.status(200).json({
      message: "Review deleted successfully",
      success: true,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Failed to delete review",
      success: false,
    });
  }
};