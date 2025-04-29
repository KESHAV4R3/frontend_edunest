import React from "react";
import { Link } from "react-router-dom";
const Button = ({ data, color, path }) => {
  return (
    <div>
      <Link to={path}>
        <button
          className={`hover:scale-105 font-[700] transition-all duration-200 cursor-pointer flex items-center gap-3 text-[18px] text-white border ${
            color == "red"
              ? "bg-dark_red hover:bg-[#CF1020]/97"
              : "bg-gray-800 hover:bg-gray-800/97"
          } border-0 rounded-md tablet:px-7 px-4 tablet:py-3 py-2`}
        >
          {data}
        </button>
      </Link>
    </div>
  );
};

export default Button;
