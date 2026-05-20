import React from "react";
import { Outlet } from "react-router";
import Nav from "../features/Shared/components/Nav";
import Marquee from "../features/Shared/components/Marquee";

const AppLayout = () => {
  return (
    <>
      <Nav />
      <Marquee/>
      <Outlet />
    </>
  );
};

export default AppLayout;
