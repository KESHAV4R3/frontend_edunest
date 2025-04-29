import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { apiConnector } from "../services/apiConnector";
import { apiLinks } from "../services/apiLink";
import CourseCard from "../components/dashBoardpage/CourseCard";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

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

  useEffect(() => {
    async function fetchAllCourses() {
      try {
        setLoading(true);
        setNoCoursesFound(false);

        const url = apiLinks.getAllCouseByCategory + `/${categoryId}`;
        const response = await apiConnector("GET", url);

        if (!response.success) {
          toast.error("Unable to fetch the courses", {
            autoClose: 900,
            hideProgressBar: true,
            pauseOnHover: false,
            closeOnClick: true,
            draggable: false,
          });
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
        setFilterCourses(response.category.course);
        setAllCourses(response.category.course);
      } catch (error) {
        toast.error("Something went wrong", {
          autoClose: 900,
          hideProgressBar: true,
          pauseOnHover: false,
          closeOnClick: true,
          draggable: false,
        });
      } finally {
        setLoading(false);
      }
    }
    fetchAllCourses();
  }, [location]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  // filter function
  function sortFilterHandler(event) {
    let tempArray = [...allCourses]; // 🔥 create a new copy

    switch (event.target.value) {
      case "price-low":
        tempArray.sort((a, b) => a.price - b.price);
        break;

      case "price-high":
        tempArray.sort((a, b) => b.price - a.price);
        break;

      case "newest":
        tempArray.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
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

    setFilterCourses(tempArray); // ✅ properly updates the state
  }
  function languageFilterHandler(event) {
    const selectedLang = event.target.value;
    if (selectedLang === "Cancel filter") {
      setNoCoursesFound(false);
      setFilterCourses(allCourses);
      return;
    }

    const tempArr = allCourses.filter(
      (course) => course.language === selectedLang
    );

    if (tempArr.length === 0) {
      setNoCoursesFound(true);
    } else {
      setNoCoursesFound(false);
      setFilterCourses(tempArr);
    }
  }

  return (
    <div className="flex justify-center items-center flex-wrap p-5 text-white gap-6">
      <div className="flex flex-col justify-center items-center w-full">
        <div className="header w-[95%] md:w-[70%] mx-auto h-[80px] border-1 border-gray-800 rounded-lg flex justify-evenly items-center bg-gray-900 shadow-sm">
          <div className="w-full px-4 flex justify-evenly items-center">
            <select
              name="sort"
              id="sort"
              onChange={sortFilterHandler}
              className="w-full md:w-64 p-2 border-1 bg-gray-900 border-gray-700 rounded-lg focus:ring-1 focus:ring-blue-800 focus:border-blue-800 outline-none transition-all cursor-pointer text-gray-300"
            >
              <option
                value=""
                defaultValue
                className="text-gray-400 border-gray-700"
              >
                Sort by...
              </option>
              <option value="price-low" className="p-2 hover:bg-blue-100">
                Price: Low to High
              </option>
              <option value="price-high" className="p-2 hover:bg-blue-100">
                Price: High to Low
              </option>
              <option value="newest" className="p-2 hover:bg-blue-100">
                Newest First
              </option>
              <option value="top-rated" className="p-2 hover:bg-blue-100">
                Top Rated
              </option>
              <option value="Cancel filter" className="p-2 hover:bg-blue-100">
                cancel filter
              </option>
            </select>

            <select
              className="w-full md:w-64 p-2 border-1 bg-gray-900 border-gray-700 rounded-lg focus:ring-1 focus:ring-blue-800 focus:border-blue-800 outline-none transition-all cursor-pointer text-gray-300"
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
            >
              <option
                value=""
                defaultValue
                className="text-gray-400 border-gray-700"
              >
                Select Category ...
              </option>
              {catagories.map((value, index) => (
                <option
                  value={value.name}
                  key={index}
                  className="p-2 hover:bg-blue-100"
                >
                  {value.name}
                </option>
              ))}
            </select>

            <select
              onChange={languageFilterHandler}
              className="w-full md:w-64 p-2 border-1 bg-gray-900 border-gray-700 rounded-lg focus:ring-1 focus:ring-blue-800 focus:border-blue-800 outline-none transition-all cursor-pointer text-gray-300"
            >
              <option
                value=""
                defaultValue
                className="text-gray-400 border-gray-700"
              >
                Search by Language...
              </option>
              <option value="English" className="p-2 hover:bg-blue-100">
                English
              </option>
              <option value="Hindi" className="p-2 hover:bg-blue-100">
                Hindi
              </option>
              <option value="Marathi" className="p-2 hover:bg-blue-100">
                Marathi
              </option>
              <option value="Tamil" className="p-2 hover:bg-blue-100">
                Tamil
              </option>
              <option value="Cancel filter" className="p-2 hover:bg-blue-100">
                cancel filter
              </option>
            </select>
          </div>
        </div>
        {noCoursesFound && (
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
        )}
      </div>

      {!noCoursesFound &&
        filterCourses.map((value, index) => {
          const course = {
            name: value.name,
            description: value.description,
            language: value.language,
            price: value.price,
            thumbnail: value.thumbnail,
            averageRating: value.averageRating,
          };
          return <CourseCard key={index} course={course} id={value._id} />;
        })}
    </div>
  );
};

export default CatagoryCourse;
