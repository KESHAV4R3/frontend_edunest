import React, { useEffect, useState, useCallback, memo } from "react";
import { apiConnector } from "../../services/apiConnector";
import { apiLinks } from "../../services/apiLink";
import CourseCard from "../../components/dashBoardpage/CourseCard";
import { useSelector } from "react-redux";
import { GrFormPrevious, GrFormNext } from "react-icons/gr";

const DashboardPageCourses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = useSelector((state) => state.profile.user);

  const [currentPage, setCurrentPage] = useState(1);
  const [paginationInfo, setPaginationInfo] = useState({
    totalPages: 1,
    hasPreviousPage: false,
    isLastPage: false,
  });

  const getAllCourses = useCallback(async (page = 1) => {
    try {
      setLoading(true);
      const url = user?.accountType === "Admin" ? apiLinks.getAllCoursesInDataBase : apiLinks.getAllCourses;
      const response = await apiConnector("GET", url, null, null, { page });

      if (response?.success) {
        setCourses(response.data?.courses || []);
        setPaginationInfo(response.data?.pagination || {});
      }
    } catch (error) {
      console.error("Fetch Error:", error);
      setCourses([]);
    } finally {
      setLoading(false);
    }
  }, [user?.accountType]);

  useEffect(() => {
    getAllCourses(currentPage);
  }, [currentPage, getAllCourses]);

  if (loading) {
    return (
      <div className="w-full py-32 flex flex-col items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-red-600 mb-4 shadow-[0_0_15px_rgba(220,38,38,0.5)]"></div>
        <p className="text-gray-500 text-xs uppercase tracking-[0.3em] animate-pulse">Synchronizing Grid...</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-[1400px] mx-auto p-1 flex flex-col min-h-full">
      <h1 className="text-3xl font-black text-gray-100 mb-10 text-center tracking-tight">
        YOUR <span className="text-red-600 ml-2">COURSES</span>
      </h1>

      {/* --- Course Container: Centered Flex --- */}
      <div className="flex-1">
        {courses.length === 0 ? (
          <div className="py-40 text-center">
            <p className="text-gray-500 italic text-lg">No courses found in this sector.</p>
          </div>
        ) : (
          <div className="flex flex-wrap justify-center gap-8 pb-10">
            {courses.map((course) => (
              <div key={course._id} className="transition-transform duration-300 hover:z-10">
                <CourseCard course={course} id={course._id} />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* --- Highlighted Pagination Bar --- */}
      {courses.length > 0 && (
        <div className=" mx-auto mt-auto flex items-center justify-center gap-8 py-4 px-8 bg-gray-800/80 backdrop-blur-md border border-gray-700 rounded-2xl shadow-2xl z-20">
          
          {/* Prev Button */}
          <button
            onClick={() => setCurrentPage(prev => prev - 1)}
            disabled={!paginationInfo.hasPreviousPage}
            className={`group flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-black tracking-widest transition-all border-2 ${
              !paginationInfo.hasPreviousPage 
              ? "opacity-10 cursor-not-allowed border-transparent text-gray-600" 
              : "bg-gray-900 text-gray-300 border-gray-700 hover:border-red-600 hover:text-white hover:shadow-[0_0_20px_rgba(220,38,38,0.2)]"
            }`}
          >
            <GrFormPrevious size={22} className="group-hover:-translate-x-1 transition-transform" /> 
            PREV
          </button>

          {/* Highlighted Page Indicator */}
          <div className="flex items-center gap-3">
            <span className="text-[10px] uppercase font-black tracking-widest text-gray-500 hidden sm:block">Page</span>
            <div className="flex items-center justify-center w-12 h-12 bg-red-600 text-white rounded-xl shadow-[0_0_20px_rgba(220,38,38,0.4)] text-lg font-black border-2 border-red-500">
              {currentPage}
            </div>
            <span className="text-gray-500 font-black">/</span>
            <span className="text-lg font-black text-gray-400">{paginationInfo.totalPages}</span>
          </div>

          {/* Next Button */}
          <button
            onClick={() => setCurrentPage(prev => prev + 1)}
            disabled={paginationInfo.isLastPage}
            className={`group flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-black tracking-widest transition-all border-2 ${
              paginationInfo.isLastPage 
              ? "opacity-10 cursor-not-allowed border-transparent text-gray-600" 
              : "bg-gray-900 text-gray-300 border-gray-700 hover:border-red-600 hover:text-white hover:shadow-[0_0_20px_rgba(220,38,38,0.2)]"
            }`}
          >
            NEXT 
            <GrFormNext size={22} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      )}
    </div>
  );
};

export default memo(DashboardPageCourses);