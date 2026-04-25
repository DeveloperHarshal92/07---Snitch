import { useDispatch } from "react-redux";
import {
  createProduct,
  getSellerProducts,
  getAllProducts,
  getProductDetails,
  addProductVariant,
} from "../services/product.api";
import { setSellerProducts, setProducts } from "../state/product.slice";

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

  const handleGetAllProducts = async () => {
    const data = await getAllProducts();
    dispatch(setProducts(data.products));
    return data.products;
  };

  const handleGetProductDetails = async (productId) => {
    const data = await getProductDetails(productId);
    return data.product;
  };

  const handleAddProductVariant = async (productId, newProductVariant) => {
    const data = await addProductVariant(productId, newProductVariant);
    return data?.variant;
  };

  return {
    handleCreateProducts,
    handleGetSellerProducts,
    handleGetAllProducts,
    handleGetProductDetails,
    handleAddProductVariant,
  };
};
