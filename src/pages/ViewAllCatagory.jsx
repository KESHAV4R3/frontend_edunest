import React from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const ViewAllCategory = React.memo(() => {
  const navigate = useNavigate();
  const categories = useSelector((state) => state.application.catagories);

  const handleClick = (category) => {
    navigate(`/category/${category.name}?catagory_id=${category._id}`);
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-gray-900 via-gray-950 to-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-14">
          <h1 className="text-4xl sm:text-5xl font-bold text-white tracking-wide">
            Explore All Categories
          </h1>
          <p className="mt-3 text-gray-400 text-lg max-w-2xl mx-auto">
            Discover collections from a variety of genres and product types.
          </p>
        </div>

        {categories.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-300 text-xl">No categories available</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10">
            {categories.map((category) => (
              <div
                key={category._id}
                onClick={() => handleClick(category)}
                className="group relative cursor-pointer rounded-xl overflow-hidden bg-gray-800 hover:bg-gray-700 transition duration-300 shadow-lg hover:shadow-2xl flex items-center justify-center h-40"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-purple-600/20 to-blue-500/10 group-hover:from-purple-600/30 group-hover:to-blue-500/20 transition-all duration-300" />
                <h2 className="z-10 text-white text-xl font-semibold text-center px-4">
                  {category.name}
                </h2>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
});

export default ViewAllCategory;
