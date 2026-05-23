import { Router } from "express";
import { authenticateUser } from "../middlewares/auth.middleware.js";
import {
  validateAddToCart,
  validateCartProductParams,
} from "../validator/cart.validator.js";
import {
  addToCart,
  getCart,
  removeFromCart,
  incrementCartItem,
  decrementCartItem,
  createOrderController,
  verifyOrderController,
} from "../controllers/cart.controller.js";

const router = Router();

/*
 * @route POST /api/cart/add/:productId
 * @route POST /api/cart/add/:productId/:variantId
 * @desc Add a product or product variant to the cart
 * @access Private
 * @argument productId - ID of the product to add
 * @argument variantId - ID of the product variant to add
 * @argument quantity - Quantity of the product variant to add (default: 1)
 */
router.post(
  ["/add/:productId", "/add/:productId/:variantId"],
  authenticateUser,
  validateAddToCart,
  addToCart,
);
/*
 * @route GET /api/cart
 * @desc Get the current user's cart
 * @access Private
 */
router.get("/", authenticateUser, getCart);

/*
 * @route DELETE /api/cart/remove/:productId
 * @route DELETE /api/cart/remove/:productId/:variantId
 * @desc Remove an item from the cart by its product and variant ID
 * @access Private
 */
router.delete(
  ["/remove/:productId", "/remove/:productId/:variantId"],
  authenticateUser,
  validateCartProductParams,
  removeFromCart,
);

/*
 * @route PATCH /api/cart/quantity/increment/:productId
 * @route PATCH /api/cart/quantity/increment/:productId/:variantId
 * @desc Increase the quantity of a cart item
 * @access Private
 */
router.patch(
  [
    "/quantity/increment/:productId",
    "/quantity/increment/:productId/:variantId",
  ],
  authenticateUser,
  validateCartProductParams,
  incrementCartItem,
);

/*
 * @route PATCH /api/cart/quantity/decrement/:productId
 * @route PATCH /api/cart/quantity/decrement/:productId/:variantId
 * @desc Decrease the quantity of a cart item
 * @access Private
 */
router.patch(
  [
    "/quantity/decrement/:productId",
    "/quantity/decrement/:productId/:variantId",
  ],
  authenticateUser,
  validateCartProductParams,
  decrementCartItem,
);

/**
 * @route POST /api/cart/payment/create/order
 * @desc Create a payment order for the current cart
 * @access Private
 * @argument amount - Total amount to be paid (in INR)
 * @argument currency - Currency code (default: INR)
 */
router.post("/payment/create/order", authenticateUser, createOrderController);

/**
 * @route POST /api/cart/payment/verify/order
 * @desc Verify the payment for an order
 * @access Private
 * @argument orderId - ID of the order to verify
 * @argument paymentId - ID of the payment to verify
 * @argument signature - Signature to verify the payment
 */
router.post("/payment/verify/order", authenticateUser, verifyOrderController);

export default router;
