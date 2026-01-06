import { Outlet, useNavigate, NavLink } from "react-router-dom";
import { useState, useEffect, useMemo, useCallback, memo } from "react";
import { FaUser } from "react-icons/fa";
import { IoMdSettings } from "react-icons/io";
import { MdOutlineOnlinePrediction, MdKeyboardArrowDown, MdLogout, MdDelete, MdOutlineCreateNewFolder, MdOutlineAttachMoney } from "react-icons/md";
import { IoBookSharp } from "react-icons/io5";
import { toast } from "react-toastify";
import { PiChalkboardTeacherLight, PiStudentFill } from "react-icons/pi";
import { BiCategory } from "react-icons/bi";
import { useDispatch, useSelector } from "react-redux";
import { apiConnector } from "../services/apiConnector";
import { apiLinks } from "../services/apiLink";
import { motion, AnimatePresence } from "framer-motion";
import {
  setProfile,
  setPersonalData,
} from "../redux/slices/profileSlice";

const DashboardPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const { user } = useSelector((state) => state.profile);

  // --- MEMOIZED NAVIGATION ITEMS ---
  const navItems = useMemo(() => {
    if (!user) return [];
    const items = [
      { id: "My Profile", icon: <FaUser />, label: "My Profile", path: "/dashboard" },
      {
        id: "Course",
        icon: <IoBookSharp />,
        label: user.accountType === "Instructor" ? "Created" : user.accountType === "Admin" ? "Courses" : "Enrolled",
        path: "/dashboard/courses",
      },
    ];

    // Instructor specific items
    if (user.accountType === "Instructor") {
      items.push(
        { id: "Create new course", icon: <MdOutlineCreateNewFolder />, label: "New Course", path: "/dashboard/create-new-course" },
        { id: "Analytics", icon: <MdOutlineAttachMoney />, label: "Analytics", path: "/dashboard/Analytics" },
        { id: "LiveStream", icon: <MdOutlineOnlinePrediction />, label: "Live", path: "/dashboard/LiveStream" }
      );
    }

    // Student specific items
    if (user.accountType === "Student") {
      items.push(
        { id: "AnalyticsStudent", icon: <MdOutlineAttachMoney />, label: "Analytics", path: "/dashboard/student-Analytics" }
      );
    }

    if (user.accountType !== "Admin") {
      items.push({ id: "Account Setting", icon: <IoMdSettings />, label: "Settings", path: "/dashboard/accout-setting" });
    }

    // Admin specific items
    if (user.accountType === "Admin") {
      items.push(
        { id: "Instructors", icon: <PiChalkboardTeacherLight />, label: "Instructors", path: "/dashboard/instructors-see-all" },
        { id: "Students", icon: <PiStudentFill />, label: "Students", path: "/dashboard/student-see-all" },
        { id: "Add Category", icon: <BiCategory />, label: "Add Cat", path: "/dashboard/add-catagory" },
        { id: "Delete Category", icon: <MdDelete />, label: "Del Cat", path: "/dashboard/delete-catagory" }
      );
    }

    items.push({ id: "log Out", icon: <MdLogout />, label: "Log Out", isLogout: true });
    return items;
  }, [user]);

  // --- STABLE CALLBACKS ---
  const logout = useCallback(async () => {
    const confirmLogout = window.confirm("Are you sure you want to log out?");
    if (!confirmLogout) return;

    try {
      const response = await apiConnector("POST", apiLinks.logout);
      if (response.success) {
        toast.success("Log-out successful");
        dispatch(setProfile(null));
        dispatch(setPersonalData(null));
        navigate("/");
      }
    } catch (error) {
      console.error(error);
      toast.error("Logout failed.");
    }
  }, [dispatch, navigate]);

  const fetchUserData = useCallback(async () => {
    try {
      setLoading(true);
      const response = await apiConnector("GET", apiLinks.getUserDetails);
      if (response.success) {
        dispatch(setPersonalData(response.user));
      }
    } catch (error) {
      console.error("User data fetch error:", error);
    } finally {
      setLoading(false);
    }
  }, [dispatch]);

  useEffect(() => {
    localStorage.removeItem("MailUserData");
    fetchUserData();
  }, [fetchUserData]);

  if (loading || !user) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-red-500"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-gray-900 text-gray-100 font-sans">
      
      {/* Mobile Nav Header */}
      <header className="md:hidden flex-none bg-gray-800 border-b border-gray-700 z-40 relative">
        <div className="flex justify-between items-center px-5 py-4">
          <h1 className="text-xl font-black text-red-600 tracking-tighter">EDUNEST</h1>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="flex items-center gap-2 bg-gray-700 px-3 py-1.5 rounded-lg border border-gray-600 active:scale-95 transition-all"
          >
            <span className="text-[10px] font-black uppercase tracking-widest text-gray-300">Menu</span>
            <MdKeyboardArrowDown className={`text-xl text-red-500 transition-transform duration-300 ${mobileMenuOpen ? "rotate-180" : ""}`} />
          </button>
        </div>

        <AnimatePresence>
          {mobileMenuOpen && (
            <>
              <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                exit={{ opacity: 0 }}
                onClick={() => setMobileMenuOpen(false)}
                className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[-1]"
              />
              <motion.div
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -20, opacity: 0 }}
                className="absolute top-full left-0 w-full bg-gray-800 border-b border-gray-700 shadow-2xl overflow-y-auto max-h-[70vh] scrollbar-hide"
              >
                <div className="grid grid-cols-2 gap-2 p-4">
                  {navItems.map((item) => (
                    <NavLink
                      key={item.id}
                      to={item.path || "#"}
                      onClick={(e) => {
                        if (item.isLogout) { e.preventDefault(); logout(); }
                        setMobileMenuOpen(false);
                      }}
                      className={({ isActive }) =>
                        `flex items-center gap-3 p-4 rounded-xl transition-all border ${
                          !item.isLogout && isActive 
                          ? "bg-red-600 border-red-500 text-white shadow-lg shadow-red-900/40" 
                          : "bg-gray-900/50 border-gray-700 text-gray-400"
                        }`
                      }
                    >
                      <span className="text-lg">{item.icon}</span>
                      <span className="text-[10px] uppercase font-black tracking-widest leading-none">{item.label}</span>
                    </NavLink>
                  ))}
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Desktop Sidebar */}
        <aside className="hidden md:flex flex-col w-64 bg-gray-800 border-r border-gray-700">
          <div className="p-6 border-b border-gray-700">
            <h1 className="text-2xl font-black text-red-600 tracking-tighter">DASHBOARD</h1>
          </div>
          <nav className="flex-1 h-full overflow-hidden p-4 space-y-1.5 scrollbar-hide">
            {navItems.map((item) => {
              if (item.isLogout) {
                return (
                  <button
                    key={item.id}
                    onClick={logout}
                    className="flex items-center w-full px-4 py-3 rounded-xl text-gray-400 hover:text-white hover:bg-red-600/10 transition-all group"
                  >
                    <span className="mr-3 text-lg group-hover:text-red-500">{item.icon}</span>
                    <span className="text-sm font-bold uppercase tracking-tight">{item.label}</span>
                  </button>
                );
              }
              return (
                <NavLink
                  key={item.id}
                  to={item.path}
                  end={item.path === "/dashboard"}
                  className={({ isActive }) =>
                    `relative flex items-center w-full px-4 py-3 rounded-xl transition-all duration-200 group ${
                      isActive ? "bg-red-600 text-white shadow-lg shadow-red-900/20" : "text-gray-400 hover:bg-gray-700 hover:text-gray-100"
                    }`
                  }
                >
                  <span className="mr-3 text-lg">{item.icon}</span>
                  <span className="text-sm font-bold uppercase tracking-tight">{item.label}</span>
                </NavLink>
              );
            })}
          </nav>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto bg-gray-900 scrollbar-hide">
          <div className="p-2 md:p-6 max-w-[1600px] mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default memo(DashboardPage);