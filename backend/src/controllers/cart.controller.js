import cartModel from "../models/cart.model.js";
import productModel from "../models/product.model.js";
import { stockOfVariant } from "../dao/product.dao.js";

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

    const query = {
      user: req.user._id,
      "items.product": productId,
    };
    if (variantId) {
      query["items.variant"] = variantId;
    } else {
      query["items.variant"] = { $exists: false }; // Or null depending on how it's saved. Mongoose might just omit it.
    }

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
    price: product.price,
  };
  if (variantId) {
    cartItem.variant = variantId;
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
  let cart = await cartModel
    .findOne({ user: user._id })
    .populate("items.product");
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
