import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const NonLoggedInPrivate = ({ children, dashboard }) => {
  const user = useSelector((state) => state.profile.user);

  if (dashboard) {
    return user != null ? children : <Navigate to="/" />;
  } else {
    return user ? <Navigate to="/" /> : children;
  }
};

export default NonLoggedInPrivate;
