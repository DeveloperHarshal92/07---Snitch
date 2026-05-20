import { Router } from "express";
import { authenticateUser } from "../middlewares/auth.middleware.js";
import { validateAddToCart } from "../validator/cart.validator.js";
import { addToCart, getCart } from "../controllers/cart.controller.js";

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

export default router;
