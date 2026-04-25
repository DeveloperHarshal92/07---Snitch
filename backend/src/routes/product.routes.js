import { Router } from "express";
import { authenticateSeller } from "../middlewares/auth.middleware.js";
import {
  createProduct,
  getAllProducts,
  getSellerProducts,
} from "../controllers/product.controller.js";
import multer from "multer";
import { createProductValidator } from "../validator/product.validator.js";

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
});

const router = Router();

/**
 * @route POST /api/products
 * @desc Create a new product
 * @access Private (Sellers only)
 */
router.post(
  "/",
  authenticateSeller,
  upload.array("images", 7),
  createProductValidator,
  createProduct,
);

/**
 * @route GET /api/products/seller
 * @desc Get all products for the authenticated seller
 * @access Private (Sellers only)
 */
router.get("/seller", authenticateSeller, getSellerProducts);

router.get("/", getAllProducts);

export default router;
