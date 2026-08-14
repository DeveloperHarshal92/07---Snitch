import axios from "axios";

const cartApiInstance = axios.create({
  baseURL: "/api/cart",
  withCredentials: true,
});

export const addToCart = async ({ productId, variantId }) => {
  try {
    const url = variantId
      ? `/add/${productId}/${variantId}`
      : `/add/${productId}`;
    const response = await cartApiInstance.post(url, { quantity: 1 });
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

export const removeFromCartApi = async ({ productId, variantId }) => {
  try {
    const url = variantId
      ? `/remove/${productId}/${variantId}`
      : `/remove/${productId}`;
    const response = await cartApiInstance.delete(url);
    return response.data;
  } catch (error) {
    console.log("Error while removing product from cart: ", error);
    throw error;
  }
};

export const incrementCartItemApi = async ({ productId, variantId }) => {
  try {
    const url = variantId
      ? `/quantity/increment/${productId}/${variantId}`
      : `/quantity/increment/${productId}`;
    const response = await cartApiInstance.patch(url);
    return response.data;
  } catch (error) {
    console.log("Error while incrementing cart item: ", error);
    throw error;
  }
};

export const decrementCartItemApi = async ({ productId, variantId }) => {
  try {
    const url = variantId
      ? `/quantity/decrement/${productId}/${variantId}`
      : `/quantity/decrement/${productId}`;
    const response = await cartApiInstance.patch(url);
    return response.data;
  } catch (error) {
    console.log("Error while decrementing cart item: ", error);
    throw error;
  }
};

export const createCartOrder = async (couponCode) => {
  try {
    const payload = couponCode ? { couponCode } : {};
    const response = await cartApiInstance.post("/payment/create/order", payload);
    return response.data;
  } catch (error) {
    console.log("Error while creating cart order: ", error);
    throw error;
  }
};

export const validateCoupon = async (code) => {
  try {
    const response = await cartApiInstance.post("/coupon/validate", { code });
    return response.data;
  } catch (error) {
    console.log("Error while validating coupon: ", error);
    throw error;
  }
};

export const verifyCartOrder = async ({
  razorpay_order_id,
  razorpay_payment_id,
  razorpay_signature,
}) => {
  try {
    const response = await cartApiInstance.post("/payment/verify/order", {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    });
    return response.data;
  } catch (error) {
    console.log("Error while verifying cart order: ", error);
    throw error;
  }
};

export const getOrders = async () => {
  try {
    const response = await cartApiInstance.get("/orders");
    return response.data;
  } catch (error) {
    console.log("Error while fetching orders: ", error);
    throw error;
  }
};

export const getOrderById = async (orderId) => {
  try {
    const response = await cartApiInstance.get(`/orders/${orderId}`);
    return response.data;
  } catch (error) {
    console.log("Error while fetching order details: ", error);
    throw error;
  }
};
