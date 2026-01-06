import React, { useState, useEffect, useCallback, Suspense } from "react";
import { apiConnector } from "../services/apiConnector";
import { apiLinks } from "../services/apiLink";
import { useDispatch, useSelector } from "react-redux";
import { setCartCourses } from "../redux/slices/applicationSlice";
import { toast } from "react-toastify";
import { buyCourse } from "../services/razorPayIntegration";
import { useNavigate } from "react-router-dom";
import { setPaymentLoading } from "../redux/slices/profileSlice";

// Lazy load CourseCard
const CourseCard = React.lazy(() =>
  import("../components/dashBoardpage/CourseCard")
);

const SpinnerLoader = () => {
  return (
    <div className="flex justify-center items-center h-[50vh]">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-300"></div>
    </div>
  );
};

const CartPage = () => {
  const navigate = useNavigate();
  const cartCourses = useSelector((state) => state.application.cartCourses);
  const user = useSelector((state) => state.profile.user);
  const [purchaseButtonLoading, setPurchaseButtonLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [totalPrice, setTotalPrice] = useState(0);
  const [paymentCompleted, setPaymentCompleted] = useState(false);
  const dispatch = useDispatch();

  // Create an array of course IDs
  const courseIds = cartCourses?.map((course) => course._id) || [];

  // Calculate cart price
  useEffect(() => {
    const price =
      cartCourses?.reduce((sum, course) => sum + course.price, 0) || 0;
    setTotalPrice(price);
  }, [cartCourses]);

  const fetchCartData = useCallback(async () => {
    try {
      setLoading(true);
      const response = await apiConnector("GET", apiLinks.getCartCourse);
      if (response?.success) {
        dispatch(setCartCourses(response?.courses?.cartCourse || []));
      } else {
        toast.error("Failed to fetch cart data");
      }
    } catch (error) {
      toast.error("Error fetching cart data");
      console.error("Error fetching cart data:", error);
    } finally {
      setLoading(false);
    }
  }, [dispatch]);

  useEffect(() => {
    fetchCartData();
  }, [fetchCartData]);

  const handleResetCart = async (e) => {
    if (e) e.preventDefault();
    try {
      setLoading(true);
      const response = await apiConnector(
        "DELETE",
        apiLinks.removeAllCourseFromCart
      );
      if (response.success) {
        dispatch(setCartCourses([]));
        setTotalPrice(0);
        toast.success("Cart cleared successfully", {
          autoClose: 900,
          hideProgressBar: true,
          pauseOnHover: false,
          closeOnClick: true,
          draggable: false,
        });
      } else {
        toast.error("Failed to clear cart", {
          autoClose: 900,
          hideProgressBar: true,
          pauseOnHover: false,
          closeOnClick: true,
          draggable: false,
        });
      }
    } catch (error) {
      toast.error("Error clearing cart", {
        autoClose: 900,
        hideProgressBar: true,
        pauseOnHover: false,
        closeOnClick: true,
        draggable: false,
      });
      console.error("Error resetting cart:", error);
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = async () => {
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
      await buyCourse(
        courseIds,
        user,
        navigate,
        (isLoading) => {
          dispatch(setPaymentLoading(isLoading));
        },
        async () => {
          // This callback runs ONLY on successful payment verification
          setPaymentCompleted(true);
          await handleResetCart();
          
          // Show success message and redirect
          toast.success("Payment successful! Redirecting to your courses...", {
            autoClose: 2000,
            hideProgressBar: false,
            pauseOnHover: false,
            closeOnClick: true,
            draggable: false,
          });
          
          // Redirect after a short delay to show the success message
          setTimeout(() => {
            navigate("/dashboard/courses");
          }, 2000);
        }
      );
    } catch (error) {
      console.error("Purchase failed:", error);
      toast.error("Payment failed. Please try again.", {
        autoClose: 900,
        hideProgressBar: true,
        pauseOnHover: false,
        closeOnClick: true,
        draggable: false,
      });
      dispatch(setPaymentLoading(false));
    } finally {
      setPurchaseButtonLoading(false);
    }
  };

  const SelectedLoader = SpinnerLoader;

  // Show loading state
  if (loading) {
    return <SelectedLoader />;
  }

  // Show payment completion state
  if (paymentCompleted) {
    return (
      <div className="w-full h-full flex justify-center items-center -mt-10">
        <div className="text-center">
          <div className="text-green-500 text-6xl mb-4">✓</div>
          <p className="text-gray-300 text-[25px] mb-4">Payment Successful!</p>
          <p className="text-gray-400">Redirecting to your courses...</p>
        </div>
      </div>
    );
  }

  // Show empty cart state
  if (cartCourses.length === 0) {
    return (
      <div className="w-full h-full flex justify-center items-center -mt-10">
        <div className="text-center">
          <p className="text-gray-300 text-[25px] mb-4">No course available in cart</p>
          <button
            onClick={() => navigate("/dashboard/courses")}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
          >
            Browse Courses
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col justify-center items-center gap-8 p-6">
      <div className="flex justify-center items-center gap-6 w-full flex-wrap p-5 text-gray-300">
        <Suspense fallback={<SpinnerLoader />}>
          {cartCourses?.map((value, index) => (
            <CourseCard course={value} id={value._id} key={index} />
          ))}
        </Suspense>
      </div>

      <div className="w-full max-w-4xl bg-gray-800 rounded-lg p-6 shadow-lg">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-white">Order Summary</h3>
          <button
            onClick={handleResetCart}
            disabled={loading}
            className="px-4 py-2 cursor-pointer bg-red-600 hover:bg-red-700 text-white rounded-md transition-colors disabled:opacity-50"
          >
            {loading ? "Processing..." : "Reset Cart"}
          </button>
        </div>

        <div className="flex justify-between items-center py-4 border-b border-gray-700">
          <span className="text-gray-300">Subtotal</span>
          <span className="text-white font-medium">
            ₹ {totalPrice.toFixed(2)}
          </span>
        </div>

        <div className="flex justify-between items-center py-4 border-b border-gray-700">
          <span className="text-gray-300">Tax</span>
          <span className="text-white font-medium">₹ 0.00</span>
        </div>

        <div className="flex justify-between items-center py-4 mb-6">
          <span className="text-xl font-bold text-white">Total</span>
          <span className="text-xl font-bold text-white">
            ₹ {totalPrice.toFixed(2)}
          </span>
        </div>

        <button
          onClick={handlePayment}
          disabled={
            loading || cartCourses.length === 0 || purchaseButtonLoading
          }
          className="w-full py-3 cursor-pointer bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-colors disabled:opacity-50 flex justify-center items-center gap-2"
        >
          {purchaseButtonLoading ? (
            <>
              <div className="inline-block h-5 w-5 animate-spin rounded-full border-2 border-solid border-current border-r-transparent"></div>
              Processing...
            </>
          ) : (
            "Proceed to Payment"
          )}
        </button>
      </div>
    </div>
  );
};

export default CartPage;