import axios from "axios";

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
