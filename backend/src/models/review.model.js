import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "products",
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    body: {
      type: String,
      required: true,
      trim: true,
      maxlength: 1000,
    },
  },
  { timestamps: true },
);

// One review per user per product
reviewSchema.index({ product: 1, user: 1 }, { unique: true });

const reviewModel = mongoose.model("reviews", reviewSchema);

export default reviewModel;