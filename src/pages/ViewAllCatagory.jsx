import React, { useCallback, memo } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { BiCategoryAlt } from "react-icons/bi";

const ViewAllCategory = memo(() => {
  const navigate = useNavigate();
  // Safe selector fallback
  const categories = useSelector((state) => state.application.catagories) || [];

  // Memoized navigation handler
  const handleCategoryClick = useCallback((category) => {
    navigate(`/category/${category.name}?catagory_id=${category._id}`);
  }, [navigate]);

  return (
    <div className="w-full md:pt-10 mx-auto p-4 md:p-8 flex flex-col min-h-screen bg-gray-900 text-gray-100">
      
      {/* --- Page Header --- */}
      <div className="text-center mb-12">
        <h1 className="text-3xl md:text-4xl font-black tracking-tight uppercase">
          EXPLORE ALL <span className="text-red-600 ml-2">CATEGORIES</span>
        </h1>
        <p className="text-[13px] text-gray-500 font-black uppercase mt-2 max-w-xl mx-auto leading-relaxed">
          Discover specialized collections across all academic and professional sectors
        </p>
      </div>

      {/* --- Category Grid (Flex Wrap) --- */}
      <div className="flex-1">
        {categories.length === 0 ? (
          <div className="py-40 text-center">
            <p className="text-gray-500 font-bold tracking-widest uppercase italic">
              No categories currently available
            </p>
          </div>
        ) : (
          <div className="flex flex-wrap justify-center gap-6 pb-20">
            {categories.map((category) => (
              <div
                key={category._id}
                onClick={() => handleCategoryClick(category)}
                className="group relative cursor-pointer bg-gray-800 border border-gray-700 rounded-xl w-full max-w-[280px] h-32 flex flex-col items-center justify-center transition-all duration-300 hover:border-red-600/50 hover:shadow-xl hover:shadow-black/60 hover:-translate-y-1"
              >
                {/* Background red glow on hover */}
                <div className="absolute inset-0 bg-red-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl" />
                
                <BiCategoryAlt className="text-gray-600 group-hover:text-red-600 text-2xl mb-2 transition-colors duration-300" />
                
                <h2 className="z-10 text-gray-100 text-md font-black text-center px-4 uppercase tracking-tight group-hover:text-white">
                  {category.name}
                </h2>

                <div className="mt-2 text-[11px] font-black text-gray-500 tracking-widest opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                  Browse Sector
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
});

export default ViewAllCategory;