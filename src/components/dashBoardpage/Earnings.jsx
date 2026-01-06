import React, { useEffect, useState, useCallback, useMemo, memo } from "react";
import { apiConnector } from "../../services/apiConnector";
import { apiLinks } from "../../services/apiLink";
import { FiUsers, FiTrendingUp, FiLayers, FiCalendar } from "react-icons/fi";
import { MdOutlineAttachMoney, MdDashboard } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { setLoading } from "../../redux/slices/uiSlice";
import { toast } from "react-toastify";

const Earnings = () => {
  const [data, setData] = useState(null);
  const dispatch = useDispatch();
  const loading = useSelector((state) => state.ui.loading);

  const fetchAnalytics = useCallback(async () => {
    try {
      dispatch(setLoading(true));
      const response = await apiConnector("GET", apiLinks.getAllEarnings);
      if (response?.success) {
        setData(response.analytics);
      }
    } catch (error) {
      toast.error("Analytics synchronization failed");
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
        <p className="text-gray-500 text-xs uppercase tracking-[0.3em] font-black animate-pulse">Syncing Control Center...</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-[1400px] mx-auto p-1 flex flex-col min-h-full text-gray-100">
      
      {/* --- Page Title --- */}
      <div className="mb-10 text-center md:text-left">
        <h1 className="text-3xl text-center font-black tracking-tight uppercase">
          ANALYTICS <span className="text-red-600 ml-2">DASHBOARD</span>
        </h1>
        <p className="text-[15px] text-center text-gray-500 font-black mt-1">
          Operational Overview & Financial Metrics
        </p>
      </div>

      {/* --- Top Global Metrics Grid --- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {[
          { label: "Overall Earnings", val: `₹${data?.totalOverallRevenue?.toLocaleString()}`, icon: <MdOutlineAttachMoney/>, color: "text-green-500" },
          { label: "Total Students", val: data?.totalOverallStudents, icon: <FiUsers/>, color: "text-blue-500" },
          { label: "Live Courses", val: data?.totalLiveCourses, icon: <FiLayers/>, color: "text-purple-500" },
          { label: "Last Deployment", val: data?.lastCourse ? new Date(data.lastCourse.createdAt).toLocaleDateString() : "N/A", icon: <FiCalendar/>, color: "text-red-600" },
        ].map((stat, i) => (
          <div key={i} className="bg-gray-800 border border-gray-700 p-5 rounded-2xl flex items-center gap-4 shadow-xl">
            <div className={`p-3 rounded-xl bg-gray-900 ${stat.color} text-2xl shadow-inner border border-gray-700/50`}>
              {stat.icon}
            </div>
            <div>
              <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest">{stat.label}</p>
              <p className="text-xl font-black tracking-tight">{stat.val}</p>
            </div>
          </div>
        ))}
      </div>

      {/* --- Featured Detail: Last Created Course --- */}
      {data?.lastCourse && (
        <div className="bg-gray-800 border-2 border-red-600/20 rounded-2xl p-6 mb-10 flex flex-col md:flex-row items-center gap-2 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 bg-red-600 text-white px-4 py-1 text-[9px] font-black uppercase tracking-widest">Recent Activity</div>
          <img src={data.lastCourse.thumbnail} className="w-full md:w-48 h-32 object-cover rounded-xl border border-gray-700 shadow-lg" alt="" />
          <div className="flex-1 space-y-2">
            <h3 className="text-xl font-black uppercase tracking-tight text-white">{data.lastCourse.name}</h3>
            <p className="text-gray-400 text-sm font-medium">Successfully deployed on {new Date(data.lastCourse.createdAt).toLocaleDateString()}</p>
            <div className="flex gap-4 pt-2">
               <span className="text-[10px] font-black uppercase bg-gray-900 border border-gray-700 px-3 py-1 rounded text-gray-300">Price: ₹{data.lastCourse.price}</span>
               <span className="text-[10px] font-black uppercase bg-gray-900 border border-gray-700 px-3 py-1 rounded text-gray-300">Enrollment: {data.lastCourse.students}</span>
            </div>
          </div>
        </div>
      )}

      {/* --- Main Course Data Table --- */}
      <div className="flex-1 overflow-x-auto scrollbar-hide bg-gray-800 border border-gray-700 rounded-2xl shadow-2xl mb-10">
        <table className="w-full text-left border-collapse min-w-[900px]">
          <thead className="bg-gray-900/80 border-b border-gray-700">
            <tr>
              <th className="p-5 text-[11px] font-black uppercase text-gray-200 tracking-widest">Curriculum</th>
              <th className="p-5 text-[11px] font-black uppercase text-gray-200 tracking-widest text-center">Student Load</th>
              <th className="p-5 text-[11px] font-black uppercase text-gray-200 tracking-widest text-center">Net Yield</th>
              <th className="p-5 text-[11px] font-black uppercase text-gray-200 tracking-widest">Performance Index</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700/50">
            {data?.courses?.map((course) => (
              <tr key={course.id} className="hover:bg-gray-700/30 transition-colors group">
                <td className="p-5">
                  <div className="flex items-center gap-4">
                    <img src={course.thumbnail} className="w-12 h-12 rounded-lg object-cover border border-gray-700" alt="" />
                    <span className="text-sm font-bold text-gray-100 uppercase tracking-tight">{course.name}</span>
                  </div>
                </td>
                <td className="p-5 text-center text-gray-300 font-bold text-sm">
                  {course.students} Users
                </td>
                <td className="p-5 text-center text-red-500 font-black text-sm">
                  ₹{course.revenue.toLocaleString()}
                </td>
                <td className="p-5 min-w-[200px]">
                  <div className="flex flex-col gap-2">
                    <div className="flex justify-between text-[9px] font-black uppercase text-gray-500 tracking-widest">
                      <span>Course Yield</span>
                      <span>{course.yieldRate}%</span>
                    </div>
                    <div className="w-full bg-gray-900 h-1.5 rounded-full overflow-hidden border border-gray-700">
                      <div 
                        className="bg-red-600 h-full transition-all duration-1000 shadow-[0_0_8px_rgba(220,38,38,0.5)]"
                        style={{ width: `${course.yieldRate}%` }}
                      />
                    </div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default memo(Earnings);