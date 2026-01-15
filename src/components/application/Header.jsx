import React, { useCallback, useState, useEffect, useRef, useMemo } from "react";
import edunest_logo from "../../assets/edunest_logo.png";
import { IoIosSearch, IoMdMenu } from "react-icons/io";
import { MdKeyboardArrowDown } from "react-icons/md";
import { MdKeyboardArrowUp } from "react-icons/md";
import Button from "./Button";
import { RxCross1 } from "react-icons/rx";
import { NavLink, Link, useNavigate, useLocation } from "react-router-dom";
import { IoCartOutline } from "react-icons/io5";
import { useSelector, useDispatch } from "react-redux";
import { apiConnector } from "../../services/apiConnector";
import { apiLinks } from "../../services/apiLink";
import { setCatagory } from "../../redux/slices/applicationSlice";
import { setProfile, setPersonalData } from "../../redux/slices/profileSlice";
import { toast } from "react-toastify";
import { RxCross2 } from "react-icons/rx";
import { motion, AnimatePresence } from "framer-motion";
import { IoSearch } from "react-icons/io5";
import { setLoading } from "../../redux/slices/uiSlice";

const Header = () => {
  const user = useSelector((state) => state.profile.user);
  const { loading } = useSelector((state) => state.ui);
  const location = useLocation();

  const navOptions = useMemo(() => [
    {
      name: "Home",
      location: "/",
    },
    {
      name: "Catalog",
      location: "/all-categories",
    },
    ...(user?.accountType === "Admin"
      ? []
      : [
          {
            name: "About Us",
            location: "/about-us",
          },
        ]),
    ...(user?.accountType === "Admin"
      ? []
      : [{ name: "Contact Us", location: "/contact-us" }]),
  ], [user?.accountType]);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchLoading, setSearchLoading] = useState(false);
  const categories = useSelector((state) => state.application.catagories);
  const sideMenuRef = useRef(null);
  const searchBarRef = useRef(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [catalogDisplay, setCatalogDisplay] = useState(false);
  const [isTabletOrSmaller, setIsTabletOrSmaller] = useState(
    window.innerWidth <= 1024
  );
  const [searchData, setSearchData] = useState("");
  const [sideBarCategoryOpen, setSideBarCategoryOpen] = useState(false);
  const [searchSuggestions, setSearchSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Active state check for navigation items
  const isActive = (path) => {
    if (path === "/") {
      return location.pathname === "/";
    }
    return location.pathname.startsWith(path);
  };

  // Update side menu
  const updateSideMenu = useCallback(() => {
    setMenuOpen((prev) => !prev);
  }, []);

  // Update search area
  const updateSearchArea = useCallback(() => {
    setSearchOpen((prev) => !prev);
    setSearchData("");
    setShowSuggestions(false);
  }, []);

  // Logout function
  const logout = useCallback(async () => {
    updateSideMenu();
    dispatch(setLoading(true));
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
        toast.info("Log-out successful", {
          autoClose: 900,
          hideProgressBar: true,
          pauseOnHover: false,
          closeOnClick: true,
          draggable: false,
        });
        dispatch(setProfile(null));
        dispatch(setPersonalData(null));
        navigate("/");
      }
    } catch (error) {
      toast.error("Something went wrong", {
        autoClose: 900,
        hideProgressBar: true,
        pauseOnHover: false,
        closeOnClick: true,
        draggable: false,
      });
    } finally {
      dispatch(setLoading(false));
    }
  }, [dispatch, navigate, updateSideMenu]);

  // Fetch category data
  const fetchCategoryData = useCallback(async () => {
    try {
      const response = await apiConnector("GET", apiLinks.get_catagory_list);
      if (response.success) {
        dispatch(setCatagory(response.category));
      } else {
        dispatch(setCatagory([]));
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }, [dispatch]);

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        menuOpen &&
        sideMenuRef.current &&
        !sideMenuRef.current.contains(event.target)
      ) {
        setMenuOpen(false);
      }

      if (
        searchOpen &&
        searchBarRef.current &&
        !searchBarRef.current.contains(event.target)
      ) {
        setSearchOpen(false);
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuOpen, searchOpen]);

  // Fetch category data
  useEffect(() => {
    try {
      fetchCategoryData();
    } catch (error) {
      console.log(error);
    }
  }, [user, fetchCategoryData]);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setIsTabletOrSmaller(window.innerWidth <= 1200);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Update search data
  const updateSearchData = useCallback((event) => {
    const value = event.target.value;
    setSearchData(value);

    if (value.trim().length > 0 && searchOpen) {
      setShowSuggestions(true);
      const filtered = categories
        .filter((category) =>
          category.name.toLowerCase().includes(value.toLowerCase())
        )
        .slice(0, 10);
      setSearchSuggestions(filtered);
    } else {
      setShowSuggestions(false);
      setSearchSuggestions([]);
    }
  }, [categories, searchOpen]);

  // Search response
  const searchResponse = useCallback(async (event, suggestion = null) => {
    const searchTerm = suggestion || searchData;

    if (searchTerm.trim().length === 0) {
      setSearchOpen(false);
      return;
    }

    setSearchOpen(false);
    setShowSuggestions(false);
    navigate(`/search/${encodeURIComponent(searchTerm)}`);
  }, [searchData, navigate]);

  // View category in sidebar menu
  const viewCategoryInSideBarMenu = useCallback(() => {
    setSideBarCategoryOpen((prev) => !prev);
  }, []);

  // Active link styles
  const activeLinkClass = "text-red-600 font-bold";
  const normalLinkClass = "text-gray-300 hover:text-red-700";

  return (
    <div>
      <div
        className={`pt-5 bg-dark_bg w-full h-[80px] px-5 flex items-center justify-between text-gray-300 shadow-md relative`}
      >
        {/* Logo Section */}
        <Link
          to="/"
          className="flex items-center h-full w-[170px] sm:w-[230px]"
        >
          <img
            src={edunest_logo}
            alt="EduNest Logo"
            loading="lazy"
            className="w-full object-contain cursor-pointer"
          />
        </Link>

        {/* Desktop Navigation options with NavLink */}
       {/* Desktop Navigation options with NavLink */}
<div className="hidden tablet:flex items-center gap-14 text-[19px] font-medium">
  {navOptions.map((value, index) => (
    <div key={value.name} className="relative">
      {value.name === "Catalog" ? (
        <div
          className="relative"
          onMouseEnter={() => setCatalogDisplay(true)}
          onMouseLeave={() => setCatalogDisplay(false)}
        >
          <NavLink
            to={value.location}
            className={({ isActive }) =>
              `flex items-center gap-2 cursor-pointer transition ${
                isActive ? activeLinkClass : normalLinkClass
              }`
            }
          >
            {value.name}
            {catalogDisplay ? (
              <MdKeyboardArrowUp />
            ) : (
              <MdKeyboardArrowDown />
            )}
          </NavLink>
          
          {/* Catalog Dropdown */}
          <AnimatePresence>
            {catalogDisplay && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="fixed top-24 left-1/2 transform -translate-x-1/2 w-[80vw] max-w-[900px] bg-dark_bg border border-gray-700 text-white p-6 rounded-lg shadow-2xl z-50"
                onMouseEnter={() => setCatalogDisplay(true)}
                onMouseLeave={() => setCatalogDisplay(false)}
              >
                <div className="grid grid-cols-4 gap-6">
                  {categories?.map((category) => (
                    <NavLink
                      to={`/category/${category.name}?catagory_id=${category._id}`}
                      key={category._id}
                      className={({ isActive }) =>
                        `group ${isActive ? 'ring-2 ring-red-500 ring-inset' : ''}`
                      }
                      onClick={() => {
                        setCatalogDisplay(false);
                        window.scrollTo(0, 0);
                      }}
                    >
                      <div className="flex flex-col items-center gap-2 p-3 rounded-lg hover:bg-gray-800 transition-all duration-200">
                        <div className="w-12 h-12 bg-gray-700 rounded-full flex items-center justify-center group-hover:bg-dark_red transition-all duration-200">
                          <span className="text-lg font-bold">
                            {category.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <p className="text-center text-sm font-medium text-gray-300 group-hover:text-white">
                          {category.name}
                        </p>
                      </div>
                    </NavLink>
                  ))}
                </div>
                <div className="mt-4 pt-4 border-t border-gray-700">
                  <NavLink
                    to="/all-categories"
                    className="text-dark_red hover:text-red-400 font-medium flex items-center justify-center gap-2 transition-colors"
                    onClick={() => {
                      setCatalogDisplay(false);
                      window.scrollTo(0, 0);
                    }}
                  >
                    View All Categories
                    <MdKeyboardArrowDown className="text-xl" />
                  </NavLink>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ) : (
        <NavLink
          to={value.location}
          className={({ isActive }) =>
            `cursor-pointer hover:text-red-700 transition ${
              isActive ? activeLinkClass : normalLinkClass
            }`
          }
          onClick={() => {
            setMenuOpen(false);
            window.scrollTo(0, 0);
          }}
        >
          {value.name}
        </NavLink>
      )}
    </div>
  ))}
</div>

        {/* Right Section (Search, Cart, Profile) */}
        <div className="flex items-center gap-5">
          {/* Search Icon */}
          <IoIosSearch
            className="text-gray-300 hover:text-gray-200 text-[24px] cursor-pointer"
            onClick={updateSearchArea}
          />

          {/* Login/Signup or User Content */}
          <div className="hidden md:flex items-center gap-4">
            {!user && (
              <div className="flex md:flex items-center gap-4">
                <Button data="Login" color="red" path="/login" />
                <Button data="Register" color="red" path="/register" />
              </div>
            )}
            {user && (
              <div className="flex gap-4 items-center">
                {user.accountType === "Student" && (
                  <div>
                    <NavLink to="/cart" className={({ isActive }) => isActive ? 'relative ring-2 ring-red-500 ring-inset rounded-full p-1' : 'relative'}>
                      <IoCartOutline className="text-gray-300 hover:text-gray-200 text-[24px] cursor-pointer" />
                    </NavLink>
                  </div>
                )}

                <NavLink to="/dashboard" className={({ isActive }) => isActive ? 'ring-2 ring-red-500 ring-inset rounded-full' : ''}>
                  <img
                    src={`${user.image}`}
                    alt="Profile"
                    className="w-14 h-14 rounded-full object-cover"
                  />
                </NavLink>
              </div>
            )}
          </div>

          {/* Hamburger Menu */}
          <div className="cursor-pointer">
            {menuOpen ? (
              <RxCross1
                className="text-gray-400 text-[26px] hover:text-white"
                onClick={updateSideMenu}
              />
            ) : (
              <IoMdMenu
                className={`text-[26px] hover:text-white text-gray-400`}
                onClick={updateSideMenu}
              />
            )}
          </div>
        </div>

        {/* Sidebar Menu with NavLink */}
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ x: 300, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 300, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              ref={sideMenuRef}
              className="absolute z-[100] top-24 right-0 w-[300px] tablet:w-[350px] h-[calc(100vh-80px)] bg-gray-900 overflow-y-auto shadow-2xl"
            >
              <div className="text-gray-400 flex flex-col items-start gap-1 p-4 font-medium">
                {isTabletOrSmaller && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ staggerChildren: 0.05 }}
                    className="flex flex-col w-full gap-1"
                  >
                    {navOptions
                      .filter((value) => value.name !== "Catalog")
                      .map((value, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          <NavLink
                            to={value.location}
                            className={({ isActive }) =>
                              `block text-[18px] w-full text-left px-4 py-3 rounded-md transition-all duration-300 transform hover:translate-x-1 ${
                                isActive
                                  ? 'text-red-600 bg-gray-800 font-bold'
                                  : 'hover:text-dark_red hover:bg-gray-800'
                              }`
                            }
                            onClick={updateSideMenu}
                          >
                            {value.name}
                          </NavLink>
                        </motion.div>
                      ))}
                  </motion.div>
                )}

                <motion.div
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  className="w-full border-t border-gray-800 my-2 tablet:invisible"
                />

                {/* Authentication Links */}
                {!user && isTabletOrSmaller && (
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                    className="w-full"
                  >
                    <NavLink
                      to="/login"
                      className={({ isActive }) =>
                        `block text-[18px] w-full text-left px-4 py-3 rounded-md transition-all duration-300 transform hover:translate-x-1 ${
                          isActive
                            ? 'text-red-600 bg-gray-800 font-bold'
                            : 'hover:text-dark_red hover:bg-gray-800'
                        }`
                      }
                      onClick={updateSideMenu}
                    >
                      Login
                    </NavLink>
                  </motion.div>
                )}

                {!user && isTabletOrSmaller && (
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.15 }}
                    className="w-full"
                  >
                    <NavLink
                      to="/register"
                      className={({ isActive }) =>
                        `block text-[18px] w-full text-left px-4 py-3 rounded-md transition-all duration-300 transform hover:translate-x-1 ${
                          isActive
                            ? 'text-red-600 bg-gray-800 font-bold'
                            : 'hover:text-dark_red hover:bg-gray-800'
                        }`
                      }
                      onClick={updateSideMenu}
                    >
                      Register
                    </NavLink>
                  </motion.div>
                )}

                {/* User Links */}
                {user && (
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                    className="w-full"
                  >
                    <NavLink
                      to="/dashboard"
                      className={({ isActive }) =>
                        `block text-[18px] w-full text-left px-4 py-3 rounded-md transition-all duration-300 transform hover:translate-x-1 ${
                          isActive
                            ? 'text-red-600 bg-gray-800 font-bold'
                            : 'hover:text-dark_red hover:bg-gray-800'
                        }`
                      }
                      onClick={updateSideMenu}
                    >
                      Dashboard
                    </NavLink>
                  </motion.div>
                )}

                {user && (
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.15 }}
                    className="w-full"
                  >
                    <NavLink
                      to="/forgot-password"
                      className={({ isActive }) =>
                        `block text-[18px] w-full text-left px-4 py-3 rounded-md transition-all duration-300 transform hover:translate-x-1 ${
                          isActive
                            ? 'text-red-600 bg-gray-800 font-bold'
                            : 'hover:text-dark_red hover:bg-gray-800'
                        }`
                      }
                      onClick={updateSideMenu}
                    >
                      Reset Password
                    </NavLink>
                  </motion.div>
                )}

                {user && (
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                    className="w-full"
                  >
                    <p
                      className="cursor-pointer text-[18px] hover:text-dark_red hover:bg-gray-800 w-full text-left px-4 py-3 rounded-md transition-all duration-300 transform hover:translate-x-1"
                      onClick={logout}
                    >
                      Logout
                    </p>
                  </motion.div>
                )}

                {user && isTabletOrSmaller && user.accountType === "Student" && (
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                    className="w-full"
                  >
                    <NavLink
                      to="/cart"
                      className={({ isActive }) =>
                        `block text-[18px] w-full text-left px-4 py-3 rounded-md transition-all duration-300 transform hover:translate-x-1 ${
                          isActive
                            ? 'text-red-600 bg-gray-800 font-bold'
                            : 'hover:text-dark_red hover:bg-gray-800'
                        }`
                      }
                      onClick={updateSideMenu}
                    >
                      Cart
                    </NavLink>
                  </motion.div>
                )}

                {/* Catalog in Sidebar */}
                {isTabletOrSmaller && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.25 }}
                    className="w-full mt-2"
                  >
                    <div
                      className={`text-[18px] w-full text-left px-4 py-3 rounded-md transition-all duration-300 flex justify-between items-center cursor-pointer ${
                        sideBarCategoryOpen || isActive('/all-categories') || location.pathname.includes('/category/')
                          ? 'text-red-600 bg-gray-800 font-bold'
                          : 'hover:text-dark_red hover:bg-gray-800'
                      }`}
                      onClick={viewCategoryInSideBarMenu}
                    >
                      <span>Catalog</span>
                      <motion.div
                        animate={{ rotate: sideBarCategoryOpen ? 180 : 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        {sideBarCategoryOpen ? (
                          <MdKeyboardArrowUp className="text-xl" />
                        ) : (
                          <MdKeyboardArrowDown className="text-xl" />
                        )}
                      </motion.div>
                    </div>
                    <AnimatePresence mode="sync">
                      {sideBarCategoryOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="overflow-hidden"
                        >
                          <div className="flex flex-col ml-6 mt-1 gap-1">
                            {categories.map((category, index) => (
                              <motion.div
                                key={index}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.05 * index }}
                              >
                                <NavLink
                                  to={`/category/${category.name}?category_id=${category._id}`}
                                  className={({ isActive }) =>
                                    `block text-[16px] w-full text-left px-4 py-2 rounded-md transition-all duration-300 transform hover:translate-x-1 ${
                                      isActive
                                        ? 'text-red-600 bg-gray-800 font-bold'
                                        : 'hover:text-dark_red hover:bg-gray-800'
                                    }`
                                  }
                                  onClick={updateSideMenu}
                                >
                                  {category.name}
                                </NavLink>
                              </motion.div>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Search Bar Popup with Suggestions */}
        <AnimatePresence>
          {searchOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-50 bg-[#000000cc] backdrop-blur-sm flex items-start justify-center pt-60"
            >
              <motion.div
                initial={{ y: -50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -50, opacity: 0 }}
                transition={{ type: "spring", damping: 20, stiffness: 300 }}
                className="bg-gray-900 border border-gray-700 rounded-lg shadow-2xl w-[95%] max-w-[600px] min-h-[220px] flex flex-col p-4 mx-4 relative"
                ref={searchBarRef}
              >
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="absolute z-[2] text-white text-[18px] cursor-pointer top-2 right-2"
                  onClick={updateSearchArea}
                >
                  <RxCross2 />
                </motion.div>

                <div className="flex flex-col gap-4 mt-10">
                  <motion.div
                    initial={{ x: -10, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.1 }}
                    className="relative"
                  >
                    <input
                      type="text"
                      value={searchData}
                      onChange={updateSearchData}
                      onFocus={() =>
                        searchData.length > 0 && setShowSuggestions(true)
                      }
                      placeholder="Search courses or categories..."
                      className="w-full bg-gray-800 text-white p-3 rounded-lg focus:outline-none focus:ring-1 focus:ring-red-500 transition-all duration-300 hover:bg-gray-700"
                      autoFocus
                    />

                    {/* Search Suggestions Dropdown */}
                    {showSuggestions && searchSuggestions.length > 0 && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="absolute z-10 w-full mt-1 bg-gray-800 border border-gray-700 rounded-lg shadow-lg max-h-60 overflow-y-auto"
                      >
                        {searchSuggestions.map((suggestion, index) => (
                          <motion.div
                            key={index}
                            whileHover={{
                              backgroundColor: "rgba(55, 65, 81, 0.5)",
                            }}
                            className="px-4 py-3 cursor-pointer text-gray-300 hover:text-white transition-colors"
                            onClick={() => {
                              setSearchData(suggestion.name);
                              searchResponse(null, suggestion.name);
                            }}
                          >
                            <div className="flex items-center gap-2">
                              <span className="text-dark_red">
                                <IoSearch />
                              </span>
                              <span>{suggestion.name}</span>
                            </div>
                          </motion.div>
                        ))}
                      </motion.div>
                    )}
                  </motion.div>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={(e) => searchResponse(e)}
                    className="w-full bg-dark_red hover:bg-[#CF1020]/90 cursor-pointer flex justify-center gap-2 items-center text-white px-4 py-3 rounded-lg transition-all duration-300 shadow-md"
                  >
                    {searchLoading ? (
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <>
                        <IoSearch className="mr-2 text-[20px]" />
                        Search
                      </>
                    )}
                  </motion.button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="w-[99%] mt-3 m-auto h-[1px] bg-gray-700"></div>
    </div>
  );
};

export default React.memo(Header);