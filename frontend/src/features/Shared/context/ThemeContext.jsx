import React from "react";
import { useTheme } from "../hooks/useTheme";

export { useTheme };

export const ThemeProvider = ({ children }) => {
  return <>{children}</>;
};
