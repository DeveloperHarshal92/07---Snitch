import {addToCart, getCart} from "../services/cart.api";
import { useDispatch } from "react-redux";
import { addToCart as addToCartAction, setItems } from "../state/cart.slice";

export const useCart = () => {
    const dispatch = useDispatch();

    const handleAddToCart = async ({ productId, variantId }) => {
        try {
            const data = await addToCart({ productId, variantId });
            // Since the backend doesn't return the updated cart, fetch it to sync state
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

    return {
        handleAddToCart,
        handleGetCart,
    };
};