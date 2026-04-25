import { Router } from "express";
import {
  getMe,
  googleCallback,
  login,
  register,
} from "../controllers/auth.controller.js";
import {
  validateLoginUser,
  validateRegisterUser,
} from "../validator/auth.validator.js";
import passport from "passport";
import { config } from "../config/config.js";
import { authenticateUser } from "../middlewares/auth.middleware.js";

const router = Router();

/**
 * @route POST /api/auth/register
 * @desc Register a new user
 * @access Public
 */
router.post("/register", validateRegisterUser, register);

/**
 * @route POST /api/auth/login
 * @desc Login a user and return a JWT token
 * @access Public
 */
router.post("/login", validateLoginUser, login);

/**
 * @route GET /api/auth/google
 * @desc Authenticate user with Google
 * @access Public
 */
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] }),
);

/**
 * @route GET /api/auth/google/callback
 * @desc Handle Google authentication callback
 * @access Public
 */
router.get(
  "/google/callback",
  passport.authenticate("google", {
    session: false,
    failureRedirect:
      config.NODE_ENV === "development"
        ? "http://localhost:5173/login"
        : "/login",
  }),
  googleCallback,
);

/**
 * @route GET /api/auth/me
 * @desc Get the authenticated user's profile
 * @access Private
 */
router.get("/me", authenticateUser, getMe);

export default router;
