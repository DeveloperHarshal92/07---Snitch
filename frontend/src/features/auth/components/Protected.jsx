import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router";

const Protected = ({ children, role = "buyer" }) => {
  const user = useSelector((state) => state.auth.user);
  const loading = useSelector((state) => state.auth.loading);

  if (loading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{
          backgroundColor: "#fbf9f6",
          fontFamily: "'Inter', sans-serif",
        }}
      >
        <div className="flex flex-col items-center gap-3">
          <div
            className="w-7 h-7 rounded-full border-2 border-t-transparent animate-spin"
            style={{ borderColor: "#C9A96E", borderTopColor: "transparent" }}
          />
          <span
            className="text-[0.65rem] tracking-[0.2em] uppercase font-medium"
            style={{ color: "#6b6158" }}
          >
            Authenticating
          </span>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (role && user.role !== role) {
    return <Navigate to={user.role === "seller" ? "/seller/dashboard" : "/"} replace />;
  }

  return children;
};

export default Protected;

