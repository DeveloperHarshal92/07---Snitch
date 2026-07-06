import dotenv from "dotenv";
import mongoose from "mongoose";
import path from "path";
import userModel from "../src/models/user.model.js";

const envPath = path.resolve(".env");
const localEnvPath = path.resolve(".env.local");

dotenv.config({ path: envPath });
dotenv.config({ path: localEnvPath, override: true });

const uri = process.env.MONGO_URI || "mongodb://localhost:27017/snitch-test";
const credentials = {
  fullname: "test",
  email: "test@example.com",
  password: "test@123",
  contact: "9654862347",
  role: "buyer",
};

async function main() {
  await mongoose.connect(uri);
  console.log(`Connected to local MongoDB at ${uri}`);

  const existing = await userModel.findOne({ email: credentials.email });
  if (existing) {
    existing.fullname = credentials.fullname;
    existing.password = credentials.password;
    existing.contact = credentials.contact;
    existing.role = credentials.role;
    await existing.save();
    console.log(`Updated existing local buyer account: ${credentials.email}`);
  } else {
    await userModel.create(credentials);
    console.log(`Created local buyer account: ${credentials.email}`);
  }

  await mongoose.disconnect();
  console.log("Disconnected from local MongoDB");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
