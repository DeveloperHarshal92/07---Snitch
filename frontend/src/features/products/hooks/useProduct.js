import { useDispatch } from "react-redux";
import { createProduct, getSellerProducts } from "../services/product.api";
import { setSellerProducts } from "../state/product.slice";

export const useProduct = () => {
  const dispatch = useDispatch();

  const handleCreateProducts = async (productData) => {
    const data = await createProduct(productData);
    return data.product;
  };

  const handleGetSellerProducts = async () => {
    const data = await getSellerProducts();
    dispatch(setSellerProducts(data.products));
    return data.products;
  };

  return { handleCreateProducts, handleGetSellerProducts };
};
