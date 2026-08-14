import { getCartDetails } from "../dao/cart.dao.js";
import { findValidCoupon } from "../dao/coupon.dao.js";

/**
 * Controller to validate a coupon against the authenticated user's active cart.
 */
export const validateCouponController = async (req, res) => {
  const { code } = req.body;

  if (!code || typeof code !== "string" || !code.trim()) {
    return res.status(400).json({
      valid: false,
      message: "Please provide a coupon code",
      success: false,
    });
  }

  try {
    const cart = await getCartDetails(req.user._id);

    if (!cart || !cart.items || cart.items.length === 0) {
      return res.status(400).json({
        valid: false,
        message: "Your cart is empty",
        success: false,
      });
    }

    const validation = await findValidCoupon(code, cart.totalPrice);

    if (!validation.valid) {
      return res.status(400).json({
        valid: false,
        message: validation.message,
        success: false,
      });
    }

    return res.status(200).json({
      valid: true,
      discountAmount: validation.discountAmount,
      code: validation.coupon.code,
      message: "Coupon applied successfully",
      success: true,
    });
  } catch (error) {
    console.error("Error in validateCouponController:", error);
    return res.status(500).json({
      valid: false,
      message: error.message || "Internal server error",
      success: false,
    });
  }
};
