import React from "react";
import { useSelector } from "react-redux";

const GlobalLoading = () => {
    const { loading } = useSelector((state) => state.ui);

    if (!loading) return null;

    return (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="flex flex-col items-center gap-4">
                <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
                <p className="text-white text-lg font-medium">Loading...</p>
            </div>
        </div>
    );
};

export default React.memo(GlobalLoading);
