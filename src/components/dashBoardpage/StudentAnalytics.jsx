import React, { useEffect, useState, useCallback, memo } from "react";
import { apiConnector } from "../../services/apiConnector";
import { apiLinks } from "../../services/apiLink";
import { useDispatch, useSelector } from "react-redux";
import { setLoading } from "../../redux/slices/uiSlice";
import { toast } from "react-toastify";
import { FiBook, FiCheckSquare, FiStar, FiActivity } from "react-icons/fi";
import { Rating } from "@material-tailwind/react";

const StudentAnalytics = () => {
  const [data, setData] = useState(null);
  const dispatch = useDispatch();
  const loading = useSelector((state) => state.ui.loading);

  const fetchAnalytics = useCallback(async () => {
    try {
      dispatch(setLoading(true));
      const response = await apiConnector("GET", apiLinks.getStudentAnalytics);
      if (response?.success) {
        setData(response.analytics);
      }
    } catch (error) {
      toast.error("Failed to sync your analytics data");
    } finally {
      dispatch(setLoading(false));
    }
  }, [dispatch]);

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  if (loading) {
    return (
      <div className="w-full py-40 flex flex-col items-center justify-center bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-red-600 mb-4 shadow-[0_0_15px_rgba(220,38,38,0.5)]"></div>
        <p className="text-gray-500 text-[10px] font-black uppercase tracking-[0.3em] animate-pulse">Analyzing Progress...</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-[1400px] mx-auto p-4 md:p-8 flex flex-col min-h-full text-gray-100 selection:bg-red-600/30">
      
      {/* Page Header */}
      <div className="mb-10 text-center md:text-left">
        <h1 className="text-3xl text-center font-black tracking-tight uppercase">
          LEARNING <span className="text-red-600">DASHBOARD</span>
        </h1>
        <p className="text-[10px] text-center text-gray-500 font-black uppercase tracking-[0.2em] mt-1">
          Real-time Progress Tracking & Feedback Archive
        </p>
      </div>

      {/* --- Top Global Metrics --- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        <div className="bg-gray-800 border border-gray-700 p-6 rounded-2xl flex items-center gap-5 shadow-2xl transition-all hover:border-red-600/30">
          <div className="p-4 rounded-xl bg-gray-900 text-red-600 text-2xl shadow-inner border border-gray-700/50"><FiBook /></div>
          <div>
            <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Enrolled Courses</p>
            <p className="text-2xl font-black">{data?.totalEnrolled || 0}</p>
          </div>
        </div>

        <div className="bg-gray-800 border border-gray-700 p-6 rounded-2xl flex items-center gap-5 shadow-2xl transition-all hover:border-red-600/30">
          <div className="p-4 rounded-xl bg-gray-900 text-green-500 text-2xl shadow-inner border border-gray-700/50"><FiActivity /></div>
          <div>
            <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Overall Completion</p>
            <p className="text-2xl font-black">{data?.overallProgress || 0}%</p>
          </div>
        </div>

        <div className="bg-gray-800 border border-gray-700 p-6 rounded-2xl flex items-center gap-5 shadow-2xl transition-all hover:border-red-600/30">
          <div className="p-4 rounded-xl bg-gray-900 text-blue-500 text-2xl shadow-inner border border-gray-700/50"><FiCheckSquare /></div>
          <div>
            <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Modules Secured</p>
            <p className="text-2xl font-black">{data?.totalModulesCompleted || 0}</p>
          </div>
        </div>
      </div>

      {/* --- Course Cards --- */}
      <div className="flex flex-wrap justify-center gap-8 pb-10">
        {!data || data?.courses?.length === 0 ? (
          <div className="py-20 opacity-40 text-center w-full uppercase font-black tracking-widest text-xs">No active learning datasets found</div>
        ) : (
          data.courses.map((course) => (
            <div key={course.courseId} className="group bg-gray-800 border border-gray-700 rounded-2xl w-full max-w-[400px] overflow-hidden shadow-2xl transition-all duration-300 hover:border-red-600/40">
              <div className="p-6 space-y-6">
                
                {/* Course Header */}
                <div className="flex items-center gap-4">
                  <img src={course.thumbnail} className="w-16 h-16 rounded-xl object-cover border border-gray-700 shadow-lg" alt="" />
                  <h3 className="text-sm font-black uppercase tracking-tight text-gray-100 leading-tight group-hover:text-red-500 transition-colors">
                    {course.courseName}
                  </h3>
                </div>

                {/* Progress Visual */}
                <div className="bg-gray-900/50 p-5 rounded-xl border border-gray-700/50">
                   <div className="flex justify-between items-center mb-2">
                     <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest">Securing Knowledge</span>
                     <span className="text-xs font-black text-red-600">{course.progressPercentage}%</span>
                   </div>
                   <div className="w-full bg-gray-900 h-2 rounded-full overflow-hidden border border-gray-700">
                      <div 
                        className="bg-red-600 h-full rounded-full transition-all duration-1000 shadow-[0_0_10px_rgba(220,38,38,0.5)]"
                        style={{ width: `${course.progressPercentage}%` }}
                      />
                   </div>
                   <p className="text-[9px] text-gray-400 mt-2 font-black uppercase text-right tracking-tighter">
                      {course.completedVideos} / {course.totalVideos} Videos Completed
                   </p>
                </div>

                {/* Feedback Log */}
                <div className="pt-2 border-t border-gray-700/50">
                   <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest mb-3 flex items-center gap-1.5">
                     <FiStar className="text-red-600" /> Subjective evaluation
                   </p>
                   {course.review ? (
                     <div className="space-y-2 bg-gray-900/30 p-3 rounded-xl border border-gray-700/30">
                       <div className="scale-75 origin-left -ml-1">
                          <Rating value={course.review.rating} readonly className="text-red-600" />
                       </div>
                       <p className="text-gray-300 text-xs italic leading-relaxed line-clamp-3">
                         "{course.review.review}"
                       </p>
                     </div>
                   ) : (
                     <div className="py-4 text-center">
                       <p className="text-[9px] font-bold text-gray-700 uppercase italic">No Review Archived</p>
                     </div>
                   )}
                </div>
              </div>

              {/* Status Ribbon */}
              <div className={`py-1.5 text-center ${course.progressPercentage === 100 ? "bg-red-600" : "bg-gray-900/80"}`}>
                 <p className="text-[8px] font-black text-white uppercase tracking-[0.2em]">
                   {course.progressPercentage === 100 ? "Curriculum Fully Secured" : "Learning Session Active"}
                 </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default memo(StudentAnalytics);