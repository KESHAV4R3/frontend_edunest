import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { apiConnector } from "../../services/apiConnector";
import { apiLinks } from "../../services/apiLink";
import { toast } from "react-toastify";
import { FiSend } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { setLoading, setError } from "../../redux/slices/uiSlice";

const ContactForm = () => {
  const dispatch = useDispatch();
  // We can use local loading for the button spinner if we want, 
  // or use the global loading state. 
  // Using global loading state as requested.
  const { loading } = useSelector((state) => state.ui);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitSuccessful },
  } = useForm();

  useEffect(() => {
    if (isSubmitSuccessful) {
      reset({ firstname: "", lastname: "", email: "", message: "" });
    }
  }, [reset, isSubmitSuccessful]);

  // function to send message to user
  async function submitMessage(data) {
    dispatch(setLoading(true));
    try {
      const response = await apiConnector(
        "POST",
        apiLinks.sendmailToAdmin,
        {
          "Content-Type": "application/json",
        },
        {
          firstName: data.firstname,
          lastName: data.lastname,
          email: data.email,
          message: data.message,
        }
      );

      if (!response.success) {
        toast.error("Unable to send message", {
          autoClose: 900,
          hideProgressBar: true,
          pauseOnHover: false,
          closeOnClick: true,
          draggable: false,
        });
        return;
      }

      toast.success("Message sent successfully", {
        autoClose: 900,
        hideProgressBar: true,
        pauseOnHover: false,
        closeOnClick: true,
        draggable: false,
      });
    } catch (error) {
      dispatch(setError("Something went wrong while sending message"));
      toast.error("Something went wrong", {
        autoClose: 900,
        hideProgressBar: true,
        pauseOnHover: false,
        closeOnClick: true,
        draggable: false,
      });
    } finally {
      dispatch(setLoading(false));
    }
  }

  return (
    <div>
      <form
        onSubmit={handleSubmit(submitMessage)}
        className="flex flex-col gap-5 mt-4 text-start w-full md:max-w-[510px] m-auto"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col">
            <label
              htmlFor="firstName"
              className="select-none text-gray-300 font-medium mb-2"
            >
              First Name <span className="text-dark_red ml-1">*</span>
            </label>
            <input
              type="text"
              placeholder="Enter first name"
              id="firstName"
              {...register("firstname", { required: true })}
              className="p-3 w-full border text-gray-300 border-gray-600 rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-700 bg-transparent"
            />
            {errors.firstname && (
              <span className="text-red-500">Please enter your first name</span>
            )}
          </div>

          <div className="flex flex-col">
            <label
              htmlFor="lastName"
              className="select-none text-gray-300 font-medium mb-2"
            >
              Last Name
            </label>
            <input
              type="text"
              placeholder="Enter last name"
              id="lastName"
              {...register("lastname")}
              className="p-3 w-full border text-gray-300 border-gray-600 rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-700 bg-transparent"
            />
          </div>
        </div>

        <div className="flex flex-col">
          <label
            htmlFor="email"
            className="select-none text-gray-300 font-medium mb-2"
          >
            Email Address <span className="text-dark_red ml-1">*</span>
          </label>
          <input
            type="email"
            id="email"
            placeholder="Enter your email"
            {...register("email", { required: true })}
            className="p-3 border text-gray-300 border-gray-600 rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-700 bg-transparent"
            autoComplete="off"
          />
          {errors.email && (
            <span className="text-red-500">
              Please enter a valid email address
            </span>
          )}
        </div>

        <div className="flex flex-col">
          <label
            htmlFor="message"
            className="select-none text-gray-300 font-medium mb-2"
          >
            Message <span className="text-dark_red ml-1">*</span>
          </label>
          <textarea
            id="message"
            placeholder="Enter your message"
            {...register("message", { required: true })}
            className="p-3 w-full min-h-[48px] border text-gray-300 border-gray-600 rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-700 bg-transparent"
          ></textarea>
          {errors.message && (
            <span className="text-red-500">Please enter your message</span>
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full mt-5 flex justify-center items-center py-2 px-4 bg-dark_red hover:bg-dark_red/80 cursor-pointer text-white font-medium rounded-md transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          ) : (
            <>
              <FiSend className="mr-2" />
              Send Message
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default React.memo(ContactForm);
