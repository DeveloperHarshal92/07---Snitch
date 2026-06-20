import { body, validationResult } from "express-validator";

function validationRequest(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
}

export const addReviewValidator = [
  body("rating")
    .notEmpty()
    .withMessage("Rating is required")
    .isInt({ min: 1, max: 5 })
    .withMessage("Rating must be a whole number between 1 and 5"),
  body("title")
    .notEmpty()
    .withMessage("Review title is required")
    .isLength({ max: 100 })
    .withMessage("Title must be 100 characters or fewer"),
  body("body")
    .notEmpty()
    .withMessage("Review body is required")
    .isLength({ max: 1000 })
    .withMessage("Review must be 1000 characters or fewer"),
  validationRequest,
];

export const editReviewValidator = [
  body("rating")
    .optional()
    .isInt({ min: 1, max: 5 })
    .withMessage("Rating must be a whole number between 1 and 5"),
  body("title")
    .optional()
    .isLength({ max: 100 })
    .withMessage("Title must be 100 characters or fewer"),
  body("body")
    .optional()
    .isLength({ max: 1000 })
    .withMessage("Review must be 1000 characters or fewer"),
  validationRequest,
];