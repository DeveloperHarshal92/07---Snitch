import mongoose from "mongoose";
import priceSchema from "./price.schema.js";

const cartSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    items: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "products",
          required: true,
        },
        variant: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "products.variants",
        },
        quantity: {
          type: Number,
          default: 1,
        },
        price: {
          type: priceSchema,
          required: true,
        },
      },
    ],
  },
  { timestamps: true },
);

const cartModel = mongoose.model("cart", cartSchema);

export default cartModel;
