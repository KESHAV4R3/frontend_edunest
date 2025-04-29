import React, { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useCallback } from "react";
import { apiConnector } from "../services/apiConnector";
import { apiLinks } from "../services/apiLink";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setProfile } from "../redux/slices/profileSlice";
import { IoMdLogIn } from "react-icons/io";

const LoginPage = () => {
  // Student-0 , Instructor-1 , Admin-2
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const roles = [
    {
      role: "Student",
      title: "Build skills for today, tomorrow, and beyond.",
      subTitle: "Education to future-proof your career.",
    },
    {
      role: "Instructor",
      title: "Discover your passion",
      subTitle: "Be unstoppable",
    },
    {
      role: "Admin",
      title: "Login as a Admin",
      subTitle: "",
    },
  ];
  const [currentRole, setCurrentRole] = useState(roles[0]);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [bodyData, setBodyData] = useState({
    email: "",
    password: "",
    accountType: "Student",
  });
  const [imageLoaded, setImageLoaded] = useState(false);
  const [loading, setLoading] = useState(false);

  // update the role as a login
  const updateRole = useCallback((index) => {
    setCurrentRole(roles[index]);
  }, []);

  // update the user login data
  const updateUserData = (event) => {
    setBodyData((prevData) => {
      return {
        ...prevData,
        [event.target.name]: event.target.value,
      };
    });
  };

  // update password visible
  const togglePasswordVisibility = useCallback(() => {
    setIsPasswordVisible((prev) => !prev);
  }, []);

  // forgot password function
  function forgotPassword() {
    localStorage.setItem("forgotPassword", "true");
    navigate("/forgot-password");
  }

  // submit and send the data to the server
  const handleSubmit = async (event) => {
    event.preventDefault();

    // send the data to the server
    try {
      if (bodyData.email && bodyData.password) {
        bodyData.accountType = currentRole.role;
        const response = await apiConnector(
          "POST",
          apiLinks.login,
          null,
          bodyData
        );
        if (!response.success) {
          toast.warn(response.message, {
            autoClose: 900,
            hideProgressBar: true,
            pauseOnHover: false,
            closeOnClick: true,
            draggable: false,
          });
          setBodyData({ email: "", password: "" });
        } else {
          dispatch(setProfile(response.user));
          toast.success("Login Successful", {
            autoClose: 900,
            hideProgressBar: true,
            pauseOnHover: false,
            closeOnClick: true,
            draggable: false,
          });
          navigate("/");
        }
      } else {
      }
    } catch (error) {}
  };

  return (
    <div>
      <div className="w-[95%] bg-gray-900 p-2 rounded-xl m-auto tablet:h-[630px] mt-10 flex flex-col md:flex-row-reverse items-center justify-between max-w-[1100px] mb-10">
        <div className="w-full tablet2:w-1/2 flex justify-center p-5 relative">
          {!imageLoaded && (
            <div className="w-[90%] max-w-[400px] h-[250px] flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-600"></div>
            </div>
          )}
          <img
            src="https://res.cloudinary.com/dort5nnis/image/upload/v1741914599/erasebg-transformed_2_hetfta.png"
            className={`rounded-2xl w-[90%] max-w-[400px] h-auto object-contain transition-opacity duration-500 ${
              imageLoaded ? "opacity-100" : "opacity-0"
            }`}
            alt="Secure Login"
            onLoad={() => setImageLoaded(true)}
            style={{ display: imageLoaded ? "block" : "none" }} // Hide image until loaded
          />
        </div>

        {/* Form Section */}
        <div className="w-full md:w-1/2 min-w-0 p-5 flex flex-col gap-3 text-center md:text-left">
          <p className="select-none text-[30px] tablet:text-[40px] font-bold text-white">
            Welcome back
          </p>
          <p className="select-none text-gray-400 text-[18px] mt-2 md:w-[80%] h-[100px] tabelt:h-[60px]">
            {currentRole.title}{" "}
            <span
              className="text-dark_red italic text-[17px]"
              style={{
                fontFamily: '"Playwrite IT Trad", cursive',
              }}
            >
              {currentRole.subTitle}
            </span>
          </p>

          {/* Role Toggle Switch - Three Options */}
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
                onClick={() => updateRole(2)} // Admin is at index 2
              >
                Admin
              </div>
              <div
                className={`w-1/3 text-center cursor-pointer z-[1] text-sm md:text-base ${
                  currentRole.role === "Student"
                    ? "text-white font-bold"
                    : "text-gray-400"
                }`}
                onClick={() => updateRole(0)} // Student is at index 0
              >
                Student
              </div>
              <div
                className={`w-1/3 text-center cursor-pointer z-[1] text-sm md:text-base ${
                  currentRole.role === "Instructor"
                    ? "text-white font-bold"
                    : "text-gray-400"
                }`}
                onClick={() => updateRole(1)} // Instructor is at index 1
              >
                Instructor
              </div>
            </div>
          </div>

          {/* Login Form */}
          <form className="flex flex-col  gap-3 mt-4 text-start w-full md:max-w-[400px]">
            <label
              htmlFor="email"
              className="select-none text-gray-300 font-medium"
            >
              Email Address<span className="text-dark_red ml-1">*</span>
            </label>
            <input
              name="email"
              type="email"
              id="email"
              placeholder="Enter your email"
              className="p-3 border text-gray-300 border-gray-600 rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-700 bg-transparent"
              autoComplete="off"
              value={bodyData.email}
              onChange={updateUserData}
              required
            />

            <label
              htmlFor="password"
              className="select-none text-gray-300 font-medium"
            >
              Password<span className="text-dark_red ml-1">*</span>
            </label>
            <div className="relative">
              <input
                name="password"
                type={isPasswordVisible ? "text" : "password"}
                id="password"
                placeholder="Enter your password"
                className="p-3 border border-gray-600 text-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-700 bg-transparent w-full pr-10"
                value={bodyData.password}
                onChange={updateUserData}
                required
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="cursor-pointer absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-300"
              >
                {isPasswordVisible ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            <p
              onClick={forgotPassword}
              className="select-none text-gray-300 hover:text-dark_red text-[13px] text-end cursor-pointer"
            >
              Forgot password ?
            </p>

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
                  <IoMdLogIn className="mr-2" />
                  Sign In
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
