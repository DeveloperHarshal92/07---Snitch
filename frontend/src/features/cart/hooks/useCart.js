import {
  addToCart,
  getCart,
  removeFromCartApi,
  incrementCartItemApi,
  decrementCartItemApi,
  createCartOrder,
  verifyCartOrder
} from "../services/cart.api";
import { useDispatch } from "react-redux";
import { setCart } from "../state/cart.slice";

export const useCart = () => {
  const dispatch = useDispatch();

  const handleAddToCart = async ({ productId, variantId }) => {
    try {
      const data = await addToCart({ productId, variantId });
      await handleGetCart();
      return data;
    } catch (error) {
      console.log("Error while adding product to cart: ", error);
      throw error;
    }
  };

  const handleGetCart = async () => {
    try {
      const data = await getCart();
      // Aggregation pipeline returns cart as an array; grab first element's items
      const cartDoc = Array.isArray(data.cart) ? data.cart[0] : data.cart;
      dispatch(setCart({
        totalPrice: cartDoc?.totalPrice ?? 0,
        currency: cartDoc?.currency ?? "INR",
        items: cartDoc?.items ?? []
      }));
      return data;
    } catch (error) {
      console.log("Error while fetching cart: ", error);
      throw error;
    }
  };

  const handleRemoveFromCart = async ({ productId, variantId }) => {
    try {
      const data = await removeFromCartApi({ productId, variantId });
      await handleGetCart();
      return data;
    } catch (error) {
      console.log("Error while removing cart item: ", error);
      throw error;
    }
  };

  const handleIncrementCartItem = async ({ productId, variantId }) => {
    try {
      const data = await incrementCartItemApi({ productId, variantId });
      await handleGetCart();
      return data;
    } catch (error) {
      console.log("Error while incrementing cart item: ", error);
      throw error;
    }
  };

  const handleDecrementCartItem = async ({ productId, variantId }) => {
    try {
      const data = await decrementCartItemApi({ productId, variantId });
      await handleGetCart();
      return data;
    } catch (error) {
      console.log("Error while decrementing cart item: ", error);
      throw error;
    }
  };

  const handleCreateCartOrder = async () => {
    try {
      const data = await createCartOrder();
      return data;
    } catch (error) {
      console.log("Error while creating cart order: ", error);
      throw error;
    }
  };  

  const handleVerifyCartOrder = async ({razorpay_order_id, razorpay_payment_id, razorpay_signature}) => {
    try {
      const data = await verifyCartOrder({razorpay_order_id, razorpay_payment_id, razorpay_signature});
      return data.success;
    } catch (error) {
      console.log("Error while verifying cart order: ", error);
      throw error;
    }
  };  

  return {
    handleAddToCart,
    handleGetCart,
    handleRemoveFromCart,
    handleIncrementCartItem,
    handleDecrementCartItem,
    handleCreateCartOrder,
    handleVerifyCartOrder,
  };
};