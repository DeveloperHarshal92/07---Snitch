import axios from "axios";
// Triggering Vite HMR

const productApiInstance = axios.create({
  baseURL: "/api/products",
  withCredentials: true,
});

const reviewApiInstance = axios.create({
  baseURL: "/api/reviews",
  withCredentials: true,
});

// ── Product APIs ─────────────────────────────────────────────────
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
    let formData;
    if (newProductVariant instanceof FormData) {
      formData = newProductVariant;
    } else {
      formData = new FormData();
      if (Array.isArray(newProductVariant?.images)) {
        newProductVariant.images.forEach((image) => {
          const file = image?.file || image;
          if (file instanceof Blob || file instanceof File) {
            formData.append("images", file);
          }
        });
      }
      formData.append("stock", newProductVariant?.stock ?? 0);
      const priceVal =
        newProductVariant?.price?.amount ??
        newProductVariant?.priceAmount ??
        newProductVariant?.price ??
        0;
      formData.append("price", priceVal);
      formData.append("priceAmount", priceVal);
      const currencyVal =
        newProductVariant?.price?.currency ??
        newProductVariant?.priceCurrency ??
        newProductVariant?.currency ??
        "INR";
      formData.append("currency", currencyVal);
      formData.append("priceCurrency", currencyVal);
      if (newProductVariant?.attributes) {
        formData.append(
          "attributes",
          typeof newProductVariant.attributes === "string"
            ? newProductVariant.attributes
            : JSON.stringify(newProductVariant.attributes)
        );
      }
    }

    const response = await productApiInstance.post(
      `/${productId}/variants`,
      formData,
    );
    return response.data;
  } catch (error) {
    console.error("Error adding product variant:", error);
    throw error;
  }
};

// ── Review APIs ──────────────────────────────────────────────────
 
export const getProductReviews = async (productId) => {
  try {
    const response = await reviewApiInstance.get(`/${productId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching reviews:", error);
    throw error;
  }
};
 
export const addReview = async (productId, reviewData) => {
  try {
    const response = await reviewApiInstance.post(`/${productId}`, reviewData);
    return response.data;
  } catch (error) {
    console.error("Error adding review:", error);
    throw error;
  }
};
 
export const editReview = async (reviewId, reviewData) => {
  try {
    const response = await reviewApiInstance.put(`/${reviewId}`, reviewData);
    return response.data;
  } catch (error) {
    console.error("Error editing review:", error);
    throw error;
  }
};
 
export const deleteReview = async (reviewId) => {
  try {
    const response = await reviewApiInstance.delete(`/${reviewId}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting review:", error);
    throw error;
  }
};
