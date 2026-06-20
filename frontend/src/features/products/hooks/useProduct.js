import { useDispatch } from "react-redux";
import {
  createProduct,
  getSellerProducts,
  getAllProducts,
  getProductDetails,
  addProductVariant,
} from "../services/product.api";
import { setSellerProducts, setProducts } from "../state/product.slice";
import {
  getProductReviews as getProductReviewsApi,
  addReview as addReviewApi,
  editReview as editReviewApi,
  deleteReview as deleteReviewApi,
} from "../services/product.api";

import {
  setReviews,
  setReviewStats,
  addReviewToState,
  updateReviewInState,
  removeReviewFromState,
} from "../state/product.slice";

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

  const handleGetProductReviews = async (productId) => {
    try {
      const data = await getProductReviewsApi(productId);
      if (data?.success) {
        dispatch(setReviews(data.reviews));
        dispatch(setReviewStats(data.stats));
      }
    } catch (err) {
      console.error("Failed to fetch reviews:", err);
    }
  };

  const handleAddReview = async (productId, reviewData) => {
    const data = await addReviewApi(productId, reviewData);
    if (data?.success) {
      dispatch(addReviewToState(data.review));
    }
    return data;
  };

  const handleEditReview = async (reviewId, reviewData) => {
    const data = await editReviewApi(reviewId, reviewData);
    if (data?.success) {
      dispatch(updateReviewInState(data.review));
    }
    return data;
  };

  const handleDeleteReview = async (reviewId) => {
    const data = await deleteReviewApi(reviewId);
    if (data?.success) {
      dispatch(removeReviewFromState(reviewId));
    }
    return data;
  };

  return {
    handleCreateProducts,
    handleGetSellerProducts,
    handleGetAllProducts,
    handleGetProductDetails,
    handleAddProductVariant,
    handleGetProductReviews,
    handleAddReview,
    handleEditReview,
    handleDeleteReview,
  };
};
