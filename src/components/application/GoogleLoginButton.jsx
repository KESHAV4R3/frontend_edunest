import React from "react";
import { useGoogleLogin } from "@react-oauth/google";
import { FcGoogle } from "react-icons/fc";
import { apiConnector } from "../../services/apiConnector";
import { apiLinks } from "../../services/apiLink";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { setLoading } from "../../redux/slices/uiSlice";

const GoogleLoginButton = ({ onSuccessLogin }) => {
  const dispatch = useDispatch();

  const login = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      dispatch(setLoading(true));
      try {
        const response = await apiConnector(
          "POST",
          apiLinks.googleLogin,
          null,
          {
            access_token: tokenResponse.access_token,
            accountType: localStorage.getItem("role"),
          }
        );

        if (!response.success) {
          toast.error(response.message || "Google login failed");
        } else {
          toast.success("Login Successful", {
            autoClose: 900,
            hideProgressBar: true,
          });
          onSuccessLogin(response.user);
        }
      } catch (error) {
        console.error("Google login error:", error);
        toast.error("Google login failed");
      } finally {
        dispatch(setLoading(false));
      }
    },
    onError: (err) => {
      console.error("Google login error:", err);
      toast.error("Google login failed");
    },
    flow: "implicit",
  });

  return (
    <button
      onClick={() => login()}
      className="mt-3 w-full flex items-center justify-center gap-2 py-2 px-4 bg-gray-800 hover:cursor-pointer text-white font-medium rounded-md border border-gray-600 hover:bg-gray-900 transition duration-200"
    >
      <FcGoogle className="text-xl rounded-full p-0.5" />
      Login with Google
    </button>
  );
};

export default React.memo(GoogleLoginButton);
