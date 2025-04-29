import React, { useState } from "react";
import { FaStar, FaEdit, FaLocationArrow } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { BiSolidPurchaseTag } from "react-icons/bi";
import { useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { apiLinks } from "../../services/apiLink";
import { apiConnector } from "../../services/apiConnector";
import { toast } from "react-toastify";
import { setPaymentLoading } from "../../redux/slices/profileSlice";
import { buyCourse } from "../../services/razorPayIntegration";
import { useDispatch } from "react-redux";
import { setCartCourses } from "../../redux/slices/applicationSlice";

const CourseCard = ({ course, id }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.profile.user);
  const accountType = user ? user.accountType : "";
  const paymentPageLoader = useSelector(
    (state) => state.profile.paymentLoading
  );
  const cartCourses = useSelector((state) => state.application.cartCourses);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [purchaseLoading, setPurchaseLoading] = useState(false);
  const [cartRemoveLoading, setCartRemoveLoading] = useState(false);
  const [purchaseButtonLoading, setPurchaseButtonLoading] = useState(false);
  const { name, description, language, price, thumbnail, averageRating } =
    course;

  const handleSubmit = () => {
    if (
      location.pathname.includes("category") ||
      location.pathname.includes("cart") ||
      location.pathname.includes("search")
    ) {
      navigate(`/course-detail/${id}`);
    } else if (
      accountType === "Instructor" &&
      location.pathname.includes("dashboard")
    ) {
      navigate(`/dashboard/create-new-section/${id}`);
    } else if (
      accountType === "Admin" &&
      location.pathname.includes("dashboard")
    ) {
      navigate(`/course-detail/${id}`);
    } else if (
      accountType === "Student" &&
      location.pathname.includes("dashboard")
    ) {
      navigate(`/view-course/${id}`);
    }
  };

  const deleteCourse = async () => {
    // to remove the course from cart
    if (location.pathname.split("/").at(-1) === "cart") {
      setCartRemoveLoading(true);
      try {
        const url = apiLinks.removeCourseFromCart + `/${id}`;
        const response = await apiConnector("PATCH", url);
        if (!response.success) {
          toast.error("Failed to remove course from cart", {
            autoClose: 900,
            hideProgressBar: true,
            pauseOnHover: false,
            closeOnClick: true,
            draggable: false,
          });
          return;
        }
        // Update cart in Redux store
        const updatedCart = cartCourses.filter((value) => value._id !== id);
        dispatch(setCartCourses(updatedCart));
        toast.success("Course removed from cart", {
          autoClose: 900,
          hideProgressBar: true,
          pauseOnHover: false,
          closeOnClick: true,
          draggable: false,
        });
      } catch (error) {
        toast.error("Error removing course from cart", {
          autoClose: 900,
          hideProgressBar: true,
          pauseOnHover: false,
          closeOnClick: true,
          draggable: false,
        });
      } finally {
        setCartRemoveLoading(false);
      }
      return;
    }
    // to delete the course only for admin
    setDeleteLoading(true);
    try {
      const url = `${apiLinks.deleteCourse}/${id}`;
      const response = await apiConnector("DELETE", url);
      if (!response.success) {
        toast.error("Unable to delete course", {
          autoClose: 900,
          hideProgressBar: true,
          pauseOnHover: false,
          closeOnClick: true,
          draggable: false,
        });
      } else {
        toast.success("Course deleted successfully", {
          autoClose: 900,
          hideProgressBar: true,
          pauseOnHover: false,
          closeOnClick: true,
          draggable: false,
        });
      }
    } catch (error) {
      toast.error("Error deleting course", {
        autoClose: 900,
        hideProgressBar: true,
        pauseOnHover: false,
        closeOnClick: true,
        draggable: false,
      });
    } finally {
      setDeleteLoading(false);
      window.location.reload();
    }
  };

  const purchaseCourse = async () => {
    setPurchaseButtonLoading(true);
    if (!user) {
      toast.info("Login to purchase the course", {
        autoClose: 900,
        hideProgressBar: true,
        pauseOnHover: false,
        closeOnClick: true,
        draggable: false,
      });
      navigate("/login");
      setPurchaseButtonLoading(false);
      return;
    }

    try {
      await buyCourse([id], user, navigate, async (isLoading) => {
        dispatch(setPaymentLoading(isLoading));
        if (!isLoading) {
          // Only remove from cart after successful purchase
          try {
            await deleteCourse();
          } catch (error) {
            console.error("Error removing from cart after purchase:", error);
          }
        }
      });
    } catch (error) {
      console.error("Purchase failed:", error);
      dispatch(setPaymentLoading(false));
    } finally {
      setPurchaseButtonLoading(false);
    }
  };

  if (paymentPageLoader) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0000004f] bg-opacity-70">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-white">Completing your purchase...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative bg-gray-800 min-w-[400px] p-5 rounded-md w-[97%] h-[630px] md:h-[600px] max-w-[500px] cursor-pointer">
      {/* Delete Button for Admin or Cart */}
      {(user?.accountType === "Admin" || location.pathname.split("/").at(-1) === "cart") && (
        <button
          disabled={deleteLoading || cartRemoveLoading}
          onClick={deleteCourse}
          className="absolute cursor-pointer disabled:cursor-not-allowed top-2 right-2 w-[40px] h-[40px] border border-gray-600 bg-red-700 rounded-full flex justify-center items-center"
        >
          {deleteLoading || cartRemoveLoading ? (
            <div className="inline-block h-5 w-5 animate-spin rounded-full border-2 border-solid border-current border-r-transparent"></div>
          ) : (
            <MdDelete className="text-[25px]" />
          )}
        </button>
      )}

      {/* Rest of the component remains the same */}
      <img
        src={thumbnail}
        alt={name}
        className="mb-3 rounded-md w-full h-[200px] object-cover bg-gray-700"
      />

      <div className="flex flex-col gap-2">
        <h3 className="text-gray-300 text-[20px] bg-gray-700 p-2 rounded-md">
          {name}
        </h3>
        <p className="text-[15px] bg-gray-700 p-2 min-h-[160px] rounded-md">
          {description.substring(0, 350)}......
        </p>

        <div className="flex justify-between">
          <span className="bg-gray-700 p-2 flex justify-center items-center gap-3 rounded-md w-[48%]">
            {language}
          </span>
          <span className="bg-gray-700 p-2 flex justify-center items-center gap-3 rounded-md w-[48%]">
            <FaStar className="text-yellow-500" />
            {averageRating.toFixed(1)}
          </span>
        </div>

        <div className="flex justify-between">
          <span className="bg-gray-700 p-2 flex justify-center items-center gap-3 rounded-md w-[48%]">
            INR {price.toFixed(2)}
          </span>

          <button
            type="button"
            disabled={purchaseLoading || purchaseButtonLoading}
            onClick={() => {
              if (location.pathname.includes("cart")) {
                purchaseCourse();
              } else {
                handleSubmit();
              }
            }}
            className="w-[48%] flex justify-center items-center py-2 px-4 bg-green-600 hover:bg-green-600/80 text-white font-medium rounded-md transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {purchaseButtonLoading ? (
              <div className="inline-block h-5 w-5 animate-spin rounded-full border-2 border-solid border-current border-r-transparent"></div>
            ) : location.pathname.includes("category") ? (
              <span className="flex justify-center items-center gap-1 cursor-pointer">
                <FaLocationArrow className="mr-2" />
                Explore
              </span>
            ) : accountType === "Instructor" ? (
              <span className="flex justify-center items-center gap-1 cursor-pointer">
                <FaEdit className="mr-2" />
                Edit
              </span>
            ) : location.pathname.includes("cart") ? (
              <span className="flex justify-center items-center gap-1 cursor-pointer">
                <BiSolidPurchaseTag className="mr-2" />
                Purchase
              </span>
            ) : (
              <span className="flex justify-center items-center gap-1 cursor-pointer">
                <FaLocationArrow className="mr-2" />
                Explore
              </span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CourseCard;