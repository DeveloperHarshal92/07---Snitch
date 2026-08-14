import { useState } from "react";
import { getOrders, getOrderById } from "../services/orders.api";

export const useOrders = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleGetOrders = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getOrders();
      return data.orders ?? [];
    } catch (err) {
      console.log("Error while fetching orders: ", err);
      setError(err?.response?.data?.message || err.message || "Failed to load orders");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const handleGetOrderDetails = async (orderId) => {
    setLoading(true);
    setError(null);
    try {
      const data = await getOrderById(orderId);
      return data.order ?? null;
    } catch (err) {
      console.log("Error while fetching order details: ", err);
      setError(err?.response?.data?.message || err.message || "Failed to load order details");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    handleGetOrders,
    handleGetOrderDetails,
  };
};
