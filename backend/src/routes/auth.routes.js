import { Router } from "express";
import {
  getMe,
  googleCallback,
  login,
  register,
  logout,
} from "../controllers/auth.controller.js";
import {
  validateLoginUser,
  validateRegisterUser,
} from "../validator/auth.validator.js";
import passport from "passport";
import { authenticateUser } from "../middlewares/auth.middleware.js";
import { authLimiter } from "../middlewares/rateLimiter.middleware.js";

const router = Router();

/**
 * @route POST /api/auth/register
 * @desc Register a new user
 * @access Public
 */
router.post("/register", authLimiter, validateRegisterUser, register);

/**
 * @route POST /api/auth/login
 * @desc Login a user and return a JWT token
 * @access Public
 */
router.post("/login", authLimiter, validateLoginUser, login);

/**
 * @route POST /api/auth/logout
 * @desc Logout user and clear auth cookie
 * @access Public
 */
router.post("/logout", logout);

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
    failureRedirect: process.env.CLIENT_URL ? `${process.env.CLIENT_URL}/login` : "/login",
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

