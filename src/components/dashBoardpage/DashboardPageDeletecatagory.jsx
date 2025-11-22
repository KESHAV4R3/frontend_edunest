import React, { useEffect, useState, useCallback } from "react";
import { MdDelete } from "react-icons/md";
import { apiConnector } from "../../services/apiConnector";
import { apiLinks } from "../../services/apiLink";
import { toast } from "react-toastify";
import { setCatagory } from "../../redux/slices/applicationSlice";
import { useDispatch, useSelector } from "react-redux";
import { setLoading } from "../../redux/slices/uiSlice";

const DashboardPageDeletecatagory = () => {

  const catagories = useSelector(state => state.application.catagories);
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.ui);
  const [loadingId, setLoadingId] = useState(null);

  // after deletion fetch the catagory list from backend again and place it over th redux slice data
  const fetchAllcatagories = useCallback(async () => {
    dispatch(setLoading(true));
    try {
      const response = await apiConnector("GET", apiLinks.get_catagory_list);
      if (response.success) {
        dispatch(setCatagory(response.category));
      }
      return;
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      dispatch(setLoading(false));
    }
  }, [dispatch]);

  async function deleteCatagory(id) {
    setLoadingId(id);
    dispatch(setLoading(true));
    try {
      const url = apiLinks.delete_catagory.replace(":id", id);
      const response = await apiConnector("DELETE", url);
      if (!response.success) {
        toast.error("something went wrong", {
          autoClose: 900,
          hideProgressBar: true,
          pauseOnHover: false,
          closeOnClick: true,
          draggable: false,
        });
        return;
      } else {
        await fetchAllcatagories();
        toast.success("Catagory deleted successfully", {
          autoClose: 900,
          hideProgressBar: true,
          pauseOnHover: false,
          closeOnClick: true,
          draggable: false,
        });
      }
    } catch (error) { } finally {
      setLoadingId(null);
      dispatch(setLoading(false));
    }
  }

  return (
    <div className="overflow-hidden flex flex-col justify-start items-center w-[96%] mt-5 m-auto mb-10 tablet2:w-[80%]">
      {loading && !loadingId ? (
        <div className="w-full mt-50 flex justify-center items-center h-full gap-4">
          Loading...
          <div className="w-5 h-5 border-4 border-gray-300 border-t-dark_red rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="flex flex-wrap gap-5 justify-center w-full">
          {catagories.map((value) => (
            <div
              key={value._id}
              className="flex justify-between items-center text-[17px] bg-gray-800 
                      w-[90%] tablet2:w-[48%] xl:w-[45%] rounded-lg p-4 min-h-[60px]"
            >
              {value.name}
              <button
                onClick={() => deleteCatagory(value._id)}
                className="w-[120px] cursor-pointer h-[40px] flex items-center justify-center 
                        text-white font-semibold p-3 rounded-lg bg-dark_red 
                        hover:bg-dark_red/80 transition-all duration-300"
                disabled={loadingId === value._id || loading}
              >
                {loadingId === value._id ? (
                  <div className="flex items-center gap-2">
                    <p className="text-sm">Deleting</p>
                    <div className="w-4 h-4 border-2 border-gray-300 border-t-white rounded-full animate-spin"></div>
                  </div>
                ) : (
                  <MdDelete className="text-2xl" />
                )}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default React.memo(DashboardPageDeletecatagory);
