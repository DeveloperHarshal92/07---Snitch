import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import mongoose from "mongoose";
import productModel from "../src/models/product.model.js";

const LOCAL_MONGO_URI = "mongodb://localhost:27017/snitch-test";
const currentDirectory = path.dirname(fileURLToPath(import.meta.url));
const backupPath = path.join(currentDirectory, "atlas-products-backup.json");

try {
  const backup = JSON.parse(await fs.readFile(backupPath, "utf8"));
  const products = Array.isArray(backup) ? backup : backup.products;

  if (!Array.isArray(products)) {
    throw new Error("Atlas backup does not contain a products array.");
  }

  const productsWithoutAtlasIds = products.map(({ _id, __v, ...product }) => product);

  await mongoose.connect(LOCAL_MONGO_URI);
  const inserted = await productModel.insertMany(productsWithoutAtlasIds);
  console.log(`Inserted ${inserted.length} products into ${LOCAL_MONGO_URI}.`);
} catch (error) {
  console.error(error);
  process.exitCode = 1;
} finally {
  await mongoose.disconnect();
}
