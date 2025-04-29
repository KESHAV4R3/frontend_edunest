import React from "react";
import { useState } from "react";
import { apiConnector } from "../../services/apiConnector";
import { apiLinks } from "../../services/apiLink";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { setCatagory } from "../../redux/slices/applicationSlice";
import { GrCatalog } from "react-icons/gr";

const DashboardPageAddcatagory = () => {
  const dispatch = useDispatch();
  const [displayCatagory, setDisplayCatagory] = useState("");
  const [loading, setLoading] = useState(false);
  function catagoryUpdateHandler(event) {
    setDisplayCatagory(event.target.value);
  }

  async function addcatagoryBackendCall(event) {
    setLoading(true);
    event.preventDefault();
    try {
      const response = await apiConnector(
        "POST",
        apiLinks.create_catagory,
        null,
        { name: displayCatagory }
      );
      if (!response.success) {
        toast.error("catagory creation failed", {
          autoClose: 900,
          hideProgressBar: true,
          pauseOnHover: false,
          closeOnClick: true,
          draggable: false,
        });
        return;
      } else {
        setDisplayCatagory("");
        toast.success(response.message, {
          autoClose: 900,
          hideProgressBar: true,
          pauseOnHover: false,
          closeOnClick: true,
          draggable: false,
        });
        dispatch(setCatagory(response.allCatagory));
      }
    } catch (error) {
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex justify-center items-center w-[96%] mt-40 m-auto md:w-[80%]">
      <form className="border flex flex-col gap-5 justify-center items-center border-gray-600 rounded-lg w-[90%] max-w-[500px] p-5">
        <label htmlFor="catagory" className="text-gray-400 text-[20px]">
          Enter catagory
        </label>
        <input
          type="text"
          id="catagory"
          value={displayCatagory}
          onChange={catagoryUpdateHandler}
          placeholder="Enter catagory name"
          className="w-full border-[1px] outline-0 text-[18px] border-gray-700 rounded-lg p-5 justify-center flex items-center text-white"
        />

        <button
          type="submit"
          onClick={addcatagoryBackendCall}
          disabled={loading}
          className="w-full mt-5 flex justify-center items-center py-2 px-4 bg-dark_red hover:bg-dark_red/80 cursor-pointer text-white font-medium rounded-md transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          ) : (
            <>
              <GrCatalog className="mr-2" />
              Add catagory
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default DashboardPageAddcatagory;
