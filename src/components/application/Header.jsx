import React, { useCallback, useState, useEffect, useRef } from "react";
import edunest_logo from "../../assets/edunest_logo.png";
import { IoIosSearch, IoMdMenu } from "react-icons/io";
import { MdKeyboardArrowDown } from "react-icons/md";
import { MdKeyboardArrowUp } from "react-icons/md";
import Button from "./Button";
import { RxCross1 } from "react-icons/rx";
import { Link, useNavigate } from "react-router-dom";
import { navOptions } from "../../data/application";
import { IoCartOutline } from "react-icons/io5";
import { useSelector, useDispatch } from "react-redux";
import { apiConnector } from "../../services/apiConnector";
import { apiLinks } from "../../services/apiLink";
import { setCatagory } from "../../redux/slices/applicationSlice";
import { setProfile, setPersonalData } from "../../redux/slices/profileSlice";
import { toast } from "react-toastify";
import { RxCross2 } from "react-icons/rx";
import { motion, AnimatePresence } from "framer-motion";
import { LuMessageCircleMore } from "react-icons/lu";
import { IoSearch } from "react-icons/io5";

const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchLoading, setSearchLoading] = useState(false);
  const catagories = useSelector((state) => state.application.catagories);
  const sideMenuRef = useRef(null);
  const searchBarRef = useRef(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [catalogDisplay, setCatalogDisplay] = useState(false);
  const [currentCatalog, setCurrentCatalog] = useState("Home");
  const [isTabletOrSmaller, setIsTabletOrSmaller] = useState(
    window.innerWidth <= 1024
  );
  const [searchData, setSearchData] = useState("");
  const [sideBarCatagoryOpen, setSideBarCatagoryOpen] = useState(false);
  const user = useSelector((state) => state.profile.user);
  const [searchSuggestions, setSearchSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // to update side menu
  const updateSideMenu = useCallback(() => {
    setMenuOpen((prev) => !prev);
  }, []);

  // update search area
  const updateSearchArea = useCallback(() => {
    setSearchOpen((prev) => !prev);
    setSearchData("");
    setShowSuggestions(false);
  }, []);

  // logout
  async function logout() {
    updateSideMenu();
    try {
      const response = await apiConnector("POST", apiLinks.logout);
      if (!response.success) {
        toast.error("unable to log-out", {
          autoClose: 900,
          hideProgressBar: true,
          pauseOnHover: false,
          closeOnClick: true,
          draggable: false,
        });
      } else {
        toast.info("log-out successfull", {
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
      toast.error("something went wrong", {
        autoClose: 900,
        hideProgressBar: true,
        pauseOnHover: false,
        closeOnClick: true,
        draggable: false,
      });
    }
  }

  // to make the catalog popup visible
  const updateCatalogDisplay = useCallback((name) => {
    setCurrentCatalog(name);
    if (name == "Catalog") {
      setCatalogDisplay((prev) => !prev);
    } else {
      setCatalogDisplay(false);
    }
  }, []);

  // to view the catlog in side bar menu
  const viewCatalogInSideBarMenu = useCallback(() => {
    setSideBarCatagoryOpen((prev) => !prev);
  }, []);

  // fetch catagory data
  const fetchCatagoryData = useCallback(async () => {
    try {
      const response = await apiConnector("GET", apiLinks.get_catagory_list);
      if (response.success) {
        dispatch(setCatagory(response.category));
      } else {
        dispatch(setCatagory([]));
      }
      return;
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }, []);

  // to handle cursor at the window
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

  // to fetch catagoryData
  useEffect(() => {
    try {
      fetchCatagoryData();
    } catch (error) {
      console.log(error);
    }
  }, [user]);

  // to setIsTabletOrSmaller for resizing
  useEffect(() => {
    const handleResize = () => {
      setIsTabletOrSmaller(window.innerWidth <= 1200);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  function updateSearchData(event) {
    const value = event.target.value;
    setSearchData(value);

    if (value.trim().length > 0 && searchOpen) {
      setShowSuggestions(true);
      const filtered = catagories
        .filter((category) =>
          category.name.toLowerCase().includes(value.toLowerCase())
        )
        .slice(0, 10);
      setSearchSuggestions(filtered);
    } else {
      setShowSuggestions(false);
      setSearchSuggestions([]);
    }
  }

  async function searchResponse(event, suggestion = null) {
    const searchTerm = suggestion || searchData;

    if (searchTerm.trim().length === 0) {
      setSearchOpen(false);
      return;
    }

    setSearchOpen(false);
    setShowSuggestions(false);
    navigate(`/search/${encodeURIComponent(searchTerm)}`);
  }

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

        {/* Desktop Navigation options */}
        <div className="hidden tablet:flex items-center gap-14 text-[19px] font-medium">
          {navOptions.map((value, index) => (
            <div key={index} className="relative">
              <Link to={`${value.location}`}>
                <p
                  className={`relative flex items-center gap-2 cursor-pointer ${
                    currentCatalog == value.name
                      ? "text-dark_red"
                      : "text-white"
                  } transition`}
                  onMouseEnter={() => updateCatalogDisplay(value.name)}
                >
                  {value.name}
                  {value.name === "Catalog" && catalogDisplay && (
                    <MdKeyboardArrowUp />
                  )}
                  {value.name === "Catalog" && !catalogDisplay && (
                    <MdKeyboardArrowDown />
                  )}
                </p>
              </Link>
              {value.name === "Catalog" && (
                <div
                  className={`fixed top-24 left-1/2 transform -translate-x-1/2 w-[80vw] max-w-[900px] bg-dark_bg border border-gray-700 text-white p-6 rounded-lg shadow-2xl z-20
                    transition-all duration-200 ease-in-out overflow-hidden
                    ${
                      catalogDisplay
                        ? "opacity-100 translate-y-0 visible"
                        : "opacity-0 -translate-y-2 invisible"
                    }`}
                  onMouseEnter={() => setCatalogDisplay(true)}
                  onMouseLeave={() => setCatalogDisplay(false)}
                >
                  <div className="grid grid-cols-4 gap-6">
                    {catagories.map((category, index) => (
                      <Link
                        to={`/category/${category.name}?catagory_id=${category._id}`}
                        key={index}
                        className="group"
                        onClick={() => setCatalogDisplay(false)}
                      >
                        <div className="flex flex-col items-center gap-2 p-3 rounded-lg hover:bg-gray-800 transition-all duration-200">
                          <div className="w-12 h-12 bg-gray-700 rounded-full flex items-center justify-center group-hover:bg-dark_red transition-all duration-200">
                            <span className="text-lg font-bold">
                              {category.name.charAt(0)}
                            </span>
                          </div>
                          <p className="text-center text-sm font-medium text-gray-300 group-hover:text-white">
                            {category.name}
                          </p>
                        </div>
                      </Link>
                    ))}
                  </div>
                  <div className="mt-4 pt-4 border-t border-gray-700">
                    <Link
                      to="/all-categories"
                      className="text-dark_red hover:text-red-400 font-medium flex items-center justify-center gap-2 transition-colors"
                      onClick={() => setCatalogDisplay(false)}
                    >
                      View All Categories
                      <MdKeyboardArrowDown className="text-xl" />
                    </Link>
                  </div>
                </div>
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

          {/* login/signup or user content */}
          <div className="hidden md:flex items-center gap-4">
            {!user && (
              <div className="flex md:flex items-center gap-4">
                <Button data="Login" color="red" path="/login" />
                <Button data="Register" color="red" path="/register" />
              </div>
            )}
            {user && (
              <div className="flex gap-4 items-center">
                {user.accountType == "Student" && (
                  <div>
                    <Link to="/cart" className="relative">
                      <IoCartOutline className="text-gray-300 hover:text-gray-200 text-[24px] cursor-pointer" />
                    </Link>
                  </div>
                )}

                <Link to="/dashboard">
                  <img
                    src={`${user.image}`}
                    alt="Profile"
                    className="w-14 h-14 rounded-full object-cover"
                  />
                </Link>
              </div>
            )}
          </div>
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

        {/* side bar menu */}
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
                    .filter((value) => value.name != "Catalog")
                    .map((value, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <Link
                          to={`${value.location}`}
                          className="block text-[18px] hover:text-dark_red hover:bg-gray-800 w-full text-left px-4 py-3 rounded-md transition-all duration-300 transform hover:translate-x-1"
                          onClick={updateSideMenu}
                        >
                          {value.name}
                        </Link>
                      </motion.div>
                    ))}
                </motion.div>
              )}

              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                className="w-full border-t border-gray-800 my-2 tablet:invisible"
              />

              {!user && isTabletOrSmaller && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                  className="w-full"
                >
                  <Link
                    to="/login"
                    className="block text-[18px] hover:text-dark_red hover:bg-gray-800 w-full text-left px-4 py-3 rounded-md transition-all duration-300 transform hover:translate-x-1"
                    onClick={updateSideMenu}
                  >
                    Login
                  </Link>
                </motion.div>
              )}

              {!user && isTabletOrSmaller && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.15 }}
                  className="w-full"
                >
                  <Link
                    to="/register"
                    className="block text-[18px] hover:text-dark_red hover:bg-gray-800 w-full text-left px-4 py-3 rounded-md transition-all duration-300 transform hover:translate-x-1"
                    onClick={updateSideMenu}
                  >
                    Register
                  </Link>
                </motion.div>
              )}

              {user && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                  className="w-full"
                >
                  <Link
                    to="/dashboard"
                    className="block text-[18px] hover:text-dark_red hover:bg-gray-800 w-full text-left px-4 py-3 rounded-md transition-all duration-300 transform hover:translate-x-1"
                    onClick={updateSideMenu}
                  >
                    Dashboard
                  </Link>
                </motion.div>
              )}

              {user && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.15 }}
                  className="w-full"
                >
                  <Link
                    to="/forgot-password"
                    className="block text-[18px] hover:text-dark_red hover:bg-gray-800 w-full text-left px-4 py-3 rounded-md transition-all duration-300 transform hover:translate-x-1"
                    onClick={updateSideMenu}
                  >
                    Reset Password
                  </Link>
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

              {isTabletOrSmaller && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.25 }}
                  className="w-full mt-2"
                >
                  <div
                    className="text-[18px] hover:text-dark_red hover:bg-gray-800 w-full text-left px-4 py-3 rounded-md transition-all duration-300 flex justify-between items-center cursor-pointer"
                    onClick={viewCatalogInSideBarMenu}
                  >
                    <span>Catalog</span>
                    <motion.div
                      animate={{ rotate: sideBarCatagoryOpen ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      {sideBarCatagoryOpen ? (
                        <MdKeyboardArrowUp className="text-xl" />
                      ) : (
                        <MdKeyboardArrowDown className="text-xl" />
                      )}
                    </motion.div>
                  </div>
                  <AnimatePresence>
                    {sideBarCatagoryOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <div className="flex flex-col ml-6 mt-1 gap-1">
                          {catagories.map((category, index) => (
                            <motion.div
                              key={index}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: 0.05 * index }}
                            >
                              <Link
                                to={`/category/${category.name}?catagory_id=${category._id}`}
                                className="block text-[16px] hover:text-dark_red hover:bg-gray-800 w-full text-left px-4 py-2 rounded-md transition-all duration-300 transform hover:translate-x-1"
                                onClick={updateSideMenu}
                              >
                                {category.name}
                              </Link>
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

        {/* Search Bar Popup with Suggestions */}
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
      </div>

      <div className="w-[99%] mt-3 m-auto h-[1px] bg-gray-700"></div>
    </div>
  );
};

export default Header;
