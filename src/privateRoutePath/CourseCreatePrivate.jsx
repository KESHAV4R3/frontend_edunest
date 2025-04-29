import React from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
const CourseCreatePrivate = ({ children }) => {
  const user = useSelector((state) => state.profile.user);
  const role = (user && user.accountType) || "";
  if (role == "Instructor") {
    return children;
  }
  return <Navigate to="/" />;
};

export default CourseCreatePrivate;
