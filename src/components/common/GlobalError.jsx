import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { clearError } from "../../redux/slices/uiSlice";
import { RxCross2 } from "react-icons/rx";

const GlobalError = () => {
    const { error } = useSelector((state) => state.ui);
    const dispatch = useDispatch();

    if (!error) return null;

    return (
        <div className="fixed top-24 right-5 z-[1000] animate-slide-in">
            <div className="bg-red-600 text-white px-6 py-4 rounded-lg shadow-xl flex items-center gap-4 max-w-md">
                <p className="font-medium">{error}</p>
                <button
                    onClick={() => dispatch(clearError())}
                    className="hover:bg-red-700 p-1 rounded-full transition-colors"
                >
                    <RxCross2 className="text-xl" />
                </button>
            </div>
        </div>
    );
};

export default React.memo(GlobalError);
