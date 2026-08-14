import React from "react";
import { Outlet } from "react-router";
import Nav from "../features/Shared/components/Nav";

const AppLayout = () => {
  return (
    <>
      <Nav />
      <Outlet />
    </>
  );
};

export default AppLayout;
