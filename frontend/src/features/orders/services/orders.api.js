import axios from "axios";

const ordersApiInstance = axios.create({
  baseURL: "/api/cart/orders",
  withCredentials: true,
});

const sellerOrdersApiInstance = axios.create({
  baseURL: "/api/cart/seller/orders",
  withCredentials: true,
});

export const getOrders = async () => {
  try {
    const response = await ordersApiInstance.get("/");
    return response.data;
  } catch (error) {
    console.log("Error while fetching orders: ", error);
    throw error;
  }
};

export const getOrderById = async (orderId) => {
  try {
    const response = await ordersApiInstance.get(`/${orderId}`);
    return response.data;
  } catch (error) {
    console.log("Error while fetching order details: ", error);
    throw error;
  }
};

export const getSellerOrders = async () => {
  try {
    const response = await sellerOrdersApiInstance.get("/");
    return response.data;
  } catch (error) {
    console.log("Error while fetching seller orders: ", error);
    throw error;
  }
};

export const getSellerOrderById = async (orderId) => {
  try {
    const response = await sellerOrdersApiInstance.get(`/${orderId}`);
    return response.data;
  } catch (error) {
    console.log("Error while fetching seller order details: ", error);
    throw error;
  }
};

