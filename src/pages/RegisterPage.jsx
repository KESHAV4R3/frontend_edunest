import React, { useState, useCallback, useEffect } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { apiConnector } from "../services/apiConnector";
import { apiLinks } from "../services/apiLink";
import { FaRegistered } from "react-icons/fa";
import GoogleSignUpButton from "../components/application/GoogleSignUpButton";

const RegisterPage = () => {
  // Student-0 , Instructor-1 , Admin-2
  const navigate = useNavigate();
  const roles = [
    {
      role: "Student",
      title: "Build skills for today, tomorrow, and beyond. ",
      subTitle: "Educate to future-proof your carrier ",
    },
    {
      role: "Instructor",
      title: "Discover your passion, by joining us, ",
      subTitle: "Be unstoppable",
    },
    {
      role: "Admin",
      title: "Register as a Admin",
      subTitle: "",
    },
  ];

  const [loading, setLoading] = useState(false);
  const [currentRole, setCurrentRole] = useState(roles[0]);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] =
    useState(false);
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [userAuthenticationData, setUserAuthenticationData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    accountType: "Student",
  });

  useEffect(() => {
    localStorage.removeItem("registrationData");
  }, []);
  // Update the role
  const updateRole = useCallback((index) => {
    setCurrentRole(roles[index]);
    setUserAuthenticationData((prevData) => ({
      ...prevData,
      accountType: roles[index].role,
    }));
  }, []);

  // Update form data
  const updateUserData = (event) => {
    setUserAuthenticationData((prevData) => ({
      ...prevData,
      [event.target.name]: event.target.value,
    }));
  };

  // Toggle password visibility
  const togglePasswordVisibility = useCallback(() => {
    setIsPasswordVisible((prev) => !prev);
  }, []);

  // Toggle confirm password visibility
  const toggleConfirmPasswordVisibility = useCallback(() => {
    setIsConfirmPasswordVisible((prev) => !prev);
  }, []);

  // function to send otp to the email via server
  async function sendOtp(email) {
    try {
      const response = await apiConnector("POST", apiLinks.sendOtp, null, {
        email,
      });
      return response;
    } catch (error) {}
  }

  // function send otp to owner
  async function sendOtpOwner() {
    try {
      const response = await apiConnector("POST", apiLinks.sendOtp_owner);
      alert(response.message);
      return response;
    } catch (error) {}
  }

  // Handle form submission
  async function handleSubmit(event) {
    event.preventDefault();
    setLoading(true);

    const { firstName, lastName, email, password, confirmPassword } =
      userAuthenticationData;

    if (!firstName || !lastName || !email || !password || !confirmPassword) {
      toast.error("Please fill all the fields", {
        autoClose: 900,
        hideProgressBar: true,
        pauseOnHover: false,
        closeOnClick: true,
        draggable: false,
      });
      return setLoading(false);
    }

    if (password != confirmPassword) {
      toast.error("Password do not match", {
        autoClose: 900,
        hideProgressBar: true,
        pauseOnHover: false,
        closeOnClick: true,
        draggable: false,
      });
      return setLoading(false);
    }

    try {
      if (currentRole.role == "Admin") {
        const ownerResponse = await sendOtpOwner();
      }
      const response = await sendOtp(email);

      if (!response || !response.success) {
        toast.error(response?.message || "Failed to send OTP", {
          autoClose: 900,
          hideProgressBar: true,
          pauseOnHover: false,
          closeOnClick: true,
          draggable: false,
        });
        setLoading(false);
        return;
      }

      toast.success("OTP sent to your email", {
        autoClose: 900,
        hideProgressBar: true,
        pauseOnHover: false,
        closeOnClick: true,
        draggable: false,
      });

      localStorage.setItem(
        "registrationData",
        JSON.stringify(userAuthenticationData)
      );

      setUserAuthenticationData({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        confirmPassword: "",
      });

      navigate("/verify-mail");
    } catch (error) {
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <div className="w-[95%] bg-gray-900 p-2 rounded-xl m-auto tablet:h-[770px] mt-10 flex flex-col md:flex-row-reverse items-center justify-between max-w-[1100px] mb-10">
        {/* Image Section */}
        <div className="w-full flex justify-center md:w-1/2 p-5">
          {!isImageLoaded && (
            <div className="w-[90%] max-w-[400px] -mr-[300px] h-[250px] flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-600"></div>
            </div>
          )}
          <img
            src="https://res.cloudinary.com/dort5nnis/image/upload/v1741922098/erasebg-transformed_4_sufn8y.png"
            className={`rounded-2xl w-[90%] max-w-[400px] h-auto object-contain transition-opacity duration-500 ${
              isImageLoaded ? "opacity-100" : "opacity-0"
            }`}
            alt="Secure Login"
            onLoad={() => setIsImageLoaded(true)}
            loading="lazy"
          />
        </div>

        {/* Form Section */}
        <div className="w-full md:w-[70%] min-w-0 p-5 flex flex-col gap-3 text-center md:text-left">
          <h1 className="select-none text-[30px] font-bold text-white">
            Join the million learning to code with EduNest for free
          </h1>
          <p className="select-none text-gray-400 text-[18px] mt-2 md:w-[80%] h-[100px] tablet:h-[52px]">
            {currentRole.title}{" "}
            <span
              className="text-dark_red italic text-[17px]"
              style={{ fontFamily: '"Playwrite IT Trad", cursive' }}
            >
              {currentRole.subTitle}
            </span>
          </p>

          {/* Role Toggle Switch */}
          <div className="flex items-center justify-center md:justify-start mt-5">
            <div className="relative flex items-center bg-gray-800 w-[240px] md:w-[300px] h-[43px] rounded-full p-1">
              <div
                className={`absolute z-[1] w-1/3 h-[90%] bg-dark_red rounded-full transition-all duration-300 ${
                  currentRole.role === "Admin"
                    ? "left-1"
                    : currentRole.role === "Student"
                    ? "left-[33%]"
                    : "left-[66%]"
                }`}
              ></div>

              <div
                className={`w-1/3 text-center cursor-pointer z-[1] text-sm md:text-base ${
                  currentRole.role === "Admin"
                    ? "text-white font-bold"
                    : "text-gray-400"
                }`}
                onClick={() => updateRole(2)}
              >
                Admin
              </div>
              <div
                className={`w-1/3 text-center cursor-pointer z-[1] text-sm md:text-base ${
                  currentRole.role === "Student"
                    ? "text-white font-bold"
                    : "text-gray-400"
                }`}
                onClick={() => updateRole(0)}
              >
                Student
              </div>
              <div
                className={`w-1/3 text-center cursor-pointer z-[1] text-sm md:text-base ${
                  currentRole.role === "Instructor"
                    ? "text-white font-bold"
                    : "text-gray-400"
                }`}
                onClick={() => updateRole(1)}
              >
                Instructor
              </div>
            </div>
          </div>

          {/* Registration Form */}
          <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-3 mt-4 text-start w-full md:max-w-[510px]"
          >
            {/* Name Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col">
                <label
                  htmlFor="firstName"
                  className="select-none text-gray-300 font-medium mb-2"
                >
                  First Name <span className="text-dark_red ml-1">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Enter first name"
                  id="firstName"
                  name="firstName"
                  required
                  value={userAuthenticationData.firstName}
                  onChange={updateUserData}
                  className="p-3 w-full border text-gray-300 border-gray-600 rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-700 bg-transparent"
                />
              </div>

              <div className="flex flex-col">
                <label
                  htmlFor="lastName"
                  className="select-none text-gray-300 font-medium mb-2"
                >
                  Last Name <span className="text-dark_red ml-1">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Enter last name"
                  id="lastName"
                  name="lastName"
                  required
                  value={userAuthenticationData.lastName}
                  onChange={updateUserData}
                  className="p-3 w-full border text-gray-300 border-gray-600 rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-700 bg-transparent"
                />
              </div>
            </div>
            {/* Email Field */}
            <div className="flex flex-col">
              <label
                htmlFor="email"
                className="select-none text-gray-300 font-medium mb-2"
              >
                Email Address <span className="text-dark_red ml-1">*</span>
              </label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="Enter your email"
                required
                value={userAuthenticationData.email}
                onChange={updateUserData}
                className="p-3 border text-gray-300 border-gray-600 rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-700 bg-transparent"
                autoComplete="off"
              />
            </div>
            {/* Password Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col">
                <label
                  htmlFor="password"
                  className="select-none text-gray-300 font-medium mb-2"
                >
                  Create Password <span className="text-dark_red ml-1">*</span>
                </label>
                <div className="relative">
                  <input
                    type={isPasswordVisible ? "text" : "password"}
                    id="password"
                    name="password"
                    placeholder="Enter password"
                    required
                    value={userAuthenticationData.password}
                    onChange={updateUserData}
                    className="p-3 w-full border text-gray-300 border-gray-600 rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-700 bg-transparent pr-10"
                  />
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300"
                  >
                    {isPasswordVisible ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>

              <div className="flex flex-col">
                <label
                  htmlFor="confirmPassword"
                  className="select-none text-gray-300 font-medium mb-2"
                >
                  Confirm Password <span className="text-dark_red ml-1">*</span>
                </label>
                <div className="relative">
                  <input
                    type={isConfirmPasswordVisible ? "text" : "password"}
                    id="confirmPassword"
                    name="confirmPassword"
                    placeholder="Confirm password"
                    required
                    value={userAuthenticationData.confirmPassword}
                    onChange={updateUserData}
                    className="p-3 w-full border text-gray-300 border-gray-600 rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-700 bg-transparent pr-10"
                  />
                  <button
                    type="button"
                    onClick={toggleConfirmPasswordVisibility}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300"
                  >
                    {isConfirmPasswordVisible ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>
            </div>
            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full mt-5 flex justify-center items-center py-2 px-4 bg-dark_red hover:bg-dark_red/80 cursor-pointer text-white font-medium rounded-md transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  <FaRegistered className="mr-2" />
                  Register
                </>
              )}
            </button>

            {/* Login Link */}
            <p className="text-gray-400 mt-1 flex justify-end gap-2">
              Already have an account?{" "}
              <Link to="/login" className="text-dark_red hover:text-red-500">
                Login here
              </Link>
            </p>
          </form>
          <div
            className="w-full max-w-[510px]"
            onClick={() => {
              localStorage.setItem("role", currentRole.role);
            }}
          >
            <GoogleSignUpButton onSuccessSignUp={() => navigate("/login")} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
