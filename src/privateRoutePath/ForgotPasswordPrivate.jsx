import React from "react";
import { Navigate } from "react-router-dom";
const ForgotPasswordPrivate = ({ children }) => {
  if (localStorage.getItem("forgotPasswordEmail")) {
    return children;
  }
  return <Navigate to="/" />;
};

export default ForgotPasswordPrivate;
