import React from "react";
import { useGoogleLogin } from "@react-oauth/google";
import { FcGoogle } from "react-icons/fc";
import { apiConnector } from "../../services/apiConnector";
import { apiLinks } from "../../services/apiLink";
import { toast } from "react-toastify";

const GoogleSignUpButton = ({ onSuccessSignUp }) => {
  const signup = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        const response = await apiConnector(
          "POST",
          apiLinks.googleSignUp,
          null,
          {
            access_token: tokenResponse.access_token,
            accountType: localStorage.getItem("role"),
          }
        );

        if (!response.success) {
          toast.error(response.message || "Google signup failed");
        } else {
          toast.success("Signup Successful", {
            autoClose: 900,
            hideProgressBar: true,
          });
          onSuccessSignUp?.(); // Optional callback
        }
      } catch (error) {
        console.error("Google signup error:", error);
        toast.error("Google signup failed");
      }
    },
    onError: (err) => {
      console.error("Google signup error:", err);
      toast.error("Google signup failed");
    },
    flow: "implicit",
  });

  return (
    <button
      onClick={() => signup()}
      className="mt-3 w-full flex items-center justify-center gap-2 py-2 px-4 bg-gray-800 hover:cursor-pointer text-white font-medium rounded-md border border-gray-600 hover:bg-gray-900 transition duration-200"
    >
      <FcGoogle className="text-xl rounded-full p-0.5" />
      Sign Up with Google
    </button>
  );
};

export default GoogleSignUpButton;
