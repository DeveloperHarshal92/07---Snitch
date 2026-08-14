import couponModel from "../models/coupon.model.js";
import mongoose from "mongoose";

/**
 * Validate a coupon code against business rules and the user's cart total.
 * Returns { valid: true, coupon, discountAmount } or { valid: false, message }
 *
 * @param {string} code
 * @param {number} cartTotal
 * @returns {Promise<{ valid: boolean, coupon?: Object, discountAmount?: number, message?: string }>}
 */
export const findValidCoupon = async (code, cartTotal = 0) => {
  if (!code || typeof code !== "string") {
    return { valid: false, message: "Coupon code is required" };
  }

  const normalizedCode = code.trim().toUpperCase();
  const coupon = await couponModel.findOne({ code: normalizedCode });

  if (!coupon) {
    return { valid: false, message: "Invalid coupon code" };
  }

  if (!coupon.isActive) {
    return { valid: false, message: "This coupon is no longer active" };
  }

  if (coupon.expiresAt && new Date() > new Date(coupon.expiresAt)) {
    return { valid: false, message: "This coupon has expired" };
  }

  if (coupon.minCartValue > 0 && cartTotal < coupon.minCartValue) {
    return {
      valid: false,
      message: `Minimum cart value of ₹${coupon.minCartValue} required for this coupon`,
    };
  }

  if (coupon.usageLimit != null && coupon.usedCount >= coupon.usageLimit) {
    return { valid: false, message: "Coupon usage limit has been reached" };
  }

  let discountAmount = 0;
  if (coupon.discountType === "percentage") {
    discountAmount = Math.round((cartTotal * coupon.discountValue) / 100);
    if (coupon.maxDiscountAmount != null && discountAmount > coupon.maxDiscountAmount) {
      discountAmount = coupon.maxDiscountAmount;
    }
  } else if (coupon.discountType === "fixed") {
    discountAmount = Math.min(coupon.discountValue, cartTotal);
  }

  discountAmount = Math.max(0, discountAmount);

  return {
    valid: true,
    coupon,
    discountAmount,
  };
};

/**
 * Atomically increment the usedCount of a coupon upon confirmed order completion.
 * @param {string|mongoose.Types.ObjectId} codeOrId
 * @returns {Promise<Object>}
 */
export const incrementCouponUsage = async (codeOrId) => {
  if (!codeOrId) return null;

  const filter = mongoose.Types.ObjectId.isValid(codeOrId)
    ? { _id: codeOrId }
    : { code: String(codeOrId).trim().toUpperCase() };

  return await couponModel.updateOne(filter, { $inc: { usedCount: 1 } });
};
