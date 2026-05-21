import cartModel from "../models/cart.model.js";

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
    { new: true }
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
    { new: true }
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
    { new: true }
  );
};
