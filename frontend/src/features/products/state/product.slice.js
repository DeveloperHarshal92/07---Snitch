import { createSlice } from "@reduxjs/toolkit";

const productSlice = createSlice({
  name: "product",
  initialState: {
    sellerProducts: [],
    products: [],
    reviews: [],           // reviews for the currently viewed product
    reviewStats: null,     // { averageRating, totalReviews, ratingDistribution }
  },
  reducers: {
    setSellerProducts: (state, action) => {
      state.sellerProducts = action.payload;
    },
    setProducts: (state, action) => {
      state.products = action.payload;
    },
    setReviews: (state, action) => {
      state.reviews = action.payload;
    },
    setReviewStats: (state, action) => {
      state.reviewStats = action.payload;
    },
    addReviewToState: (state, action) => {
      // Prepend so the new review appears at the top
      state.reviews = [action.payload, ...state.reviews];
      // Recalculate stats client-side to avoid a re-fetch
      const total = state.reviews.length;
      const avg =
        state.reviews.reduce((sum, r) => sum + r.rating, 0) / total;
      const dist = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
      state.reviews.forEach((r) => {
        dist[r.rating] = (dist[r.rating] || 0) + 1;
      });
      state.reviewStats = {
        averageRating: Math.round(avg * 10) / 10,
        totalReviews: total,
        ratingDistribution: dist,
      };
    },
    updateReviewInState: (state, action) => {
      const idx = state.reviews.findIndex((r) => r._id === action.payload._id);
      if (idx !== -1) state.reviews[idx] = action.payload;
      // Recalculate stats
      const total = state.reviews.length;
      const avg =
        state.reviews.reduce((sum, r) => sum + r.rating, 0) / total;
      const dist = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
      state.reviews.forEach((r) => {
        dist[r.rating] = (dist[r.rating] || 0) + 1;
      });
      state.reviewStats = {
        averageRating: Math.round(avg * 10) / 10,
        totalReviews: total,
        ratingDistribution: dist,
      };
    },
    removeReviewFromState: (state, action) => {
      state.reviews = state.reviews.filter((r) => r._id !== action.payload);
      // Recalculate stats
      const total = state.reviews.length;
      if (total === 0) {
        state.reviewStats = {
          averageRating: 0,
          totalReviews: 0,
          ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
        };
        return;
      }
      const avg =
        state.reviews.reduce((sum, r) => sum + r.rating, 0) / total;
      const dist = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
      state.reviews.forEach((r) => {
        dist[r.rating] = (dist[r.rating] || 0) + 1;
      });
      state.reviewStats = {
        averageRating: Math.round(avg * 10) / 10,
        totalReviews: total,
        ratingDistribution: dist,
      };
    },
  },
});

export const {
  setSellerProducts,
  setProducts,
  setReviews,
  setReviewStats,
  addReviewToState,
  updateReviewInState,
  removeReviewFromState,
} = productSlice.actions;

export default productSlice.reducer;