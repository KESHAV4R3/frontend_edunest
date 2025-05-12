import React, { useCallback, useState, memo } from "react";
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

const CourseCard = memo(({ course, id }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.profile.user);
  const accountType = user ? user.accountType : "";
  const paymentPageLoader = useSelector(
    (state) => state.profile.paymentLoading
  );
  const cartCourses = useSelector((state) => state.application.cartCourses);
  
  // State management
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [purchaseLoading, setPurchaseLoading] = useState(false);
  const [cartRemoveLoading, setCartRemoveLoading] = useState(false);
  const [purchaseButtonLoading, setPurchaseButtonLoading] = useState(false);
  
  // Memoize course details to prevent unnecessary re-renders
  const { name, description, language, price, thumbnail, averageRating } = course;

  // Memoized navigation handlers
  const navigateCourse = useCallback(() => {
    navigate(`/course-detail/${id}`);
  }, [navigate, id]);

  const handleSubmit = useCallback(() => {
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
  }, [location.pathname, accountType, navigate, id]);

  // Memoized delete course function
  const deleteCourse = useCallback(async () => {
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
  }, [id, location.pathname, cartCourses, dispatch]);

  // Memoized purchase course function
  const purchaseCourse = useCallback(async () => {
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
  }, [id, user, navigate, dispatch, deleteCourse]);

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

  // Determine button content based on context
  const renderButtonContent = useCallback(() => {
    if (purchaseButtonLoading) {
      return (
        <div className="inline-block h-5 w-5 animate-spin rounded-full border-2 border-solid border-current border-r-transparent"></div>
      );
    }
    
    if (location.pathname.includes("category")) {
      return (
        <span className="flex justify-center items-center gap-1 cursor-pointer">
          <FaLocationArrow className="mr-2" />
          Explore
        </span>
      );
    }
    
    if (accountType === "Instructor") {
      return (
        <span className="flex justify-center items-center gap-1 cursor-pointer">
          <FaEdit className="mr-2" />
          Edit
        </span>
      );
    }
    
    if (location.pathname.includes("cart")) {
      return (
        <span className="flex justify-center items-center gap-1 cursor-pointer">
          <BiSolidPurchaseTag className="mr-2" />
          Purchase
        </span>
      );
    }
    
    return (
      <span className="flex justify-center items-center gap-1 cursor-pointer">
        <FaLocationArrow className="mr-2" />
        Explore
      </span>
    );
  }, [purchaseButtonLoading, location.pathname, accountType]);

  return (
    <div className="relative bg-gray-800 min-w-[340px] p-5 rounded-md w-[97%] h-[630px] md:h-[640px] max-w-[500px] cursor-pointer transition-all duration-300 hover:shadow-lg hover:shadow-gray-900/50 hover:translate-y-[-5px]">
      {/* Delete Button for Admin or Cart */}
      {(user?.accountType === "Admin" ||
        location.pathname.split("/").at(-1) === "cart") && (
        <button
          disabled={deleteLoading || cartRemoveLoading}
          onClick={deleteCourse}
          className="absolute cursor-pointer disabled:cursor-not-allowed z-10 top-2 right-2 w-[40px] h-[40px] border border-gray-600 bg-red-700 rounded-full flex justify-center items-center transition-opacity hover:opacity-90"
          aria-label="Delete course"
        >
          {deleteLoading || cartRemoveLoading ? (
            <div className="inline-block h-5 w-5 animate-spin rounded-full border-2 border-solid border-current border-r-transparent"></div>
          ) : (
            <MdDelete className="text-[25px] transition-transform hover:scale-110" />
          )}
        </button>
      )}

      {/* Course Thumbnail */}
      <div className="mb-3 rounded-md w-full h-[200px] overflow-hidden bg-gray-700">
        <img
          onClick={navigateCourse}
          src={thumbnail}
          alt={name}
          loading="lazy"
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
        />
      </div>

      <div className="flex flex-col gap-3">
        <h3 
          onClick={navigateCourse}
          className="text-gray-200 h-[70px] text-[16px] tablet:text-[18px] bg-gray-700 p-3 rounded-md transition-colors duration-200 line-clamp-2"
        >
          {name}
        </h3>
        
        <p 
          onClick={navigateCourse}
          className="text-[15px] bg-gray-700 p-3 min-h-[160px] rounded-md transition-colors duration-200 line-clamp-6 text-gray-300"
        >
          {description.substring(0, 350)}...
        </p>

        <div className="flex justify-between gap-3">
          <span className="bg-gray-700 p-3 flex justify-center items-center gap-3 rounded-md w-[48%] hover:bg-gray-600 transition-colors duration-200">
            {language}
          </span>
          <span className="bg-gray-700 p-3 flex justify-center items-center gap-3 rounded-md w-[48%] hover:bg-gray-600 transition-colors duration-200">
            <FaStar className="text-yellow-500" />
            {averageRating.toFixed(1)}
          </span>
        </div>

        <div className="flex justify-between gap-3 mt-1">
          <span className="bg-gray-700 p-3 flex justify-center items-center gap-3 rounded-md w-[48%] hover:bg-gray-600 transition-colors duration-200">
            ₹{price.toFixed(2)}
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
            className="w-[48%] flex justify-center items-center py-3 px-4 bg-green-600 hover:bg-green-600/90 text-white font-medium rounded-md transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-md hover:shadow-green-600/30"
            aria-label={location.pathname.includes("cart") ? "Purchase course" : "View course"}
          >
            {renderButtonContent()}
          </button>
        </div>
      </div>
    </div>
  );
});

export default CourseCard;