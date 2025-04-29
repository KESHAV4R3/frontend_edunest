import React, { useState, useCallback } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FaArrowLeftLong } from "react-icons/fa6";
import { toast } from "react-toastify";
import { apiConnector } from "../services/apiConnector";
import { apiLinks } from "../services/apiLink";
import { IoIosSend } from "react-icons/io";
const ResendEmailPage = () => {
  const [email, setEmail] = useState(
    () => localStorage.getItem("forgotPasswordEmail") || ""
  );
  const [imageLoaded, setImageLoaded] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();

    try {
      localStorage.setItem("forgotPasswordEmail", email);
      const response = await apiConnector(
        "POST",
        apiLinks.resetPassword,
        null,
        {
          email,
        }
      );
      if (!response.success) {
        toast.error(response.message, {
          autoClose: 900,
          hideProgressBar: true,
          pauseOnHover: false,
          closeOnClick: true,
          draggable: false,
        });
        setLoading(false);
        return;
      } else {
        toast.success("Password reset link sent to your email", {
          autoClose: 900,
          hideProgressBar: true,
          pauseOnHover: false,
          closeOnClick: true,
          draggable: false,
        });
        setEmail("");
        setLoading(false);
        return;
      }
    } catch (error) {}
  };

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
            src="https://res.cloudinary.com/dort5nnis/image/upload/v1742005348/erasebg-transformed_5_cvbpkc.png"
            className={`rounded-2xl w-[90%] max-w-[400px] h-auto object-contain transition-opacity duration-500 ${
              imageLoaded ? "opacity-100" : "opacity-0"
            }`}
            alt="Secure Login"
            onLoad={() => setImageLoaded(true)}
            style={{ display: imageLoaded ? "block" : "none" }}
          />
        </div>

        {/* Left Section - Reset Form */}
        <div className="w-full tablet2:w-1/2 p-2 flex flex-col gap-3 text-center tablet2:text-left">
          <div className="w-full p-4 tablet2:p-10 rounded-xl shadow-lg">
            <h2 className="text-[32px] tablet:text-[40px] font-bold text-white">
              Check mail
            </h2>
            <p className="text-gray-400 text-[18px] mt-3 tablet2:w-[85%] mx-auto md:mx-0">
              We have sent the reset link to your email:
              <br />
              <strong>{email}</strong>
            </p>

            <div className="flex flex-col gap-4 mt-5 text-center w-full tablet2:max-w-[400px] mx-auto md:mx-0">
              <button
                type="submit"
                disabled={loading}
                onClick={handleSubmit}
                className="w-full flex justify-center items-center py-2 px-4 bg-dark_red hover:bg-dark_red/80 cursor-pointer text-white font-medium rounded-md transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <>
                    <IoIosSend className="mr-2" />
                    Resend Link
                  </>
                )}
              </button>

              <Link
                to="/login"
                className="text-gray-300 flex justify-center tablet2:justify-start items-center gap-3 hover:text-dark_red text-[16px] cursor-pointer"
              >
                <FaArrowLeftLong />
                Back to Login
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResendEmailPage;
