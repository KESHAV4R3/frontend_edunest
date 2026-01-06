import React, { useEffect, useState, useMemo, lazy, Suspense, useCallback, memo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { apiConnector } from "../services/apiConnector";
import { apiLinks } from "../services/apiLink";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { FaSortAmountDown, FaGlobe, FaLayerGroup } from "react-icons/fa";

const CourseCard = lazy(() => import("../components/dashBoardpage/CourseCard"));

const CatagoryCourse = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const urlParams = new URLSearchParams(location.search);
  const categoryId = urlParams.get("catagory_id");

  const [allCourses, setAllCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortType, setSortType] = useState("");
  const [selectedLang, setSelectedLang] = useState("");
  
  const catagories = useSelector((state) => state.application.catagories) || [];

  const currentCategory = useMemo(
    () => catagories.find((cat) => cat._id === categoryId),
    [catagories, categoryId]
  );

  const fetchAllCourses = useCallback(async () => {
    if (!categoryId) return;
    try {
      setLoading(true);
      const url = `${apiLinks.getAllCouseByCategory}/${categoryId}`;
      const response = await apiConnector("GET", url);

      if (response?.success) {
        setAllCourses(response.category?.course || []);
      } else {
        toast.error("Failed to load courses");
      }
    } catch (error) {
      console.error("Fetch Error:", error);
      toast.error("Network error occurred");
    } finally {
      setLoading(false);
    }
  }, [categoryId]);

  useEffect(() => {
    fetchAllCourses();
  }, [fetchAllCourses]);

  const displayedCourses = useMemo(() => {
    let result = [...allCourses];
    if (selectedLang && selectedLang !== "all") {
      result = result.filter((c) => c.language === selectedLang);
    }
    switch (sortType) {
      case "price-low": result.sort((a, b) => a.price - b.price); break;
      case "price-high": result.sort((a, b) => b.price - a.price); break;
      case "newest": result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)); break;
      case "top-rated": result.sort((a, b) => (b.averageRating || 0) - (a.averageRating || 0)); break;
      default: break;
    }
    return result;
  }, [allCourses, sortType, selectedLang]);

  const handleCategoryNav = useCallback((e) => {
    const selected = catagories.find((cat) => cat.name === e.target.value);
    if (selected) {
      setSortType("");
      setSelectedLang("");
      navigate(`/category/${selected.name}?catagory_id=${selected._id}`);
    }
  }, [catagories, navigate]);

  if (loading) {
    return (
      <div className="w-full py-40 flex flex-col items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-red-600 mb-4 shadow-[0_0_15px_rgba(220,38,38,0.5)]"></div>
        <p className="text-gray-400 text-sm font-bold animate-pulse">Searching...</p>
      </div>
    );
  }

  return (
    <div className="w-full mx-auto p-4 md:p-6 flex flex-col min-h-screen text-gray-100">
      
      {/* --- Centered Page Header --- */}
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold uppercase">
          {currentCategory?.name || "Courses"} <span className="text-red-600">Sector</span>
        </h1>
        <p className="text-base text-gray-400 mt-2">
          Browse through our curated curriculum for {currentCategory?.name}
        </p>
      </div>

      {/* --- Centered Control Bar (Compact Width) --- */}
      <div className="bg-gray-800 border border-gray-700 p-6 rounded-2xl shadow-xl mx-auto w-full max-w-[900px] mb-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Sort Filter */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-bold text-gray-400 flex items-center gap-2">
              <FaSortAmountDown className="text-red-600" /> Sort Order
            </label>
            <select
              value={sortType}
              onChange={(e) => setSortType(e.target.value)}
              className="bg-gray-900 text-white border border-gray-700 rounded-lg px-3 py-3 text-sm focus:border-red-600 outline-none cursor-pointer appearance-none transition-all"
            >
              <option value="">Default Ranking</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="newest">Newest First</option>
              <option value="top-rated">Top Rated</option>
            </select>
          </div>

          {/* Category Switcher */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-bold text-gray-400 flex items-center gap-2">
              <FaLayerGroup className="text-red-600" /> Change Sector
            </label>
            <select
              value={currentCategory?.name || ""}
              onChange={handleCategoryNav}
              className="bg-gray-900 text-white border border-gray-700 rounded-lg px-3 py-3 text-sm focus:border-red-600 outline-none cursor-pointer appearance-none transition-all"
            >
              {catagories.map((cat) => (
                <option key={cat._id} value={cat.name}>{cat.name}</option>
              ))}
            </select>
          </div>

          {/* Language Filter */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-bold text-gray-400 flex items-center gap-2">
              <FaGlobe className="text-red-600" /> Language
            </label>
            <select
              value={selectedLang}
              onChange={(e) => setSelectedLang(e.target.value)}
              className="bg-gray-900 text-white border border-gray-700 rounded-lg px-3 py-3 text-sm focus:border-red-600 outline-none cursor-pointer appearance-none transition-all"
            >
              <option value="all">All Languages</option>
              <option value="English">English</option>
              <option value="Hindi">Hindi</option>
              <option value="Marathi">Marathi</option>
              <option value="Tamil">Tamil</option>
            </select>
          </div>
        </div>

        {/* Clear Filters (Centered below inputs) */}
        {(sortType || (selectedLang && selectedLang !== "all")) && (
          <div className="text-center mt-6">
            <button 
              onClick={() => { setSortType(""); setSelectedLang("all"); }}
              className="text-sm font-bold text-red-500 hover:text-red-400 transition-colors underline underline-offset-4"
            >
              Reset All Filters
            </button>
          </div>
        )}
      </div>

      {/* --- Centered Results --- */}
      <div className="flex-1">
        {displayedCourses.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mb-4 border border-gray-700">
              <span className="text-2xl text-red-600">!</span>
            </div>
            <h2 className="text-xl font-bold">No results match your criteria</h2>
            <p className="text-gray-400 mt-2">Try switching filters or selecting a different category.</p>
          </div>
        ) : (
          <div className="flex flex-wrap justify-center gap-10 pb-20">
            <Suspense fallback={<div className="text-gray-500 font-bold py-10">Preparing courses...</div>}>
              {displayedCourses.map((course) => (
                <div key={course._id} className="transition-all duration-300 hover:scale-[1.03]">
                  <CourseCard course={course} id={course._id} />
                </div>
              ))}
            </Suspense>
          </div>
        )}
      </div>
    </div>
  );
};

export default memo(CatagoryCourse);