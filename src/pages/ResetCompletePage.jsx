import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const ResetCompletePage = () => {
  useEffect(() => {
    localStorage.removeItem("forgotPasswordEmail");
    localStorage.removeItem("forgotPassword");
  }, []);
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <div>
      <div className="w-[95%] max-w-[1100px] p-6 bg-gray-900 rounded-xl mx-auto mt-20 flex flex-col md:flex-row-reverse items-center justify-between mb-10">
        {/* Right Section - Image or Loading Animation */}
        <div className="w-full tablet2:w-1/2 flex justify-center p-5 relative">
          {!imageLoaded && (
            <div className="w-[90%] max-w-[400px] h-[250px] flex items-center justify-center">
                 <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-600"></div>
            </div>
          )}
          <img
            src="https://res.cloudinary.com/dort5nnis/image/upload/v1742005223/erasebg-transformed_4_x45crz.png"
            className={`rounded-2xl w-[90%] max-w-[400px] h-auto object-contain transition-opacity duration-500 ${
              imageLoaded ? "opacity-100" : "opacity-0"
            }`}
            alt="Secure Login"
            onLoad={() => setImageLoaded(true)}
            style={{ display: imageLoaded ? "block" : "none" }} // Hide image until loaded
          />
        </div>

        {/* Left Section - Reset Form */}
        <div className="w-full tablet2:w-1/2 p-2 flex flex-col gap-6 text-center tablet2:text-left">
          <div className="w-full p-4 tablet2:p-10 rounded-xl shadow-lg">
            <h2 className="text-[32px] tablet:text-[40px] font-bold text-white">
              Reset Complete
            </h2>
            <p className="text-gray-400 text-[18px] mt-3 tablet2:w-[85%] mx-auto md:mx-0">
              All done! we have send an email to your mail
            </p>

            {/* Form */}
            <div className="flex flex-col gap-4 mt-10 text-center w-full tablet2:max-w-[400px] mx-auto md:mx-0">
              <Link to="/login"
                type="submit"
                className="mt-4 bg-dark_red text-white font-semibold p-3 rounded-lg hover:bg-dark_red/80 transition-all duration-300"
              >
                Return to login
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetCompletePage;
