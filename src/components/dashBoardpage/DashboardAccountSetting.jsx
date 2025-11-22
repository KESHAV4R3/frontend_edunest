import React, { useState } from "react";
import { toast } from "react-toastify";
import { apiConnector } from "../../services/apiConnector";
import { apiLinks } from "../../services/apiLink";
import { useSelector, useDispatch } from "react-redux";
import { MdDeleteForever } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { setProfile, setPersonalData } from "../../redux/slices/profileSlice";
import { setLoading } from "../../redux/slices/uiSlice";

const DashboardAccountSetting = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.profile.user);
  const { loading } = useSelector((state) => state.ui);

  // logout function
  async function logout() {
    try {
      const response = await apiConnector("POST", apiLinks.logout);
      if (!response.success) {
        toast.error("unable to log-out", {
          autoClose: 900,
          hideProgressBar: true,
          pauseOnHover: false,
          closeOnClick: true,
          draggable: false,
        });
      } else {
        toast.info("log-out successfull", {
          autoClose: 900,
          hideProgressBar: true,
          pauseOnHover: false,
          closeOnClick: true,
          draggable: false,
        });
        dispatch(setProfile(null));
        dispatch(setPersonalData(null));
        navigate("/");
      }
    } catch (error) {
      toast.error("something went wrong during logout", {
        autoClose: 900,
        hideProgressBar: true,
        pauseOnHover: false,
        closeOnClick: true,
        draggable: false,
      });
    }
  }

  // delete account
  async function deleteAccount() {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete your account permanently?"
    );
    if (!confirmDelete) return;

    dispatch(setLoading(true));
    try {
      const response = await apiConnector("DELETE", apiLinks.deleteAccount);
      if (!response.success) {
        toast.error("Unable to delete account", {
          autoClose: 900,
          hideProgressBar: true,
          pauseOnHover: false,
          closeOnClick: true,
          draggable: false,
        });
        return;
      } else {
        toast.success("Account deleted successfully", {
          autoClose: 900,
          hideProgressBar: true,
          pauseOnHover: false,
          closeOnClick: true,
          draggable: false,
        });
        await logout();
      }
    } catch (error) {
      console.error(error);
      toast.error("Error deleting account");
    } finally {
      dispatch(setLoading(false));
    }
  }

  return (
    <div>
      {user && user.accountType != "Admin" ? (
        <div className="relative bg-gray-800 mt-10 flex flex-col items-center text-center rounded-2xl w-full md:w-[90%] mx-auto p-6 mb-10 shadow-lg border border-gray-700">
          <MdDeleteForever className="text-red-500 text-4xl mb-4 hover:scale-110 transition-transform duration-300" />

          <h2 className="text-xl font-semibold text-white mb-2">
            Delete Account?
          </h2>

          <p className="text-gray-300 mb-4">
            Are you sure you want to permanently delete your account? This
            action cannot be undone.
          </p>

          <p className="text-sm text-gray-400 mb-2">
            Account Type:{" "}
            <span className="font-medium text-white">{user?.accountType}</span>
          </p>

          <button
            disabled={loading}
            onClick={deleteAccount}
            className="mt-2 cursor-pointer px-6 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white font-medium transition duration-200 disabled:cursor-not-allowed"
          >
            {loading ? (
              <div className="w-5 h-5 border-4 border-gray-300 border-t-dark_red rounded-full animate-spin"></div>
            ) : (
              "Yes, Delete My Account"
            )}
          </button>
        </div>
      ) : (
        <p></p>
      )}
    </div>
  );
};

export default React.memo(DashboardAccountSetting);
