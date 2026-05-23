import Razorpay from "razorpay";
import { config } from "../config/config.js";

const razorpay = new Razorpay({
  key_id: config.RAZORPAY_KEY_ID,
  key_secret: config.RAZORPAY_KEY_SECRET,
});

export const createOrder = async ({ amount, currency = "INR" }) => {
  const options = {
    amount: amount * 100, // amount in the smallest currency unit
    currency,
    receipt: `receipt_${Date.now()}`,
  };
  /**
   *  1INR = 100 paise
   * So, if you want to charge 500 INR, you need to pass 50000 (500 * 100) as the amount in the options object when creating an order with Razorpay. This is because Razorpay expects the amount to be in the smallest currency unit (paise for INR).
   * 500 INR = 50000 paise
   */
  const order = await razorpay.orders.create(options);
  return order;
};
