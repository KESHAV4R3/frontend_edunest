import { toast } from "react-toastify";
import { apiConnector } from "./apiConnector";
import { apiLinks } from "./apiLink";
import edunest_logo_2 from "../assets/edunest_logo_2.png";
import { setPaymentLoading } from "../redux/slices/profileSlice";
import { useDispatch } from "react-redux";
function loadScript(src) {
  // add <script src="https://checkout.razorpay.com/v1/checkout.js"></script> in html
  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = src;
    script.onload = () => {
      resolve(true);
    };
    script.onerror = () => {
      resolve(false);
    };
    document.body.appendChild(script);
  });
}

export async function buyCourse(
  courses,
  userdetail,
  navigate,
  setLoadingCallback,
  onPaymentSuccess
) {
  try {
    const res = await loadScript(
      "https://checkout.razorpay.com/v1/checkout.js"
    );
    if (!res) {
      toast.error("Razorpay connection failed", {
        autoClose: 900,
        hideProgressBar: true,
        pauseOnHover: false,
        closeOnClick: true,
        draggable: false,
      });
      return;
    }

    const orderResponse = await apiConnector(
      "POST",
      apiLinks.capturePayment,
      null,
      { courses }
    );

    if (!orderResponse.success) {
      toast.error(orderResponse.message, {
        autoClose: 900,
        hideProgressBar: true,
        pauseOnHover: false,
        closeOnClick: true,
        draggable: false,
      });
      return;
    }

    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY,
      currency: orderResponse.message.currency,
      amount: orderResponse.message.amount,
      order_id: orderResponse.message.id,
      name: "Edunest Edtech Pvt. Ltd.",
      description: "Thank you for purchasing the course",
      image: edunest_logo_2,
      prefill: {
        name: `${userdetail.firstName} ${userdetail.lastName}`,
        email: userdetail.email,
      },
      handler: async function (response) {
        try {
          // Start loading AFTER Razorpay modal closes
          setLoadingCallback(true);

          const verificationResponse = await apiConnector(
            "POST",
            apiLinks.verifypayment,
            null,
            { ...response, courses }
          );


          toast.success("Payment successful! Course added to your basket", {
            autoClose: 900,
            hideProgressBar: true,
            pauseOnHover: false,
            closeOnClick: true,
            draggable: false,
          });

          // Call success callback if provided
          if (onPaymentSuccess) {
            await onPaymentSuccess();
          }

          // Keep loading visible during navigation delay
          setTimeout(() => {
            navigate("/dashboard/courses");
            setLoadingCallback(false);
          }, 1500);
        } catch (error) {
          console.error("Error in verifying payment:", error);
          toast.error("Could not verify the payment", {
            autoClose: 900,
            hideProgressBar: true,
            pauseOnHover: false,
            closeOnClick: true,
            draggable: false,
          });
          setLoadingCallback(false);
        }
      },
      modal: {
        ondismiss: function () {
          // Handle case when user closes the modal
          toast.info("Payment window closed", {
            autoClose: 900,
            hideProgressBar: true,
            pauseOnHover: false,
            closeOnClick: true,
            draggable: false,
          });
          setLoadingCallback(false);
        },
      },
    };

    const paymentObject = new window.Razorpay(options);
    paymentObject.open();
  } catch (error) {
    console.error("Payment error:", error);
    toast.error("Could not make the payment at this moment, try again", {
      autoClose: 900,
      hideProgressBar: true,
      pauseOnHover: false,
      closeOnClick: true,
      draggable: false,
    });
    setLoadingCallback(false);
  }
}
// verifyPayment function
async function verifyPayment(bodyData, navigate, dispatch) {
  try {
    const response = await apiConnector(
      "POST",
      apiLinks.verifypayment,
      null,
      bodyData
    );

    if (!response.success) {
      dispatch(setPaymentLoading(false));
      toast.error("Payment verification failed");
      return;
    }

    toast.success("Payment successful! Course added to your basket");
    // Give some time for the toast to show before navigating
    setTimeout(() => {
      navigate("/dashboard/courses");
      dispatch(setPaymentLoading(false));
    }, 1000);
  } catch (error) {
    console.log("Error in verifying payment:", error);
    dispatch(setPaymentLoading(false));
    toast.error("Could not verify the payment");
  }
}
