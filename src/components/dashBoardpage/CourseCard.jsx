import React, { useCallback, useState, memo } from "react";
import { FaStar, FaEdit, FaLocationArrow, FaGlobe } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { BiSolidPurchaseTag } from "react-icons/bi";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { apiLinks } from "../../services/apiLink";
import { apiConnector } from "../../services/apiConnector";
import { toast } from "react-toastify";
import { setPaymentLoading } from "../../redux/slices/profileSlice";
import { buyCourse } from "../../services/razorPayIntegration";
import { setCartCourses } from "../../redux/slices/applicationSlice";

const CourseCard = memo(({ course, id }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const user = useSelector((state) => state.profile.user);
  const accountType = user?.accountType || "";
  const paymentPageLoader = useSelector((state) => state.profile.paymentLoading);
  const cartCourses = useSelector((state) => state.application.cartCourses) || [];
  
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [purchaseButtonLoading, setPurchaseButtonLoading] = useState(false);
  
  const { name, description, language, price, thumbnail, averageRating } = course;

  const navigateCourse = useCallback(() => {
    navigate(`/course-detail/${id}`);
  }, [navigate, id]);

  const handleSubmit = useCallback(() => {
    const path = location.pathname;
    if (path.includes("category") || path.includes("cart") || path.includes("search")) {
      navigate(`/course-detail/${id}`);
    } else if (accountType === "Instructor" && path.includes("dashboard")) {
      navigate(`/dashboard/create-new-section/${id}`);
    } else if (accountType === "Admin" && path.includes("dashboard")) {
      navigate(`/course-detail/${id}`);
    } else if (accountType === "Student" && path.includes("dashboard")) {
      navigate(`/view-course/${id}`);
    }
  }, [location.pathname, accountType, navigate, id]);

  // --- UPDATED DELETE LOGIC WITH CONFIRMATION ---
  const deleteCourse = useCallback(async (e) => {
    e.stopPropagation(); 
    const isCart = location.pathname.includes("cart");

    // 1. Ask for confirmation first
    const confirmMessage = isCart 
      ? "Remove this course from your cart?" 
      : "Are you sure? This will permanently delete the course.";
    
    if (!window.confirm(confirmMessage)) return;

    setDeleteLoading(true);
    try {
      const url = isCart ? `${apiLinks.removeCourseFromCart}/${id}` : `${apiLinks.deleteCourse}/${id}`;
      const method = isCart ? "PATCH" : "DELETE";
      const response = await apiConnector(method, url);

      if (response.success) {
        if (isCart) {
          dispatch(setCartCourses(cartCourses.filter(c => c._id !== id)));
        }
        toast.success(isCart ? "Removed from cart" : "Course deleted successfully");
        if (!isCart) window.location.reload();
      } else {
        toast.error(response.message || "Failed to process request");
      }
    } catch (error) {
      console.error("Delete Error:", error);
      toast.error("An error occurred");
    } finally {
      setDeleteLoading(false);
    }
  }, [id, location.pathname, cartCourses, dispatch]);

  const purchaseCourse = useCallback(async (e) => {
    e.stopPropagation();
    setPurchaseButtonLoading(true);
    if (!user) {
      toast.info("Please login to purchase");
      navigate("/login");
      return;
    }

    try {
      await buyCourse([id], user, navigate, async (isLoading) => {
        dispatch(setPaymentLoading(isLoading));
      });
    } catch (error) {
      dispatch(setPaymentLoading(false));
    } finally {
      setPurchaseButtonLoading(false);
    }
  }, [id, user, navigate, dispatch]);

  if (paymentPageLoader) return null;

  return (
    <div 
      onClick={navigateCourse}
      className="group relative bg-gray-800 border border-gray-700 rounded-xl w-[330px] h-[340px] overflow-hidden transition-all duration-300 hover:border-red-600/50 hover:shadow-xl hover:shadow-black/40 cursor-pointer"
    >
      {/* Delete Button */}
      {(accountType === "Admin" || location.pathname.includes("cart")) && (
        <button
          disabled={deleteLoading}
          onClick={deleteCourse}
          className="absolute top-2 right-2 z-10 w-8 h-8 bg-red-600 text-white rounded-full flex items-center justify-center hover:bg-red-700 active:scale-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {deleteLoading ? (
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <MdDelete size={18} />
          )}
        </button>
      )}

      {/* Thumbnail Area */}
      <div className="relative h-40 w-full overflow-hidden bg-gray-900 border-b border-gray-700">
        <img
          src={thumbnail}
          alt={name}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute bottom-2 left-2 bg-black/70 backdrop-blur-md px-2 py-1 rounded text-[10px] font-bold text-white flex items-center gap-1 border border-white/10">
          <FaStar className="text-yellow-500" /> {averageRating.toFixed(1)}
        </div>
      </div>

      {/* Info Content Area */}
      <div className="p-4 flex flex-col justify-between h-[180px]">
        <div>
          <h3 className="text-gray-100 font-bold text-sm line-clamp-1 group-hover:text-red-500 transition-colors uppercase">
            {name}
          </h3>
          <p className="text-gray-400 text-xs mt-1 line-clamp-2 leading-relaxed">
            {description}
          </p>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="bg-gray-900 px-2 py-1 rounded border border-gray-700 text-[9px] text-gray-500 font-bold flex items-center gap-1 uppercase">
              <FaGlobe size={10} /> {language}
            </div>
            <div className="text-red-600 font-bold text-base">
              ₹{price.toLocaleString()}
            </div>
          </div>

          <button
            disabled={purchaseButtonLoading}
            onClick={(e) => {
              e.stopPropagation();
              location.pathname.includes("cart") ? purchaseCourse(e) : handleSubmit();
            }}
            className="w-full py-2 bg-red-600 hover:bg-red-700 text-white text-[11px] font-bold rounded-lg transition-all flex items-center justify-center gap-2 active:scale-[0.98]"
          >
            {purchaseButtonLoading ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                {location.pathname.includes("cart") ? <BiSolidPurchaseTag /> : accountType === "Instructor" ? <FaEdit /> : <FaLocationArrow />}
                <span className="uppercase">{location.pathname.includes("cart") ? "Purchase" : accountType === "Instructor" ? "Edit" : "Explore"}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
});

export default CourseCard;