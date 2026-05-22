import cartModel from "../models/cart.model.js";
import productModel from "../models/product.model.js";
import { stockOfVariant } from "../dao/product.dao.js";
import * as cartDao from "../dao/cart.dao.js";
import mongoose from "mongoose";

export const addToCart = async (req, res) => {
  const { productId, variantId } = req.params;
  const { quantity = 1 } = req.body;

  let product;
  if (variantId) {
    product = await productModel.findOne({
      _id: productId,
      "variants._id": variantId,
    });
  } else {
    product = await productModel.findById(productId);
  }

  if (!product) {
    return res.status(404).json({
      message: "Product or variant not found",
      success: false,
    });
  }

  const stock = await stockOfVariant(productId, variantId);

  const cart =
    (await cartModel.findOne({
      user: req.user._id,
    })) ||
    (await cartModel.create({
      user: req.user._id,
      items: [],
    }));

  const isProductInCart = cart.items.some((item) => {
    const matchProduct = item.product.toString() === productId;
    const matchVariant = variantId
      ? item.variant?.toString() === variantId
      : !item.variant;
    return matchProduct && matchVariant;
  });

  if (isProductInCart) {
    const quantityInCart = cart.items.find((item) => {
      const matchProduct = item.product.toString() === productId;
      const matchVariant = variantId
        ? item.variant?.toString() === variantId
        : !item.variant;
      return matchProduct && matchVariant;
    }).quantity;

    if (quantityInCart + quantity > stock) {
      return res.status(400).json({
        message: `Only ${stock - quantityInCart} items left in stock and you already have ${quantityInCart} in your cart`,
        success: false,
      });
    }

    const elemMatch = { product: productId };
    if (variantId) {
      elemMatch.variant = variantId;
    } else {
      elemMatch.variant = { $exists: false };
    }

    const query = {
      user: req.user._id,
      items: { $elemMatch: elemMatch },
    };

    await cartModel.findOneAndUpdate(
      query,
      {
        $inc: { "items.$.quantity": quantity },
      },
      { new: true },
    );

    return res.status(200).json({
      message: "Product quantity updated in cart",
      success: true,
    });
  }

  if (quantity > stock) {
    return res.status(400).json({
      message: `Only ${stock} items left in stock`,
      success: false,
    });
  }

  const cartItem = {
    product: productId,
    quantity,
    price: product.price, // Fallback base price
  };

  if (variantId) {
    cartItem.variant = variantId;
    const variant =
      product.variants.id(variantId) ||
      product.variants.find((v) => v._id.toString() === variantId);
    if (variant && variant.price && variant.price.amount) {
      cartItem.price = variant.price;
    }
  }

  cart.items.push(cartItem);

  await cart.save();

  return res.status(200).json({
    message: "Product added to cart",
    success: true,
  });
};

export const getCart = async (req, res) => {
  const user = req.user;
  let cart = await cartModel.aggregate([
    {
      $match: {
        user: new mongoose.Types.ObjectId(user._id),
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
  ]);
  if (!cart) {
    cart = await cartModel.create({
      user: user._id,
      items: [],
    });
  }

  return res.status(200).json({
    message: "Cart retrieved successfully",
    success: true,
    cart,
  });
};

export const removeFromCart = async (req, res) => {
  const { productId, variantId } = req.params;
  try {
    await cartDao.removeItem(req.user._id, productId, variantId);
    return res.status(200).json({
      message: "Product removed from cart",
      success: true,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message, success: false });
  }
};

export const incrementCartItem = async (req, res) => {
  const { productId, variantId } = req.params;
  try {
    // Check stock before incrementing
    const cart = await cartModel.findOne({ user: req.user._id });
    const item = cart?.items.find((i) => {
      const matchProduct = i.product.toString() === productId;
      const matchVariant = variantId
        ? i.variant?.toString() === variantId
        : !i.variant;
      return matchProduct && matchVariant;
    });

    if (!item) {
      return res
        .status(404)
        .json({ message: "Item not found in cart", success: false });
    }

    const stock = await stockOfVariant(
      item.product.toString(),
      item.variant?.toString(),
    );

    if (item.quantity >= stock) {
      return res.status(400).json({
        message: `Only ${stock} items left in stock`,
        success: false,
      });
    }

    await cartDao.incrementQuantity(req.user._id, productId, variantId);
    return res.status(200).json({
      message: "Quantity increased",
      success: true,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message, success: false });
  }
};

export const decrementCartItem = async (req, res) => {
  const { productId, variantId } = req.params;
  try {
    const updated = await cartDao.decrementQuantity(
      req.user._id,
      productId,
      variantId,
    );
    if (!updated) {
      return res
        .status(400)
        .json({ message: "Could not decrement quantity", success: false });
    }
    return res.status(200).json({
      message: "Quantity decreased",
      success: true,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message, success: false });
  }
};
