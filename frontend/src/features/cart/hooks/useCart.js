import {
  addToCart,
  getCart,
  removeFromCartApi,
  incrementCartItemApi,
  decrementCartItemApi,
} from "../services/cart.api";
import { useDispatch } from "react-redux";
import { setItems } from "../state/cart.slice";

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
      dispatch(setItems(data.cart.items));
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

  return {
    handleAddToCart,
    handleGetCart,
    handleRemoveFromCart,
    handleIncrementCartItem,
    handleDecrementCartItem,
  };
};