import React, {
  useEffect,
  useState,
  useMemo,
  lazy,
  Suspense,
} from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { apiConnector } from "../services/apiConnector";
import { apiLinks } from "../services/apiLink";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";

const CourseCard = lazy(() => import("../components/dashBoardpage/CourseCard"));

const CatagoryCourse = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const urlParams = new URLSearchParams(location.search);
  const categoryId = urlParams.get("catagory_id");

  const [allCourses, setAllCourses] = useState([]);
  const [filterCourses, setFilterCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [noCoursesFound, setNoCoursesFound] = useState(false);
  const catagories = useSelector((state) => state.application.catagories);

  const currentCategory = useMemo(
    () => catagories.find((cat) => cat._id === categoryId),
    [catagories, categoryId]
  );

  useEffect(() => {
    async function fetchAllCourses() {
      try {
        setLoading(true);
        setNoCoursesFound(false);

        const url = apiLinks.getAllCouseByCategory + `/${categoryId}`;
        const response = await apiConnector("GET", url);

        if (!response.success) {
          toast.error("Unable to fetch the courses", { autoClose: 900 });
          return;
        }

        if (
          response.message === "no course found" ||
          !response.category?.course?.length
        ) {
          setNoCoursesFound(true);
          setAllCourses([]);
          return;
        }

        setAllCourses(response.category.course);
        setFilterCourses(response.category.course);
      } catch (error) {
        toast.error("Something went wrong", { autoClose: 900 });
      } finally {
        setLoading(false);
      }
    }

    fetchAllCourses();
  }, [categoryId]);

  const sortFilterHandler = (event) => {
    const value = event.target.value;
    let tempArray = [...allCourses];

    switch (value) {
      case "price-low":
        tempArray.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        tempArray.sort((a, b) => b.price - a.price);
        break;
      case "newest":
        tempArray.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      case "top-rated":
        tempArray.sort((a, b) => b.averageRating - a.averageRating);
        break;
      case "Cancel filter":
        tempArray = allCourses;
        break;
      default:
        break;
    }

    setFilterCourses(tempArray);
  };

  const languageFilterHandler = (event) => {
    const selectedLang = event.target.value;
    if (selectedLang === "Cancel filter") {
      setNoCoursesFound(false);
      setFilterCourses(allCourses);
      return;
    }

    const tempArr = allCourses.filter((course) => course.language === selectedLang);
    setNoCoursesFound(tempArr.length === 0);
    setFilterCourses(tempArr);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <div className="p-5 text-white">
      <div className="mb-6 w-full flex flex-col gap-3 items-center">
        <h2 className="text-2xl font-bold text-center">
          {currentCategory?.name || "Courses"} Category
        </h2>

        <div className="w-full flex flex-wrap justify-center gap-4">
          {/* Sort Dropdown */}
          <select
            onChange={sortFilterHandler}
            className="w-full md:w-60 p-2 border bg-gray-900 border-gray-700 rounded-lg text-gray-300"
          >
            <option value="">Sort by...</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="newest">Newest First</option>
            <option value="top-rated">Top Rated</option>
            <option value="Cancel filter">Cancel filter</option>
          </select>

          {/* Category Dropdown */}
          <select
            onChange={(e) => {
              const selectedCategory = catagories.find(
                (cat) => cat.name === e.target.value
              );
              if (selectedCategory) {
                navigate(
                  `/category/${selectedCategory.name}?catagory_id=${selectedCategory._id}`
                );
              }
            }}
            className="w-full md:w-60 p-2 border bg-gray-900 border-gray-700 rounded-lg text-gray-300"
          >
            <option value="">Select Category...</option>
            {catagories.map((value) => (
              <option key={value._id} value={value.name}>
                {value.name}
              </option>
            ))}
          </select>

          {/* Language Dropdown */}
          <select
            onChange={languageFilterHandler}
            className="w-full md:w-60 p-2 border bg-gray-900 border-gray-700 rounded-lg text-gray-300"
          >
            <option value="">Search by Language...</option>
            <option value="English">English</option>
            <option value="Hindi">Hindi</option>
            <option value="Marathi">Marathi</option>
            <option value="Tamil">Tamil</option>
            <option value="Cancel filter">Cancel filter</option>
          </select>
        </div>
      </div>

      {/* No courses message */}
      {noCoursesFound ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="text-6xl mb-4">📚</div>
          <h2 className="text-2xl font-semibold text-gray-300 mb-2">
            No Courses Found
          </h2>
          <p className="text-gray-500 max-w-md">
            We couldn't find any courses for this category. Please check back
            later or explore other categories.
          </p>
        </div>
      ) : (
        <div className="flex flex-wrap justify-center gap-6">
          <Suspense
            fallback={
              <div className="text-white text-center">Loading Courses...</div>
            }
          >
            {filterCourses.map((course, index) => (
              <CourseCard
                key={index}
                course={{
                  name: course.name,
                  description: course.description,
                  language: course.language,
                  price: course.price,
                  thumbnail: course.thumbnail,
                  averageRating: course.averageRating,
                }}
                id={course._id}
              />
            ))}
          </Suspense>
        </div>
      )}
    </div>
  );
};

export default CatagoryCourse;
