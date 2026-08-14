import paymentModel from "../models/payment.model.js";
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
