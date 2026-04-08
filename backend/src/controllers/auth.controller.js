import { config } from "../config/config.js";
import userModel from "../models/user.model.js";
import jwt from "jsonwebtoken";

async function sendTokenResponse(user, res) {
  const token = jwt.sign(
    {
      id: user._id,
    },
    config.JWT_SECRET,
    { expiresIn: "7d" },
  );
}

export async function registerUser(req, res) {
  const { fullname, email, password, contact } = req.body;
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
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Server error",
    });
  }
}
