import axios from "axios";

const cartApiInstance = axios.create({
  baseURL: "/api/cart",
  withCredentials: true,
});

export const addToCart = async ({ productId, variantId }) => {
  try {
    const url = variantId ? `/add/${productId}/${variantId}` : `/add/${productId}`;
    const response = await cartApiInstance.post(
      url,
      { quantity: 1 },
    );
    return response.data;
  } catch (error) {
    console.log("Error while adding product to cart: ", error);
    throw error;
  }
};
export const getCart = async () => {
  try {
    const response = await cartApiInstance.get("/");
    return response.data;
  } catch (error) {
    console.log("Error while fetching cart: ", error);
    throw error;
  }
};
