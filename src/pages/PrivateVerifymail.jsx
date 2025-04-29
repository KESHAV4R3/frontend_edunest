import React from "react";
import { Navigate } from "react-router-dom";

const PrivateVerifymail = ({ children }) => {
  if (localStorage.getItem("registrationData")) {
    return children;
  }
  return <Navigate to="/" />;
};

export default PrivateVerifymail;
