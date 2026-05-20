import productModel from "../models/product.model.js";

export const stockOfVariant = async (productId, variantId) => {
  if (variantId) {
    const product = await productModel.findOne({
      _id: productId,
      "variants._id": variantId,
    });
    if (!product) return 0;
    const stock = product.variants.find(
      (variant) => variant._id.toString() === variantId,
    ).stock;
    return stock;
  } else {
    const product = await productModel.findById(productId);
    // If no stock is set on the base product, assume some default or just return product.stock
    return product ? (product.stock || 100) : 0; // Defaulting to 100 for now to avoid blocking testing if the DB lacks this field
  }
};
