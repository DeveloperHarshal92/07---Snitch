import { createBrowserRouter } from "react-router";
import Register from "../features/auth/pages/Register";
import Login from "../features/auth/pages/Login";
import CreateProduct from "../features/products/pages/CreateProduct";
import Dashboard from "../features/products/pages/Dashboard";
import Protected from "../features/auth/components/Protected";
import Home from "../features/products/pages/Home";
import ProductDetail from "../features/products/pages/ProductDetail";
import SellerProductDetails from "../features/products/pages/SellerProductDetails";
import SellerOrders from "../features/orders/pages/SellerOrders";
import SellerOrderDetail from "../features/orders/pages/SellerOrderDetail";
import Cart from "../features/cart/pages/Cart";
import OrderSuccess from "../features/cart/pages/OrderSuccess";
import OrderList from "../features/orders/pages/OrderList";
import OrderDetail from "../features/orders/pages/OrderDetail";
import NotFound from "../features/Shared/pages/NotFound";
import AppLayout from "./AppLayout";

export const routes = createBrowserRouter([
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    element: <AppLayout />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/seller",
        children: [
          {
            path: "/seller/create-product",
            element: (
              <Protected role="seller">
                <CreateProduct />
              </Protected>
            ),
          },
          {
            path: "/seller/dashboard",
            element: (
              <Protected role="seller">
                <Dashboard />
              </Protected>
            ),
          },
          {
            path: "/seller/orders",
            element: (
              <Protected role="seller">
                <SellerOrders />
              </Protected>
            ),
          },
          {
            path: "/seller/orders/:orderId",
            element: (
              <Protected role="seller">
                <SellerOrderDetail />
              </Protected>
            ),
          },
        ],
      },
      {
        path: "/product/:productId",
        element: <ProductDetail />,
      },
      {
        path: "/seller/product/:productId",
        element: (
          <Protected role="seller">
            <SellerProductDetails />
          </Protected>
        ),
      },
      {
        path: "/cart",
        element: (
          <Protected role="buyer">
            <Cart />
          </Protected>
        ),
      },
      {
        path: "/orders-success",
        element: (
          <Protected role="buyer">
            <OrderSuccess />
          </Protected>
        ),
      },
      {
        path: "/orders",
        element: (
          <Protected role="buyer">
            <OrderList />
          </Protected>
        ),
      },
      {
        path: "/orders/:orderId",
        element: (
          <Protected role="buyer">
            <OrderDetail />
          </Protected>
        ),
      },
      {
        path: "*",
        element: <NotFound />,
      },
    ],
  },
]);
