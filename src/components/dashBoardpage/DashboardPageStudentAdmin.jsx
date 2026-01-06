import React, { useState, useEffect, useCallback, memo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { apiConnector } from "../../services/apiConnector";
import { apiLinks } from "../../services/apiLink";
import { setAllStudents } from "../../redux/slices/profileSlice";
import { GrFormPrevious, GrFormNext } from "react-icons/gr";
import { FaEnvelope, FaBriefcase, FaUserTag, FaCommentAlt } from "react-icons/fa";
import { RxCross2 } from "react-icons/rx";
import DashboardMessageToUser from "./DashboardMessageToUser";

const DashboardPageStudentAdmin = () => {
  const dispatch = useDispatch();
  const allStudents = useSelector((state) => state.profile.allStudents) || [];
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showMessageModal, setShowMessageModal] = useState(false);
  
  const [currentPage, setCurrentPage] = useState(1);
  const [paginationInfo, setPaginationInfo] = useState({
    totalPages: 1,
    hasNextPage: false,
    hasPreviousPage: false,
    isLastPage: false,
  });
  const [loading, setLoading] = useState(false);

  const fetchStudents = useCallback(async (page) => {
    try {
      setLoading(true);
      const response = await apiConnector(
        "GET", 
        apiLinks.getAllStudents, 
        null, 
        null, 
        { page: page }
      );

      if (response.success) {
        dispatch(setAllStudents(response.data.students));
        setPaginationInfo(response.data.pagination);
      }
    } catch (error) {
      console.error("Failed to fetch students:", error);
    } finally {
      setLoading(false);
    }
  }, [dispatch]);

  useEffect(() => {
    fetchStudents(currentPage);
  }, [currentPage, fetchStudents]);

  const handleMessageClick = (student) => {
    localStorage.setItem("MailUserData", JSON.stringify({
      name: `${student.firstName} ${student.lastName}`,
      email: student.email
    }));
    setSelectedStudent(student);
    setShowMessageModal(true);
  };

  const handleCloseModal = () => {
    setShowMessageModal(false);
    setSelectedStudent(null);
  };

  if (loading) {
    return (
      <div className="w-full py-32 flex flex-col items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-red-600 mb-4 shadow-[0_0_15px_rgba(220,38,38,0.5)]"></div>
        <p className="text-gray-500 text-xs uppercase tracking-[0.3em] animate-pulse font-black">Loading Students...</p>
      </div>
    );
  }

  return (
    <div className="w-full mx-auto flex flex-col min-h-full">
      <h1 className="text-3xl font-black text-gray-100 mb-10 text-center tracking-tight">
        MANAGE <span className="text-red-600 ml-2">STUDENTS</span>
      </h1>

      <div className="flex-1 overflow-x-auto scrollbar-hide bg-gray-800 border-2 border-gray-700 rounded-2xl shadow-2xl mb-10">
        <table className="w-full text-center border-collapse min-w-[1000px]">
          <thead className="bg-gray-900 border-b-2 border-gray-700">
            <tr>
              <th className="p-5 border-r border-gray-700 text-sm uppercase tracking-wider text-gray-200 font-black">
                Student
              </th>
              <th className="p-5 border-r border-gray-700 text-sm uppercase tracking-wider text-gray-200 font-black">
                Email
              </th>
              <th className="p-5 border-r border-gray-700 text-sm uppercase tracking-wider text-gray-200 font-black">
                Profession
              </th>
              <th className="p-5 border-r border-gray-700 text-sm uppercase tracking-wider text-gray-200 font-black">
                Username
              </th>
              <th className="p-5 border-r border-gray-700 text-sm uppercase tracking-wider text-gray-200 font-black">
                Gender
              </th>
              <th className="p-5 text-sm uppercase tracking-wider text-gray-200 font-black">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {allStudents.length > 0 ? (
              allStudents.map((student) => (
                <tr key={student._id} className="hover:bg-gray-700/40 transition-colors group">
                  <td className="p-1 border-r border-gray-700">
                    <div className="flex items-center justify-center gap-4">
                      <img 
                        src={student.image} 
                        alt={student.firstName} 
                        className="w-12 h-12 rounded-full border-2 border-gray-700 group-hover:border-red-600 transition-colors"
                      />
                      <span className="text-base font-bold text-gray-100">
                        {student.firstName} {student.lastName}
                      </span>
                    </div>
                  </td>
                  <td className="p-5 border-r border-gray-700">
                    <div className="flex items-center justify-center gap-2 text-gray-300 text-sm font-medium">
                      <span className="truncate max-w-[250px]">{student.email}</span>
                    </div>
                  </td>
                  <td className="p-5 border-r border-gray-700">
                    <div className="flex items-center justify-center gap-2 text-gray-300 text-sm font-medium">
                      <FaBriefcase className="text-red-600/60" />
                      {student.profile?.profession || "---"}
                    </div>
                  </td>
                  <td className="p-5 border-r border-gray-700">
                    <div className="flex items-center justify-center gap-2 text-gray-200 text-sm font-bold">
                      <FaUserTag className="text-red-600/60" />
                      @{student.profile?.userName || "---"}
                    </div>
                  </td>
                  <td className="p-5 border-r border-gray-700">
                    <div className="flex justify-center">
                      <span className={`px-5 py-2 rounded-lg text-xs font-black uppercase tracking-tighter border-2 ${
                        student.profile?.gender === 'Male' 
                        ? 'border-blue-900/50 text-blue-400 bg-blue-900/20' 
                        : student.profile?.gender === 'Female'
                        ? 'border-pink-900/50 text-pink-400 bg-pink-900/20'
                        : 'border-gray-700 text-gray-400 bg-gray-900/50'
                      }`}>
                        {student.profile?.gender || 'N/A'}
                      </span>
                    </div>
                  </td>
                  <td className="p-5">
                    <div className="flex justify-center">
                      <button
                        onClick={() => handleMessageClick(student)}
                        className="p-2.5 text-gray-400 hover:text-blue-400 transition-colors"
                        title="Send Message"
                      >
                        <FaCommentAlt className="text-xl" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="p-16 text-center text-gray-500 font-bold tracking-widest uppercase text-base">
                  No Student Records Found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {allStudents.length > 0 && (
        <div className="mx-auto mt-auto flex items-center justify-center gap-8 py-5 px-10 bg-gray-800/80 backdrop-blur-md border border-gray-700 rounded-2xl shadow-2xl z-20 mb-6">
          <button
            onClick={() => setCurrentPage(prev => prev - 1)}
            disabled={!paginationInfo.hasPreviousPage}
            className={`group flex items-center gap-2 px-6 py-3.5 rounded-xl text-sm font-black tracking-widest transition-all border-2 ${
              !paginationInfo.hasPreviousPage 
              ? "opacity-10 cursor-not-allowed border-transparent text-gray-600" 
              : "bg-gray-900 text-gray-300 border-gray-700 hover:border-red-600 hover:text-white hover:shadow-[0_0_20px_rgba(220,38,38,0.2)]"
            }`}
          >
            <GrFormPrevious size={22} className="group-hover:-translate-x-1 transition-transform" /> PREV
          </button>

          <div className="flex items-center gap-4">
            <div className="flex items-center justify-center w-14 h-14 bg-red-600 text-white rounded-xl shadow-[0_0_20px_rgba(220,38,38,0.4)] text-lg font-black border-2 border-red-500">
              {currentPage}
            </div>
            <span className="text-gray-500 font-black text-lg">/</span>
            <span className="text-lg font-black text-gray-400">{paginationInfo.totalPages}</span>
          </div>

          <button
            onClick={() => setCurrentPage(prev => prev + 1)}
            disabled={paginationInfo.isLastPage}
            className={`group flex items-center gap-2 px-6 py-3.5 rounded-xl text-sm font-black tracking-widest transition-all border-2 ${
              paginationInfo.isLastPage 
              ? "opacity-10 cursor-not-allowed border-transparent text-gray-600" 
              : "bg-gray-900 text-gray-300 border-gray-700 hover:border-red-600 hover:text-white hover:shadow-[0_0_20px_rgba(220,38,38,0.2)]"
            }`}
          >
            NEXT <GrFormNext size={22} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      )}

      {showMessageModal && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
          <div className="relative w-full max-w-2xl">
            <DashboardMessageToUser setShowMessageModal={setShowMessageModal} />
           
          </div>
        </div>
      )}
    </div>
  );
};

export default memo(DashboardPageStudentAdmin);