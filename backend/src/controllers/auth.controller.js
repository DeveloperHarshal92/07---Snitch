import { config } from "../config/config.js";
import userModel from "../models/user.model.js";
import jwt from "jsonwebtoken";

async function sendTokenResponse(user, res, message) {
  const token = jwt.sign(
    {
      id: user._id,
    },
    config.JWT_SECRET,
    { expiresIn: "7d" },
  );

  res.cookie("token", token);

  res.status(200).json({
    message,
    success: true,
    user: {
      id: user._id,
      email: user.email,
      contact: user.contact,
      fullname: user.fullname,
      role: user.role,
    },
  });
}

export async function register(req, res) {
  const { fullname, email, password, contact, isSeller } = req.body;
  try {
    const existingUser = userModel.findOne({
      $or: [{ email }, { contact }],
    });

    if (existingUser) {
      return res.status(400).json({
        message: "User with same email or contact already exists",
      });
    }

    const user = await userModel.create({
      email,
      contact,
      password,
      fullname,
      role: isSeller ? "seller" : "buyer",
    });
    await sendTokenResponse(user, res, "User registered successfully");
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Server error",
    });
  }
}

export async function login(req, res) {
  const { email, password } = req.body;
  try {
    const user = await userModel.findOne({ email }).select("+password");
    if (!user) {
      return res.status(400).json({
        message: "Invalid credentials",
      });
    } else {
      const isMatch = await user.matchPassword(password);
      if (!isMatch) {
        return res.status(400).json({
          message: "Invalid credentials",
        });
      }
      await sendTokenResponse(user, res, "User logged in successfully");
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Server error",
    });
  }
}

export async function googleCallback(req, res) {
  console.log(req.user);
  res.redirect("http://localhost:5173/");
}
