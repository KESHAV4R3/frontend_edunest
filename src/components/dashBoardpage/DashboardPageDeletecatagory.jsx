import React, { useEffect, useState, useCallback, memo } from "react";
import { MdDelete } from "react-icons/md";
import { apiConnector } from "../../services/apiConnector";
import { apiLinks } from "../../services/apiLink";
import { toast } from "react-toastify";
import { setCatagory } from "../../redux/slices/applicationSlice";
import { useDispatch, useSelector } from "react-redux";
import { setLoading } from "../../redux/slices/uiSlice";

const DashboardPageDeletecatagory = () => {
  const dispatch = useDispatch();
  const catagories = useSelector(state => state.application.catagories) || [];
  const { loading } = useSelector((state) => state.ui) || { loading: false };
  const [loadingId, setLoadingId] = useState(null);

  const fetchAllcatagories = useCallback(async () => {
    dispatch(setLoading(true));
    try {
      const response = await apiConnector("GET", apiLinks.get_catagory_list);
      if (response?.success) {
        dispatch(setCatagory(response.category));
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      dispatch(setLoading(false));
    }
  }, [dispatch]);

  const deleteCatagory = async (id) => {
    setLoadingId(id);
    try {
      const url = apiLinks.delete_catagory.replace(":id", id);
      const response = await apiConnector("DELETE", url);
      
      if (response?.success) {
        toast.success("Category deleted");
        await fetchAllcatagories();
      } else {
        toast.error(response?.message || "Deletion failed");
      }
    } catch (error) {
      console.error("Delete Error:", error);
      toast.error("Internal server error");
    } finally {
      setLoadingId(null);
    }
  };

  useEffect(() => {
    fetchAllcatagories();
  }, [fetchAllcatagories]);

  if (loading && !loadingId) {
    return (
      <div className="w-full py-32 flex flex-col items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-red-600 mb-4 shadow-[0_0_15px_rgba(220,38,38,0.5)]"></div>
        <p className="text-gray-500 text-xs uppercase tracking-[0.3em] animate-pulse font-black">Syncing Categories...</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-[1200px] mx-auto p-1 flex flex-col min-h-full">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-black text-gray-100 tracking-tight uppercase">
          MANAGE <span className="text-red-600 ml-2">CATEGORIES</span>
        </h1>
        <p className="text-[13px] text-gray-500 font-bold mt-2 uppercase">
          Delete or review available course categories
        </p>
      </div>

      <div className="flex flex-wrap justify-center gap-4">
        {catagories.length > 0 ? (
          catagories.map((value) => (
            <div
              key={value._id}
              className="group flex justify-between items-center bg-gray-800 border border-gray-700 w-full md:w-[48%] xl:w-[31%] rounded-xl p-4 transition-all hover:border-red-600/50 hover:shadow-xl hover:shadow-black/40"
            >
              <div className="flex flex-col">
                <span className="text-[10px] text-gray-500 font-black uppercase tracking-widest mb-1">Category Name</span>
                <span className="text-gray-100 font-bold tracking-tight">{value.name}</span>
              </div>

              <button
                onClick={() => deleteCatagory(value._id)}
                disabled={loadingId === value._id}
                className="w-10 h-10 flex items-center justify-center text-white rounded-lg bg-red-600 hover:bg-red-700 transition-all disabled:opacity-30 disabled:cursor-not-allowed shadow-lg shadow-red-900/20"
              >
                {loadingId === value._id ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                  <MdDelete size={20} />
                )}
              </button>
            </div>
          ))
        ) : (
          <div className="py-20 text-center text-gray-500 font-bold tracking-widest uppercase italic">
            No categories available to display
          </div>
        )}
      </div>
    </div>
  );
};

export default memo(DashboardPageDeletecatagory);