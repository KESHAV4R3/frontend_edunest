import { useState, useRef, useEffect } from "react";
import { FaArrowLeftLong } from "react-icons/fa6";
import { apiLinks } from "../services/apiLink";
import { apiConnector } from "../services/apiConnector";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { MdOutlineVerifiedUser } from "react-icons/md";

const VerifyMailPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [ownerOtp, setOwnerOtp] = useState(["", "", "", "", "", ""]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingOwner, setIsLoadingOwner] = useState(false);
  const inputRefs = useRef([]);
  const ownerInputRefs = useRef([]);
  // fetch data from localstorage
  const data = localStorage.getItem("registrationData")
    ? JSON.parse(localStorage.getItem("registrationData"))
    : {};

  // Handle OTP input change
  const handleOtpChange = (index, value) => {
    const newOtp = [...otp];
    newOtp[index] = value.replace(/\D/g, ""); // Allow only digits
    setOtp(newOtp);

    // Auto-focus to the next input
    if (value && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };

  // handle owner otp change
  const handleOwnerOtpChange = (index, value) => {
    const newOtp = [...ownerOtp];
    newOtp[index] = value.replace(/\D/g, ""); // Allow only digits
    setOwnerOtp(newOtp);

    // Auto-focus to the next input
    if (value && index < 5) {
      ownerInputRefs.current[index + 1].focus();
    }
  };

  // Handle backspace to move to the previous input
  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  // handle owner backspace to move to the previous input
  const handleOwnerKeyDown = (index, e) => {
    if (e.key === "Backspace" && !ownerOtp[index] && index > 0) {
      ownerInputRefs.current[index - 1].focus();
    }
  };

  // Simulate resending OTP
  const handleResendOtp = async (event) => {
    setResendLoading(true);
    try {
      const response = await apiConnector("POST", apiLinks.sendOtp, null, {
        email: localStorage.getItem("registrationData")
          ? JSON.parse(localStorage.getItem("registrationData")).email
          : null,
      });
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
      navigate("/verify-mail");
    } catch (error) {
      console.log(error.message);
    } finally {
      setResendLoading(false);
    }
  };

  // verify the otp and register the user
  async function validateOtpHandler(event) {
    setLoading(true);
    if (
      otp.includes("") ||
      (data.accountType == "Admin" && ownerOtp.includes(""))
    ) {
      alert("Please enter all digits");
      setLoading(false);
      return;
    }

    try {
      // filter the otp and make it string formate
      let ownerOtpData = "";
      let otpData = "";
      for (let i = 0; i < 6; i++) {
        otpData += otp[i];
        ownerOtpData += ownerOtp[i];
      }
      let response = {};
      if (data.accountType == "Admin") {
        data.ownerOtp = ownerOtpData;
        data.otp = otpData;
        response = await apiConnector(
          "POST",
          apiLinks.signup_Admin,
          null,
          data
        );
      } else {
        data.otp = otpData;
        response = await apiConnector("POST", apiLinks.signup, null, data);
      }

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
      }
      toast.success("Registration successful!", {
        autoClose: 900,
        hideProgressBar: true,
        pauseOnHover: false,
        closeOnClick: true,
        draggable: false,
      });
      // clear local storage
      localStorage.removeItem("registrationData");
      setLoading(false);
      navigate("/login");
    } catch (error) {}
  }

  return (
    <div>
      <div className="w-[95%] p-6 bg-gray-900 rounded-xl m-auto mt-10 flex flex-col tablet2:flex-row-reverse items-center max-w-[1100px] mb-10">
        {/* Right Section - Image */}
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

        {/* Left Section - OTP Verification Form */}
        <div className="w-full tablet2:w-[70%] min-w-0 p-2 md:p-5 flex flex-col gap-6 text-center tablet2::text-left">
          <div className="w-full p-8 tablet2:pl-15 bg-gray-800 rounded-xl shadow-lg">
            <h2 className="text-[32px] tablet2:text-[40px] font-bold text-white">
              Verify email
            </h2>
            <p className="text-gray-400 text-[16px] mt-3 tablet2::w-[85%] mx-auto md:mx-0">
              A verification code has been sent to you. Enter the code below to
              verify your email.
            </p>

            {/* Form */}
            <form className="flex flex-col gap-4 mt-6 text-center w-full tablet2::max-w-[400px] mx-auto md:mx-0">
              {/* OTP Input Boxes */}
              <div>
                {data.accountType == "Admin" ? (
                  <div>
                    {" "}
                    <p className="text-gray-300 mb-4 text-[20px] underline underline-offset-4">
                      OTP send to Owner{" "}
                    </p>
                    <div className="flex justify-center flex-wrap gap-3">
                      {ownerOtp.map((digit, index) => (
                        <input
                          key={index}
                          type="text"
                          className="w-12 h-12 text-center text-gray-300 border border-gray-600 rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-700 bg-transparent"
                          value={digit}
                          onChange={(e) =>
                            handleOwnerOtpChange(index, e.target.value)
                          }
                          onKeyDown={(e) => handleOwnerKeyDown(index, e)}
                          maxLength={1}
                          ref={(el) => (ownerInputRefs.current[index] = el)}
                          disabled={isLoadingOwner}
                          required
                        />
                      ))}
                    </div>
                  </div>
                ) : (
                  ""
                )}
              </div>

              <p className="text-gray-300 mb-2 text-[20px] underline  underline-offset-4">
                OTP send to User{" "}
              </p>
              <div className="flex justify-center flex-wrap gap-3">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    type="text"
                    className="w-12 h-12 text-center text-gray-300 border border-gray-600 rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-700 bg-transparent"
                    value={digit}
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    maxLength={1}
                    ref={(el) => (inputRefs.current[index] = el)}
                    disabled={isLoading}
                    required
                  />
                ))}
              </div>

              {/* Verify Button */}

              <button
                type="submit"
                disabled={loading}
                onClick={validateOtpHandler}
                className="w-full mt-5 flex justify-center items-center py-2 px-4 bg-dark_red hover:bg-dark_red/80 cursor-pointer text-white font-medium rounded-md transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <>
                    <MdOutlineVerifiedUser className="mr-2" />
                    Verify Otp
                  </>
                )}
              </button>
            </form>

            {/* Resend OTP Button */}
            <button
              onClick={handleResendOtp}
              disabled={resendLoading}
              className="mt-1 w-full flex justify-end items-center gap-2 hover:text-dark_red  cursor-pointer text-white font-semibold p-3 rounded-lg transition-all duration-300 disabled:opacity-50"
            >
              {resendLoading ? (
                <div className="w-5 h-5 border-4 border-gray-300 border-t-dark_red rounded-full animate-spin"></div>
              ) : (
                "Resend OTP"
              )}
            </button>

            {/* Back to Login */}
            <p
              onClick={() => {
                navigate("/login");
              }}
              className="text-gray-300 flex justify-start items-center gap-2 hover:text-red-500 text-[16px] cursor-pointer"
            >
              <FaArrowLeftLong />
              Back to Login
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyMailPage;
