import mongoose from "mongoose";
import { connectDB } from "../config/db.js";
import couponModel from "../models/coupon.model.js";

const sampleCoupons = [
  {
    code: "SNITCH10",
    discountType: "percentage",
    discountValue: 10,
    maxDiscountAmount: null,
    minCartValue: 0,
    isActive: true,
  },
  {
    code: "SNITCH80",
    discountType: "percentage",
    discountValue: 80,
    maxDiscountAmount: 2000,
    minCartValue: 500,
    isActive: true,
  },
  {
    code: "FLAT500",
    discountType: "fixed",
    discountValue: 500,
    minCartValue: 1500,
    isActive: true,
  },
  {
    code: "EXPIRED10",
    discountType: "percentage",
    discountValue: 10,
    expiresAt: new Date(Date.now() - 24 * 60 * 60 * 1000), // Expired yesterday
    isActive: true,
  },
  {
    code: "MINVALUE999",
    discountType: "fixed",
    discountValue: 200,
    minCartValue: 999,
    isActive: true,
  },
  {
    code: "LIMIT1",
    discountType: "percentage",
    discountValue: 15,
    usageLimit: 1,
    usedCount: 1, // Limit reached
    isActive: true,
  },
];

const seedCoupons = async () => {
  try {
    await connectDB();
    console.log("Seeding coupons...");

    for (const coupon of sampleCoupons) {
      await couponModel.findOneAndUpdate(
        { code: coupon.code },
        { $set: coupon },
        { upsert: true, new: true }
      );
      console.log(`Upserted coupon: ${coupon.code}`);
    }

    console.log("Coupon seeding complete!");
  } catch (error) {
    console.error("Error seeding coupons:", error);
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB.");
    process.exit(0);
  }
};

seedCoupons();
