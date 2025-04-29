import React from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const ViewAllCatagory = () => {
  const navigate = useNavigate();
  const catagories = useSelector((state) => state.application.catagories);
  function clickhandler(catagories) {
    navigate(`/category/${catagories.name}?catagory_id=${catagories._id}`)
  }
  return (
    <div className="min-h-screen w-full bg-dark_bg">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-300">All Catagories</h1>
        </div>

        {catagories.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-300 text-lg">No catagories available</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {catagories.map((catagory, index) => (
              <div
                key={index}
                onClick={()=>{clickhandler(catagory)}}
                className="bg-gray-700 hover:scale-102 cursor-pointer rounded-lg shadow-sm p-6 hover:shadow-md transition-all duration-200 flex items-center justify-center min-h-[120px]"
              >
                <h2 className="text-lg font-medium text-gray-300 text-center">
                  {catagory.name}
                </h2>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewAllCatagory;
