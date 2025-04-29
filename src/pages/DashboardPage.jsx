import { Outlet, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { FaUser } from "react-icons/fa";
import { IoMdSettings } from "react-icons/io";
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

  // Dynamically generate nav items based on user role
  const navItems = [
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
        user?.accountType === "Instructor"
          ? "Course Created"
          : user?.accountType === "Admin"
          ? "All Courses"
          : "Course Enrolled",
      path: "/dashboard/courses",
    },
    ...(user?.accountType === "Instructor"
      ? [
          {
            id: "Create new course",
            icon: <MdOutlineCreateNewFolder />,
            label: "Create new course",
            path: "/dashboard/create-new-course",
          },
        ]
      : []),
    ...(user?.accountType != "Admin"
      ? [
          {
            id: "Account Setting",
            icon: <IoMdSettings />,
            label: "Account Setting",
            path: "/dashboard/accout-setting",
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
      id: "Add Catagory",
      icon: <BiCategory />,
      label: "Add Catagory",
      path: "/dashboard/add-catagory",
      adminOnly: true,
    },
    {
      id: "Delete catagory",
      icon: <MdDelete />,
      label: "Delete catagory",
      path: "/dashboard/delete-catagory",
      adminOnly: true,
    },
    {
      id: "log Out",
      icon: <MdLogout />,
      label: "Log Out",
    },
  ];

  const logout = async () => {
    try {
      const response = await apiConnector("POST", apiLinks.logout);
      if (!response.success) {
        toast.error("Unable to log-out", {
          autoClose: 900,
          hideProgressBar: true,
          pauseOnHover: false,
          closeOnClick: true,
          draggable: false,
        });
      } else {
        toast.success("Log-out successful", {
          autoClose: 900,
          hideProgressBar: true,
          pauseOnHover: false,
          closeOnClick: true,
          draggable: false,
        });
        navigate('/')
        dispatch(setProfile(null));
        dispatch(setPersonalData(null));
      }
    } catch (error) {
      console.log(error);
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
      } else {
        console.log(response.message);
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
      } else {
        console.log(response.message);
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

  if (loading || !user) {
    return (
      <div className="flex items-center justify-center h-screen text-white bg-gray-900">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-600"></div>
      </div>
    );
  }

  // Animation variants for cleaner code
  const buttonVariants = {
    initial: { opacity: 0, x: -10 },
    animate: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.3, ease: "easeOut" },
    },
    hover: { scale: 1.03 },
    tap: { scale: 0.98 },
    active: {
      backgroundColor: "rgba(55, 65, 81, 1)", // bg-gray-700
      color: "#ef4444", // text-red-500
      boxShadow: "inset 0 2px 4px 0 rgba(0, 0, 0, 0.25)",
    },
  };

  const iconVariants = {
    hover: (active) => ({
      scale: active ? 1.15 : 1.1,
      rotate: active ? 0 : 5,
    }),
  };

  const textVariants = {
    hover: (active) => ({
      x: active ? 3 : 2,
    }),
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-900 text-white">
      {/* Mobile Top Navigation */}
      <header className="overflow-y-auto md:hidden bg-gray-800 flex flex-col top-0 z-20">
        <div className="flex justify-between items-center p-4 border-b border-gray-700">
          <h1 className="text-xl font-bold text-red-500">Dashboard</h1>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg hover:bg-gray-700"
          >
            <MdKeyboardArrowDown className="text-xl" />
          </button>
        </div>

        {/* Mobile Navigation Options */}
        <div
          className={`bg-gray-800 flex justify-evenly ${
            mobileMenuOpen ? "block" : "hidden"
          }`}
        >
          <div className="flex scrollbar-hide overflow-x-auto">
            {navItems.map((item) => {
              if (item.adminOnly && user?.accountType !== "Admin") return null;

              return (
                <button
                  key={item.id}
                  className={`flex cursor-pointer flex-col items-center justify-center p-4 min-w-[80px] ${
                    activeTab === item.id
                      ? "text-red-500 border-b-2 border-red-500"
                      : "text-gray-400 hover:text-white"
                  }`}
                  onClick={() => {
                    setActiveTab(item.id);
                    if (item.path) navigate(item.path);
                    if (item.id === "log Out") logout();
                  }}
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
          <nav className="flex-1 overflow-y-auto p-4 space-y-2">
            {navItems.map((item) => {
              if (item.adminOnly && user?.accountType !== "Admin") return null;

              return (
                <motion.button
                  key={item.id}
                  variants={buttonVariants}
                  initial="initial"
                  animate="animate"
                  whileHover="hover"
                  whileTap="tap"
                  custom={activeTab === item.id}
                  className={`cursor-pointer flex w-full items-center p-3 rounded-lg text-left ${
                    activeTab === item.id
                      ? "active-state"
                      : "text-gray-400 hover:bg-gray-700 hover:text-white"
                  }`}
                  onClick={() => {
                    setActiveTab(item.id);
                    if (item.path) navigate(item.path);
                    if (item.id === "log Out") logout();
                  }}
                >
                  <motion.span
                    className="mr-3"
                    variants={iconVariants}
                    custom={activeTab === item.id}
                  >
                    {item.icon}
                  </motion.span>

                  <motion.span
                    variants={textVariants}
                    custom={activeTab === item.id}
                  >
                    {item.label}
                  </motion.span>
                </motion.button>
              );
            })}
          </nav>
        </aside>

        {/* Render Nested Routes */}
        <div className="flex-1 p-4 overflow-y-auto">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
