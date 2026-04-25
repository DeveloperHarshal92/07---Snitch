import React, { useEffect } from "react";
import "./App.css";
import { RouterProvider } from "react-router";
import { routes } from "./app.routes";
import { useAuth } from "../features/auth/hooks/useAuth";

const App = () => {
  const { handleGetMe } = useAuth();

  useEffect(() => {
    handleGetMe();
  }, []);
  
  return <RouterProvider router={routes} />;
};

export default App;
