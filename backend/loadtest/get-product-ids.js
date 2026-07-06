import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const outputFile = path.join(__dirname, 'seeded-product-ids.json');
const baseUrl = process.env.BASE_URL || 'http://localhost:3000/api';

async function main() {
  const response = await fetch(`${baseUrl}/products`);
  const payload = await response.json();

  if (!response.ok) {
    throw new Error(`Failed to fetch products: ${response.status} ${JSON.stringify(payload)}`);
  }

  const productIds = payload.products
    .map((product) => product._id)
    .filter(Boolean);

  if (productIds.length === 0) {
    throw new Error('No product IDs were found in the API response.');
  }

  await fs.writeFile(outputFile, `${JSON.stringify(productIds, null, 2)}\n`, 'utf8');
  console.log(`Saved ${productIds.length} product IDs to ${outputFile}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
