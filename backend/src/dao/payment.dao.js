import paymentModel from "../models/payment.model.js";
import productModel from "../models/product.model.js";
import mongoose from "mongoose";

/**
 * Fetch all orders for a specific user, sorted from newest to oldest
 * @param {string|mongoose.Types.ObjectId} userId
 * @returns {Promise<Array>}
 */
export const getOrdersByUser = async (userId) => {
  return await paymentModel
    .find({ user: new mongoose.Types.ObjectId(userId) })
    .sort({ createdAt: -1, _id: -1 })
    .lean();
};

/**
 * Fetch a single order by ID and ensure it belongs to the specified user
 * @param {string|mongoose.Types.ObjectId} userId
 * @param {string|mongoose.Types.ObjectId} orderId
 * @returns {Promise<Object|null>}
 */
export const getOrderById = async (userId, orderId) => {
  if (!mongoose.Types.ObjectId.isValid(orderId)) {
    return null;
  }
  return await paymentModel
    .findOne({
      _id: new mongoose.Types.ObjectId(orderId),
      user: new mongoose.Types.ObjectId(userId),
    })
    .lean();
};

/**
 * Fetch all orders that contain products created by the specified seller
 * @param {string|mongoose.Types.ObjectId} sellerId
 * @returns {Promise<Array>}
 */
export const getOrdersBySeller = async (sellerId) => {
  const sellerProducts = await productModel
    .find({
      $or: [
        { seller: sellerId },
        { seller: sellerId.toString() },
        ...(mongoose.Types.ObjectId.isValid(sellerId)
          ? [{ seller: new mongoose.Types.ObjectId(sellerId) }]
          : []),
      ],
    })
    .select("_id")
    .lean();

  const sellerProductIds = sellerProducts.map((p) => p._id.toString());
  const sellerIdStr = sellerId.toString();

  const queryConditions = [
    { "orderItems.seller": sellerIdStr },
  ];

  if (mongoose.Types.ObjectId.isValid(sellerId)) {
    queryConditions.push({ "orderItems.seller": new mongoose.Types.ObjectId(sellerId) });
  }

  if (sellerProductIds.length > 0) {
    queryConditions.push({
      "orderItems.productId": {
        $in: sellerProductIds.map((id) => new mongoose.Types.ObjectId(id)),
      },
    });
  }

  const orders = await paymentModel
    .find({ $or: queryConditions })
    .populate("user", "fullname email contact")
    .sort({ createdAt: -1, _id: -1 })
    .lean();

  return orders
    .map((order) => {
      const sellerItems = (order.orderItems || []).filter((item) => {
        const itemSellerStr = item.seller?.toString();
        const itemProductIdStr = item.productId?.toString();
        return (
          itemSellerStr === sellerIdStr ||
          (itemProductIdStr && sellerProductIds.includes(itemProductIdStr))
        );
      });

      const sellerSubtotal = sellerItems.reduce(
        (sum, it) => sum + (it.price?.amount || 0) * (it.quantity || 1),
        0,
      );
      const sellerItemCount = sellerItems.reduce(
        (sum, it) => sum + (it.quantity || 1),
        0,
      );

      return {
        ...order,
        orderItems: sellerItems,
        sellerSubtotal,
        sellerItemCount,
        buyer: order.user,
      };
    })
    .filter((order) => order.orderItems.length > 0);
};

/**
 * Fetch a single order by ID for the seller, populated with buyer info and filtered to seller's items
 * @param {string|mongoose.Types.ObjectId} sellerId
 * @param {string|mongoose.Types.ObjectId} orderId
 * @returns {Promise<Object|null>}
 */
export const getSellerOrderById = async (sellerId, orderId) => {
  if (!mongoose.Types.ObjectId.isValid(orderId)) {
    return null;
  }

  const sellerProducts = await productModel
    .find({
      $or: [
        { seller: sellerId },
        { seller: sellerId.toString() },
        ...(mongoose.Types.ObjectId.isValid(sellerId)
          ? [{ seller: new mongoose.Types.ObjectId(sellerId) }]
          : []),
      ],
    })
    .select("_id")
    .lean();

  const sellerProductIds = sellerProducts.map((p) => p._id.toString());
  const sellerIdStr = sellerId.toString();

  const order = await paymentModel
    .findById(orderId)
    .populate("user", "fullname email contact")
    .lean();

  if (!order) return null;

  const sellerItems = (order.orderItems || []).filter((item) => {
    const itemSellerStr = item.seller?.toString();
    const itemProductIdStr = item.productId?.toString();
    return (
      itemSellerStr === sellerIdStr ||
      (itemProductIdStr && sellerProductIds.includes(itemProductIdStr))
    );
  });

  if (sellerItems.length === 0) return null;

  const sellerSubtotal = sellerItems.reduce(
    (sum, it) => sum + (it.price?.amount || 0) * (it.quantity || 1),
    0,
  );
  const sellerItemCount = sellerItems.reduce(
    (sum, it) => sum + (it.quantity || 1),
    0,
  );

  return {
    ...order,
    orderItems: sellerItems,
    sellerSubtotal,
    sellerItemCount,
    buyer: order.user,
  };
};

