import React, { useState, useCallback, memo } from "react";
import { apiConnector } from "../../services/apiConnector";
import { apiLinks } from "../../services/apiLink";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { setCatagory } from "../../redux/slices/applicationSlice";
import { GrCatalog } from "react-icons/gr";
import { setLoading } from "../../redux/slices/uiSlice";

const DashboardPageAddcatagory = () => {
  const dispatch = useDispatch();
  const [displayCatagory, setDisplayCatagory] = useState("");
  const { loading } = useSelector((state) => state.ui) || { loading: false };

  const catagoryUpdateHandler = useCallback((event) => {
    setDisplayCatagory(event.target.value);
  }, []);

  const addcatagoryBackendCall = async (event) => {
    event.preventDefault();
    if (!displayCatagory.trim()) {
      toast.error("Please enter a category name");
      return;
    }

    dispatch(setLoading(true));
    try {
      const response = await apiConnector(
        "POST",
        apiLinks.create_catagory,
        null,
        { name: displayCatagory }
      );
      
      if (response?.success) {
        setDisplayCatagory("");
        toast.success(response.message || "Category Created");
        dispatch(setCatagory(response.allCatagory));
      } else {
        toast.error(response?.message || "Creation failed");
      }
    } catch (error) {
      console.error("Add Category Error:", error);
      toast.error("Internal Server Error");
    } finally {
      dispatch(setLoading(false));
    }
  };

  return (
    <div className="flex justify-center items-center min-h-[70vh] w-full p-4">
      <div className="w-full max-w-[450px] bg-gray-800 border-2 border-gray-700 rounded-2xl shadow-2xl p-6 md:p-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-black text-white tracking-tight uppercase">
            ADD <span className="text-red-600 ml-2">CATEGORY</span>
          </h1>
          <p className="text-[13px] text-gray-400 font-bold mt-2 uppercase">
            Create a new course classification
          </p>
        </div>

        <form onSubmit={addcatagoryBackendCall} className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="catagory" className="text-[11px] uppercase tracking-widest text-gray-200 font-black ml-1">
              Category Name
            </label>
            <input
              type="text"
              id="catagory"
              value={displayCatagory}
              onChange={catagoryUpdateHandler}
              placeholder="e.g. Web Development"
              className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-4 text-white outline-none focus:border-red-600 transition-all placeholder:text-gray-600 font-medium"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-red-600 hover:bg-red-700 text-white font-black py-4 rounded-xl transition-all shadow-lg shadow-red-900/20 flex justify-center items-center gap-2 uppercase tracking-widest text-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            ) : (
              <>
                <GrCatalog size={18} />
                Create Category
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default memo(DashboardPageAddcatagory);