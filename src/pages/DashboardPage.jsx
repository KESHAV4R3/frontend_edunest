import { Outlet, useNavigate } from "react-router-dom";
import { useState, useEffect, useMemo } from "react";
import { FaUser } from "react-icons/fa";
import { IoMdSettings } from "react-icons/io";
import { MdOutlineOnlinePrediction } from "react-icons/md";
import { MdKeyboardArrowDown, MdLogout, MdDelete } from "react-icons/md";
import { IoBookSharp } from "react-icons/io5";
import { toast } from "react-toastify";
import { PiChalkboardTeacherLight, PiStudentFill } from "react-icons/pi";
import { BiCategory } from "react-icons/bi";
import { useDispatch, useSelector } from "react-redux";
import { apiConnector } from "../services/apiConnector";
import { apiLinks } from "../services/apiLink";
import { MdOutlineCreateNewFolder } from "react-icons/md";
import { motion } from "framer-motion";
import {
  setProfile,
  setAllStudents,
  setAllInstructors,
  setPersonalData,
} from "../redux/slices/profileSlice";

const DashboardPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("My Profile");
  const [loading, setLoading] = useState(true);

  const { user } = useSelector((state) => state.profile);

  const navItems = useMemo(() => {
    if (!user) return [];
    return [
      {
        id: "My Profile",
        icon: <FaUser />,
        label: "My Profile",
        path: "/dashboard",
      },
      {
        id: "Course",
        icon: <IoBookSharp />,
        label:
          user.accountType === "Instructor"
            ? "Course Created"
            : user.accountType === "Admin"
            ? "All Courses"
            : "Course Enrolled",
        path: "/dashboard/courses",
      },
      ...(user.accountType === "Instructor"
        ? [
            {
              id: "Create new course",
              icon: <MdOutlineCreateNewFolder />,
              label: "Create new course",
              path: "/dashboard/create-new-course",
            },
          ]
        : []),
      ...(user.accountType !== "Admin"
        ? [
            {
              id: "Account Setting",
              icon: <IoMdSettings />,
              label: "Account Setting",
              path: "/dashboard/accout-setting",
            },
          ]
        : []),
      ...(user.accountType === "Instructor"
        ? [
            {
              id: "LiveStream",
              icon: <MdOutlineOnlinePrediction />,
              label: "LiveStream",
              path: "/dashboard/LiveStream",
            },
          ]
        : []),
      {
        id: "Instructors",
        icon: <PiChalkboardTeacherLight />,
        label: "Instructors",
        path: "/dashboard/instructors-see-all",
        adminOnly: true,
      },
      {
        id: "Students",
        icon: <PiStudentFill />,
        label: "Students",
        path: "/dashboard/student-see-all",
        adminOnly: true,
      },
      {
        id: "Add Category",
        icon: <BiCategory />,
        label: "Add Category",
        path: "/dashboard/add-catagory",
        adminOnly: true,
      },
      {
        id: "Delete Category",
        icon: <MdDelete />,
        label: "Delete Category",
        path: "/dashboard/delete-catagory",
        adminOnly: true,
      },
      {
        id: "log Out",
        icon: <MdLogout />,
        label: "Log Out",
      },
    ];
  }, [user]);

  const logout = async () => {
    try {
      const response = await apiConnector("POST", apiLinks.logout);
      if (!response.success) {
        toast.error("Unable to log-out");
      } else {
        toast.success("Log-out successful");
        dispatch(setProfile(null));
        dispatch(setPersonalData(null));
        navigate("/");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const fetchUserData = async () => {
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
  };

  const fetchStudentData = async () => {
    try {
      const response = await apiConnector("GET", apiLinks.getAllStudents);
      if (response.success) {
        dispatch(setAllStudents(response.students));
      }
    } catch (error) {
      console.error(error);
    }
  };

  const fetchAllInstructor = async () => {
    try {
      const response = await apiConnector("GET", apiLinks.getAllInstructors);
      if (response.success) {
        dispatch(setAllInstructors(response.instructors));
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    localStorage.removeItem("MailUserData");
    fetchUserData();
  }, []);

  useEffect(() => {
    if (user?.accountType === "Admin") {
      fetchStudentData();
      fetchAllInstructor();
    }
  }, [user]);

  const handleNavClick = (item) => {
    setActiveTab(item.id);
    setMobileMenuOpen(false);
    if (item.path) navigate(item.path);
    if (item.id === "log Out") logout();
  };

  if (loading || !user) {
    return (
      <div className="flex items-center justify-center h-screen text-white bg-gray-900">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-gray-600"></div>
      </div>
    );
  }

  const motionVariants = {
    hover: { scale: 1.03 },
    tap: { scale: 0.97 },
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-900 text-white">
      {/* Mobile Nav */}
      <header className="md:hidden bg-gray-800 sticky top-0 z-20">
        <div className="flex justify-between items-center p-4 border-b border-gray-700">
          <h1 className="text-xl font-bold text-red-500">Dashboard</h1>
          <button
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            className="p-2 rounded-lg hover:bg-gray-700"
          >
            <MdKeyboardArrowDown className="text-xl" />
          </button>
        </div>

        <div
          className={`transition-all duration-300 ease-in-out ${
            mobileMenuOpen ? "block" : "hidden"
          }`}
        >
          <div className="flex overflow-x-auto scrollbar-hide bg-gray-800">
            {navItems.map((item) => {
              if (item.adminOnly && user.accountType !== "Admin") return null;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item)}
                  className={`flex flex-col items-center p-4 min-w-[80px] ${
                    activeTab === item.id
                      ? "text-red-500 border-b-2 border-red-500"
                      : "text-gray-400 hover:text-white"
                  }`}
                >
                  <span className="text-lg mb-1">{item.icon}</span>
                  <span className="text-xs">{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Desktop Sidebar */}
        <aside className="hidden md:flex flex-col w-64 bg-gray-800 border-r border-gray-700">
          <div className="flex items-center justify-center p-4 border-b border-gray-700">
            <h1 className="text-2xl font-bold text-red-500">Dashboard</h1>
          </div>
          <nav className="flex-1 overflow-y-auto p-4 space-y-2 scrollbar-hide">
            {navItems.map((item) => {
              if (item.adminOnly && user.accountType !== "Admin") return null;
              return (
                <motion.button
                  key={item.id}
                  onClick={() => handleNavClick(item)}
                  whileHover="hover"
                  whileTap="tap"
                  variants={motionVariants}
                  className={`flex items-center w-full p-3 rounded-lg text-left transition-colors duration-200 ${
                    activeTab === item.id
                      ? "bg-gray-700 text-red-500"
                      : "text-gray-400 hover:text-white hover:bg-gray-700"
                  }`}
                >
                  <span className="mr-3">{item.icon}</span>
                  <span>{item.label}</span>
                </motion.button>
              );
            })}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-4 scrollbar-hide">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardPage;
