import imageKit, { ImageKit } from "@imagekit/nodejs";
import { config } from "../config/config.js";

const client = new ImageKit({
  publicKey: config.IMAGEKIT_PUBLIC_KEY,
  privateKey: config.IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: config.IMAGEKIT_URL_ENDPOINT,
});

export async function uploadFile({ buffer, fileName, folder = "Snitch" }) {
  try {
    const result = await client.files.upload({
      file: await imageKit.toFile(buffer),
      fileName,
      folder,
    });
    return result;
  } catch (err) {
    throw err;
  }
}
