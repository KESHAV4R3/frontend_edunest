import { useState, useMemo } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { FaArrowLeftLong } from "react-icons/fa6";
import { Link } from "react-router-dom";
import { apiConnector } from "../services/apiConnector";
import { apiLinks } from "../services/apiLink";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { IoShieldCheckmarkSharp } from "react-icons/io5";

const CreateNewPassword = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [newPasswordData, setNewPasswordData] = useState({
    password: "",
    confirmPassword: "",
  });

  // update change
  function updateChange(event) {
    setNewPasswordData((prevData) => {
      return {
        ...prevData,
        [event.target.name]: event.target.value,
      };
    });
  }

  // submit handler
  async function handleSubmit(event) {
    event.preventDefault();
    setLoading(true);
    try {
      const email = localStorage.getItem("forgotPasswordEmail");
      const response = await apiConnector(
        "PUT",
        apiLinks.updatePassword,
        null,
        {
          email,
          password: newPasswordData.password,
          confirmPassword: newPasswordData.confirmPassword,
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
        toast.success("Password updated successfully", {
          autoClose: 900,
          hideProgressBar: true,
          pauseOnHover: false,
          closeOnClick: true,
          draggable: false,
        });
        navigate("/reset-complete");
        setLoading(false);
        return;
      }
    } catch (error) {
      console.log(error.message);
    } finally {
      setLoading(false);
    }
  }

  // Password validation rules using useMemo to avoid recalculating on every render
  const passwordValidation = useMemo(() => {
    const hasLowerCase = /[a-z]/.test(newPasswordData.password);
    const hasUpperCase = /[A-Z]/.test(newPasswordData.password);
    const hasNumber = /[0-9]/.test(newPasswordData.password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(
      newPasswordData.password
    );
    const hasMinLength = newPasswordData.password.length >= 8;
    const passwordsMatch =
      newPasswordData.password === newPasswordData.confirmPassword &&
      newPasswordData.confirmPassword !== "";

    return {
      hasLowerCase,
      hasUpperCase,
      hasNumber,
      hasSpecialChar,
      hasMinLength,
      passwordsMatch,
      isValid:
        hasLowerCase &&
        hasUpperCase &&
        hasNumber &&
        hasSpecialChar &&
        hasMinLength &&
        passwordsMatch,
    };
  }, [newPasswordData.password, newPasswordData.confirmPassword]);

  const {
    hasLowerCase,
    hasUpperCase,
    hasNumber,
    hasSpecialChar,
    hasMinLength,
    passwordsMatch,
    isValid,
  } = passwordValidation;

  return (
    <div>
      <div className="w-[95%] p-6 bg-gray-900 rounded-xl m-auto mt-10 flex flex-col md:flex-row-reverse items-center max-w-[1100px] mb-10">
        {/* Right Section - Image */}

        <div className="w-full tablet2:w-1/2 flex justify-center p-5">
          {!imageLoaded && (
            <div className="w-[90%] max-w-[400px] h-[250px] flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-600"></div>
            </div>
          )}
          <img
            src="https://res.cloudinary.com/dort5nnis/image/upload/v1741922666/erasebg-transformed_ilgu8m.png"
            className={`rounded-2xl w-[90%] max-w-[400px] h-auto object-contain transition-opacity duration-500 ${
              imageLoaded ? "opacity-100" : "opacity-0"
            }`}
            alt="Secure Login"
            onLoad={() => setImageLoaded(true)}
            style={{ display: imageLoaded ? "block" : "none" }} // Hide image until loaded
          />
        </div>

        {/* Left Section - Create New Password Form */}
        <div className="w-full md:w-[70%] min-w-0 p-2 md:p-5 flex flex-col gap-6 text-center md:text-left">
          <div className="w-full p-8 tablet2:pl-15 bg-gray-800 rounded-xl shadow-lg">
            <h2 className="text-[32px] tablet:text-[40px] font-bold text-white">
              Create New Password
            </h2>
            <p className="text-gray-400 text-[16px] mt-3 md:w-[85%] mx-auto md:mx-0">
              Your new password must be different from your previously used
              passwords.
            </p>

            {/* Form */}
            <form className="flex flex-col gap-4 mt-6 text-center w-full md:max-w-[400px] mx-auto md:mx-0">
              {/* New Password Input */}
              <label
                htmlFor="password"
                className="text-start text-gray-300 font-medium"
              >
                New Password <span className="text-dark_red">*</span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  placeholder="Enter your new password"
                  className="p-3 w-full border text-gray-300 border-gray-600 rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-700 bg-transparent pr-10"
                  autoComplete="off"
                  value={newPasswordData.password}
                  required
                  onChange={updateChange}
                />
                {/* Show/Hide Password Button */}

                <button
                  type="button"
                  className="cursor-pointer absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-white"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>

              {/* Confirm Password Input */}
              <label
                htmlFor="confirmPassword"
                className="text-start text-gray-300 font-medium mt-4"
              >
                Confirm Password <span className="text-dark_red">*</span>
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  id="confirmPassword"
                  name="confirmPassword"
                  placeholder="Confirm your new password"
                  className="p-3 w-full border text-gray-300 border-gray-600 rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-700 bg-transparent pr-10"
                  autoComplete="off"
                  value={newPasswordData.confirmPassword}
                  required
                  onChange={updateChange}
                />
                {/* Show/Hide Confirm Password Button */}
                <button
                  type="button"
                  className="cursor-pointer absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-white"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>

              {/* Password Validation Rules */}
              <div className="grid grid-cols-2 gap-2 text-start text-sm mt-4">
                {/* Column 1 */}
                <div
                  className={`select-none flex items-center gap-2 ${
                    hasLowerCase ? "text-[#7FFF00]" : "text-gray-400"
                  }`}
                >
                  <div className="w-4 h-4 border border-gray-400 rounded-full flex items-center justify-center">
                    {hasLowerCase && (
                      <div className="w-2 h-2 bg-[#7FFF00] rounded-full"></div>
                    )}
                  </div>
                  <span>Lowercase letter</span>
                </div>
                <div
                  className={`select-none flex items-center gap-2 ${
                    hasUpperCase ? "text-[#7FFF00]" : "text-gray-400"
                  }`}
                >
                  <div className="w-4 h-4 border border-gray-400 rounded-full flex items-center justify-center">
                    {hasUpperCase && (
                      <div className="w-2 h-2 bg-[#7FFF00] rounded-full"></div>
                    )}
                  </div>
                  <span>Uppercase letter</span>
                </div>
                <div
                  className={`select-none flex items-center gap-2 ${
                    hasNumber ? "text-[#7FFF00]" : "text-gray-400"
                  }`}
                >
                  <div className="w-4 h-4 border border-gray-400 rounded-full flex items-center justify-center">
                    {hasNumber && (
                      <div className="w-2 h-2 bg-[#7FFF00] rounded-full"></div>
                    )}
                  </div>
                  <span>Number</span>
                </div>

                {/* Column 2 */}
                <div
                  className={`select-none flex items-center gap-2 ${
                    hasSpecialChar ? "text-[#7FFF00]" : "text-gray-400"
                  }`}
                >
                  <div className="w-4 h-4 border border-gray-400 rounded-full flex items-center justify-center">
                    {hasSpecialChar && (
                      <div className="w-2 h-2 bg-[#7FFF00] rounded-full"></div>
                    )}
                  </div>
                  <span>Special character</span>
                </div>
                <div
                  className={`select-none flex items-center gap-2 ${
                    hasMinLength ? "text-[#7FFF00]" : "text-gray-400"
                  }`}
                >
                  <div className="w-4 h-4 border border-gray-400 rounded-full flex items-center justify-center">
                    {hasMinLength && (
                      <div className="w-2 h-2 bg-[#7FFF00] rounded-full"></div>
                    )}
                  </div>
                  <span>8+ characters</span>
                </div>
              </div>

              {/* Confirm Password Match Check */}
              {newPasswordData.confirmPassword && (
                <p
                  className={`select-none text-start text-sm ${
                    passwordsMatch ? "text-[#7FFF00]" : "text-red-500"
                  }`}
                >
                  {passwordsMatch
                    ? "Passwords match!"
                    : "Passwords do not match."}
                </p>
              )}

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
                    <IoShieldCheckmarkSharp className="mr-2" />
                    Update Password
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

export default CreateNewPassword;
