import cartModel from "../models/cart.model.js";
import mongoose from "mongoose";

export const removeItem = async (userId, productId, variantId) => {
  const itemMatch = { product: productId };
  if (variantId) {
    itemMatch.variant = variantId;
  } else {
    itemMatch.variant = { $exists: false };
  }
  return await cartModel.findOneAndUpdate(
    { user: userId },
    { $pull: { items: itemMatch } },
    { new: true },
  );
};

export const incrementQuantity = async (userId, productId, variantId) => {
  const itemMatch = { product: productId };
  if (variantId) {
    itemMatch.variant = variantId;
  } else {
    itemMatch.variant = { $exists: false };
  }
  return await cartModel.findOneAndUpdate(
    { user: userId, items: { $elemMatch: itemMatch } },
    { $inc: { "items.$.quantity": 1 } },
    { new: true },
  );
};

export const decrementQuantity = async (userId, productId, variantId) => {
  const itemMatch = { product: productId, quantity: { $gt: 1 } };
  if (variantId) {
    itemMatch.variant = variantId;
  } else {
    itemMatch.variant = { $exists: false };
  }
  return await cartModel.findOneAndUpdate(
    { user: userId, items: { $elemMatch: itemMatch } },
    { $inc: { "items.$.quantity": -1 } },
    { new: true },
  );
};

export const getCartDetails = async (userId) => {
  let cart = (
    await cartModel.aggregate([
      {
        $match: {
          user: new mongoose.Types.ObjectId(userId),
        },
      },
      { $unwind: { path: "$items" } },
      {
        $lookup: {
          from: "products",
          localField: "items.product",
          foreignField: "_id",
          as: "items.product",
        },
      },
      { $unwind: { path: "$items.product" } },
      {
        $unwind: { path: "$items.product.variants" },
      },
      {
        $match: {
          $expr: {
            $eq: ["$items.variant", "$items.product.variants._id"],
          },
        },
      },
      {
        $addFields: {
          itemPrice: {
            price: {
              $multiply: [
                "$items.quantity",
                "$items.product.variants.price.amount",
              ],
            },
            currency: "$items.product.variants.price.currency",
          },
        },
      },
      {
        $group: {
          _id: "_id",
          totalPrice: { $sum: "$itemPrice.price" },
          currency: {
            $first: "$itemPrice.currency",
          },
          items: { $push: "$items" },
        },
      },
    ])
  )[0];

  return cart;
};
