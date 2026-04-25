import axios from "axios";
// Triggering Vite HMR

const productApiInstance = axios.create({
  baseURL: "/api/products",
  withCredentials: true,
});

export const createProduct = async (productData) => {
  try {
    const response = await productApiInstance.post("/", productData);
    return response.data;
  } catch (error) {
    console.error("Error creating product:", error);
  }
};

export const getSellerProducts = async () => {
  try {
    const response = await productApiInstance.get("/seller");
    return response.data;
  } catch (error) {
    console.error("Error fetching seller products:", error);
  }
};

export const getAllProducts = async () => {
  try {
    const response = await productApiInstance.get("/");
    return response.data;
  } catch (error) {
    console.error("Error fetching all products:", error);
  }
};

export const getProductDetails = async (productId) => {
  try {
    const response = await productApiInstance.get(`/detail/${productId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching product details:", error);
  }
};

export const addProductVariant = async (productId, newProductVariant) => {
  try {
    const formData = new FormData();
    newProductVariant.images.forEach((image) => {
      formData.append(`images`, image.file);
    });
    formData.append("stock", newProductVariant.stock);
    formData.append("price", newProductVariant.price.amount);
    formData.append("currency", newProductVariant.price.currency);
    formData.append("attributes", JSON.stringify(newProductVariant.attributes));
    const response = await productApiInstance.post(
      `/${productId}/variants`,
      formData,
    );
    return response.data;
  } catch (error) {
    console.error("Error adding product variant:", error);
  }
};
