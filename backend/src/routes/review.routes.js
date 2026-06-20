import { Router } from "express";
import { authenticateUser } from "../middlewares/auth.middleware.js";
import {
  addReview,
  getProductReviews,
  editReview,
  removeReview,
} from "../controllers/review.controller.js";
import {
  addReviewValidator,
  editReviewValidator,
} from "../validator/review.validator.js";

const router = Router();

/**
 * @route GET /api/reviews/:productId
 * @desc Get all reviews + stats for a product
 * @access Public
 */
router.get("/:productId", getProductReviews);

/**
 * @route POST /api/reviews/:productId
 * @desc Add a review for a product
 * @access Private (Buyers only)
 */
router.post("/:productId", authenticateUser, addReviewValidator, addReview);

/**
 * @route PUT /api/reviews/:reviewId
 * @desc Edit own review
 * @access Private (Buyers only)
 */
router.put("/:reviewId", authenticateUser, editReviewValidator, editReview);

/**
 * @route DELETE /api/reviews/:reviewId
 * @desc Delete own review
 * @access Private (Buyers only)
 */
router.delete("/:reviewId", authenticateUser, removeReview);

export default router;