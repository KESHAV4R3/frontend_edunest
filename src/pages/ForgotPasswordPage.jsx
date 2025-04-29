import { FaArrowLeftLong } from "react-icons/fa6";
import { useState } from "react";
import { Link } from "react-router-dom";
import { apiConnector } from "../services/apiConnector";
import { apiLinks } from "../services/apiLink";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { MdLockReset } from "react-icons/md";

const ForgotPasswordPage = () => {
  const user = useSelector((state) => state.profile.user);
  const navigate = useNavigate();
  const [email, setEmail] = useState((user && user.email) || "");
  const [imageLoaded, setImageLoaded] = useState(false);
  const [loading, setLoading] = useState(false);

  // update email
  const updateEmail = (e) => {
    setEmail(e.target.value);
  };
  // server connection
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
        toast.success("Password reset link sent to your email");
        setEmail("");
        navigate("/resend-email");
        setLoading(false);
        return;
      }
    } catch (error) {}
  };

  return (
    <div>
      <div className="w-[95%] max-w-[1100px] mx-auto mt-20 mb-10 p-6 bg-gray-900 rounded-xl flex flex-col md:flex-row-reverse items-center justify-between">
        {/* Right Section - Image or Loading Animation */}
        <div className="w-full tablet2:w-1/2 flex justify-center p-5 relative">
          {!imageLoaded && (
            <div className="w-[90%] max-w-[400px] h-[250px] flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-600"></div>
            </div>
          )}
          <img
            src="https://res.cloudinary.com/dort5nnis/image/upload/v1741957025/erasebg-transformed_1_yk1jir.png"
            className={`rounded-2xl w-[90%] max-w-[400px] h-auto object-contain transition-opacity duration-500 ${
              imageLoaded ? "opacity-100" : "opacity-0"
            }`}
            alt="Secure Login"
            onLoad={() => setImageLoaded(true)}
            style={{ display: imageLoaded ? "block" : "none" }} // Hide image until loaded
          />
        </div>

        {/* Left Section - Reset Form */}
        <div className="w-full tablet2:w-[70%] p-5 flex flex-col gap-6 text-center tablet2:text-left">
          <div className="w-full p-6 tablet2:p-10 rounded-xl shadow-lg bg-gray-800">
            <h2 className="text-[32px] tablet:text-[40px] font-bold text-white">
              Reset Your Password
            </h2>
            <p className="text-gray-400 text-[16px] mt-3 tablet2:w-[85%] mx-auto md:mx-0">
              No worries! We'll email you instructions to reset your password.
              If you don’t have access to your email, we can try account
              recovery.
            </p>

            {/* Form */}
            <form className="flex flex-col gap-4 mt-8 w-full tablet2:max-w-[400px] mx-auto md:mx-0">
              <label htmlFor="email" className="text-gray-300 font-medium">
                Email Address <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                id="email"
                placeholder="Enter your email"
                className="p-3 border border-gray-600 text-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-700 bg-transparent"
                autoComplete="off"
                aria-label="Enter your email"
                value={email}
                onChange={updateEmail}
              />

              {/* Reset Button */}
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
                    <MdLockReset className="mr-2" />
                    Reset Password
                  </>
                )}
              </button>

              {/* Back to Login */}
              <Link
                to="/login"
                className="text-gray-300 flex justify-start items-center gap-2 hover:text-red-500 text-[16px] cursor-pointer"
              >
                <FaArrowLeftLong />
                Back to Login
              </Link>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
