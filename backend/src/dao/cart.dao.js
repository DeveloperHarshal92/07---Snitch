import cartModel from "../models/cart.model.js";

export const removeItem = async (userId, productId, variantId) => {
  const cart = await cartModel.findOne({ user: userId });
  if (!cart) return null;
  cart.items = cart.items.filter((item) => {
    const matchProduct = item.product.toString() === productId.toString();
    const matchVariant = variantId
      ? item.variant?.toString() === variantId.toString()
      : !item.variant;
    return !(matchProduct && matchVariant);
  });
  return await cart.save();
};

export const incrementQuantity = async (userId, productId, variantId) => {
  const cart = await cartModel.findOne({ user: userId });
  if (!cart) return null;
  const item = cart.items.find((item) => {
    const matchProduct = item.product.toString() === productId.toString();
    const matchVariant = variantId
      ? item.variant?.toString() === variantId.toString()
      : !item.variant;
    return matchProduct && matchVariant;
  });
  if (item) {
    item.quantity += 1;
    return await cart.save();
  }
  return null;
};

export const decrementQuantity = async (userId, productId, variantId) => {
  const cart = await cartModel.findOne({ user: userId });
  if (!cart) return null;
  const item = cart.items.find((item) => {
    const matchProduct = item.product.toString() === productId.toString();
    const matchVariant = variantId
      ? item.variant?.toString() === variantId.toString()
      : !item.variant;
    return matchProduct && matchVariant;
  });
  if (item && item.quantity > 1) {
    item.quantity -= 1;
    return await cart.save();
  }
  return null;
};

export const getCartDetails = async (userId) => {
  const cartDoc = await cartModel
    .findOne({ user: userId })
    .populate({
      path: "items.product",
      model: "products",
    })
    .lean();

  if (!cartDoc) {
    return {
      user: userId,
      items: [],
      totalPrice: 0,
      currency: "INR",
    };
  }

  const validItems = (cartDoc.items || []).filter(
    (item) => item.product && item.product._id,
  );

  let totalPrice = 0;
  let currency = "INR";

  const enrichedItems = validItems.map((item) => {
    const product = item.product;
    let unitPrice = item.price?.amount ?? product?.price?.amount ?? 0;
    let itemCurrency =
      item.price?.currency ?? product?.price?.currency ?? "INR";

    if (item.variant && Array.isArray(product.variants)) {
      const variant = product.variants.find(
        (v) => v._id && v._id.toString() === item.variant.toString(),
      );
      if (variant?.price?.amount) {
        unitPrice = variant.price.amount;
      }
      if (variant?.price?.currency) {
        itemCurrency = variant.price.currency;
      }
    }

    currency = itemCurrency || currency;
    totalPrice += unitPrice * (item.quantity || 1);

    return {
      _id: item._id,
      product: {
        _id: product._id,
        title: product.title,
        description: product.description,
        price: product.price,
        images: product.images,
        variants: product.variants,
        stock: product.stock,
      },
      variant: item.variant || null,
      quantity: item.quantity || 1,
      price: {
        amount: unitPrice,
        currency: itemCurrency,
      },
    };
  });

  return {
    _id: cartDoc._id,
    user: cartDoc.user,
    items: enrichedItems,
    totalPrice,
    currency,
  };
};

export const clearCart = async (userId) => {
  return await cartModel.findOneAndUpdate(
    { user: userId },
    { $set: { items: [] } },
    { returnDocument: "after" },
  );
};
