import axios from "axios";

const ordersApiInstance = axios.create({
  baseURL: "/api/cart/orders",
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
