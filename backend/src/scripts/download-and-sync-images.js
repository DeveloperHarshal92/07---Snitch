import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import https from "https";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const rootDir = path.resolve(__dirname, "../../..");
const frontendPublic = path.join(rootDir, "frontend/public");
const backendPublic = path.join(rootDir, "backend/public");

const editsDirFrontend = path.join(frontendPublic, "edits");
const editsDirBackend = path.join(backendPublic, "edits");

if (!fs.existsSync(editsDirFrontend)) fs.mkdirSync(editsDirFrontend, { recursive: true });
if (!fs.existsSync(editsDirBackend)) fs.mkdirSync(editsDirBackend, { recursive: true });

const remoteImages = [
  {
    url: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1400&h=900&fit=crop&q=85",
    filename: "edit-1.jpg",
  },
  {
    url: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1400&h=900&fit=crop&q=85",
    filename: "edit-2.jpg",
  },
  {
    url: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=1400&h=900&fit=crop&q=85",
    filename: "edit-3.jpg",
  },
  {
    url: "https://images.unsplash.com/photo-1445205170230-053b83016050?w=1400&h=900&fit=crop&q=85",
    filename: "edit-4.jpg",
  },
  {
    url: "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=1400&h=900&fit=crop&q=85",
    filename: "edit-5.jpg",
  },
];

const downloadFile = (url, dest) => {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    https.get(url, (response) => {
      if (response.statusCode >= 300 && response.statusCode < 400 && response.headers.location) {
        return downloadFile(response.headers.location, dest).then(resolve).catch(reject);
      }
      if (response.statusCode !== 200) {
        return reject(new Error(`Failed to download ${url}: Status code ${response.statusCode}`));
      }
      response.pipe(file);
      file.on("finish", () => {
        file.close(() => resolve(dest));
      });
    }).on("error", (err) => {
      fs.unlink(dest, () => {});
      reject(err);
    });
  });
};

const copyRecursiveSync = (src, dest) => {
  const exists = fs.existsSync(src);
  const stats = exists && fs.statSync(src);
  const isDirectory = exists && stats.isDirectory();
  if (isDirectory) {
    if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });
    fs.readdirSync(src).forEach((childItemName) => {
      copyRecursiveSync(path.join(src, childItemName), path.join(dest, childItemName));
    });
  } else {
    fs.copyFileSync(src, dest);
  }
};

const run = async () => {
  console.log("Downloading remote DepthCarousel images to local public/edits/...");
  for (const item of remoteImages) {
    const dest = path.join(editsDirFrontend, item.filename);
    console.log(`Downloading ${item.filename}...`);
    await downloadFile(item.url, dest);
    console.log(`Saved -> ${dest}`);
  }

  console.log("Synchronizing all assets from frontend/public to backend/public...");
  copyRecursiveSync(frontendPublic, backendPublic);
  console.log("Assets synchronized successfully!");
};

run().catch((err) => {
  console.error("Error downloading/syncing images:", err);
  process.exit(1);
});
