import fs from "fs/promises";
import path from "path";
import mongoose from "mongoose";
import productModel from "../src/models/product.model.js";

const dataPath = path.resolve("atlas-products-backup.json");
const uri = process.env.MONGO_URI || "mongodb://localhost:27017/snitch-test";

async function main() {
  const raw = await fs.readFile(dataPath, "utf8");
  const payload = JSON.parse(raw);

  if (!payload.products || !Array.isArray(payload.products)) {
    throw new Error("atlas-products-backup.json does not contain a valid products array");
  }

  const docs = payload.products.map((product) => {
    const cleaned = { ...product };
    delete cleaned._id;
    delete cleaned.__v;
    return cleaned;
  });

  await mongoose.connect(uri);
  console.log(`Connected to local MongoDB at ${uri}`);

  const result = await productModel.insertMany(docs, { ordered: false });
  console.log(`Inserted ${result.length} products.`);
  await mongoose.disconnect();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
