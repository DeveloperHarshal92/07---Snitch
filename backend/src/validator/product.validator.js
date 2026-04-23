import { body, validationResult } from "express-validator";

function validationRequest(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
}

export const createProductValidator = [
  body("title").notEmpty().withMessage("Product title is required"),
  body("description").notEmpty().withMessage("Product description is required"),
  body("priceAmount")
    .notEmpty()
    .withMessage("Product price is required")
    .isNumeric()
    .withMessage("Price must be a number"),
  body("priceCurrency")
    .optional()
    .isIn(["USD", "EUR", "GBP", "JPY", "INR"])
    .withMessage("Invalid currency"),
  validationRequest,
];
