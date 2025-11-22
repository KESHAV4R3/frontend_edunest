import React, { useEffect, useState } from "react";
import { apiConnector } from "../../services/apiConnector";
import { apiLinks } from "../../services/apiLink";
import { toast } from "react-toastify";
import { FiSend } from "react-icons/fi";
import { RxCross2 } from "react-icons/rx";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setLoading } from "../../redux/slices/uiSlice";

const DashboardMessageToUser = () => {
  const [data, setData] = useState({ name: "", email: "" });
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.ui);

  useEffect(() => {
    if (localStorage.getItem("MailUserData")) {
      setData(JSON.parse(localStorage.getItem("MailUserData")));
    }
  }, []);

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setMessage(e.target.value);
  };

  async function submitMessage(e) {
    e.preventDefault();
    dispatch(setLoading(true));
    try {
      const response = await apiConnector(
        "POST",
        apiLinks.sendmailToUser,
        null,
        {
          name: data.name,
          email: data.email,
          message: message,
        }
      );

      if (!response.success) {
        toast.error("Unable to send message", {
          autoClose: 2000,
          hideProgressBar: true,
          pauseOnHover: false,
          closeOnClick: true,
          draggable: false,
        });
        return;
      }

      toast.success(response.message, {
        autoClose: 2000,
        hideProgressBar: true,
        pauseOnHover: false,
        closeOnClick: true,
        draggable: false,
      });
    } catch (error) {
      console.error("Error while sending message:", error);
    } finally {
      setMessage("");
      localStorage.removeItem("MailUserData");
      dispatch(setLoading(false));
    }
  }

  return (
    <div className="relative mt-20 rounded-lg p-6 bg-gray-800 w-full max-w-2xl mx-auto shadow-lg border border-gray-700">
      <div
        onClick={() => {
          navigate(-1);
        }}
        className="absolute top-3 right-3 hover:scale-110 cursor-pointer bg-gray-700 rounded-full w-[30px] h-[30px] flex justify-center items-center"
      >
        <RxCross2 className="text-[20px]" />
      </div>

      <h2 className="text-2xl font-bold text-center text-gray-100 mb-6">
        Send Message to User
      </h2>

      <form onSubmit={submitMessage} className="space-y-4">
        <div>
          <label
            htmlFor="message"
            className="block text-md font-medium text-gray-300 mb-1"
          >
            Your Message
          </label>
          <textarea
            id="message"
            name="message"
            value={message}
            onChange={handleChange}
            rows="5"
            className="w-full px-4 py-2 rounded-md bg-gray-700 border border-gray-600 text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            required
          />
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

export default React.memo(DashboardMessageToUser);
