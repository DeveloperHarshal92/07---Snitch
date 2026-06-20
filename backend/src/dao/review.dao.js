import reviewModel from "../models/review.model.js";

export const createReview = async ({ productId, userId, rating, title, body }) => {
  return await reviewModel.create({
    product: productId,
    user: userId,
    rating,
    title,
    body,
  });
};

export const getReviewsByProduct = async (productId) => {
  return await reviewModel
    .find({ product: productId })
    .populate("user", "fullname")
    .sort({ createdAt: -1 });
};

export const getReviewByUserAndProduct = async (userId, productId) => {
  return await reviewModel.findOne({ user: userId, product: productId });
};

export const updateReview = async (reviewId, userId, { rating, title, body }) => {
  return await reviewModel.findOneAndUpdate(
    { _id: reviewId, user: userId },
    { rating, title, body },
    { new: true, runValidators: true },
  );
};

export const deleteReview = async (reviewId, userId) => {
  return await reviewModel.findOneAndDelete({ _id: reviewId, user: userId });
};

export const getAverageRating = async (productId) => {
  const result = await reviewModel.aggregate([
    { $match: { product: productId } },
    {
      $group: {
        _id: "$product",
        averageRating: { $avg: "$rating" },
        totalReviews: { $sum: 1 },
        ratingDistribution: {
          $push: "$rating",
        },
      },
    },
  ]);

  if (result.length === 0) {
    return { averageRating: 0, totalReviews: 0, ratingDistribution: {} };
  }

  const { averageRating, totalReviews, ratingDistribution } = result[0];

  // Build { 1: N, 2: N, 3: N, 4: N, 5: N }
  const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  ratingDistribution.forEach((r) => {
    distribution[r] = (distribution[r] || 0) + 1;
  });

  return {
    averageRating: Math.round(averageRating * 10) / 10,
    totalReviews,
    ratingDistribution: distribution,
  };
};