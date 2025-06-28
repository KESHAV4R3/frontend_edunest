import { useState, useEffect, useRef } from "react";
import { apiLinks } from "../../services/apiLink";
import { apiConnector } from "../../services/apiConnector";
import { useNavigate } from "react-router-dom";

const CourseDisplay = () => {
  const [topRatedCourses, setTopRatedCourses] = useState([]);
  const [recentCourses, setRecentCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [windowWidth, setWindowWidth] = useState(0);
  const topRatedRef = useRef(null);
  const recentRef = useRef(null);
  const navigate = useNavigate();

  // navigateEnroll
  const navigateEnroll = (id) => {
    navigate(`/course-detail/${id}`);
  };
  // Calculate cards to show based on window width
  const getCardsToShow = () => {
    if (windowWidth < 640) return 1;
    if (windowWidth < 768) return 2;
    if (windowWidth < 1024) return 3;
    return 4;
  };

  const cardsToShow = getCardsToShow();

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    // Set initial width
    setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const getCourses = async () => {
      try {
        setLoading(true);
        const response = await apiConnector("get", apiLinks.getTopCourses);
        console.log(response.topRatedCourses[0]);
        console.log(response.topLatestCourses[0]);
        if (response?.success) {
          setTopRatedCourses(response.topRatedCourses || []);
          setRecentCourses(response.topLatestCourses || []);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    getCourses();
  }, []);

  // Handle scroll behavior
  const handleScroll = (ref, direction) => {
    const container = ref.current;
    if (!container) return;

    const cardWidth = container.firstChild?.clientWidth || 0;
    const scrollAmount = cardWidth * cardsToShow;

    if (direction === "left") {
      container.scrollBy({ left: -scrollAmount, behavior: "smooth" });
    } else {
      container.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  if (loading)
    return (
      <div className="text-center py-20">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
        <p className="text-gray-400 text-lg">Loading courses...</p>
      </div>
    );

  if (error)
    return (
      <div className="text-center py-20">
        <div className="text-red-500 text-4xl mb-4">⚠️</div>
        <p className="text-red-500 text-lg">Error loading courses</p>
        <p className="text-gray-400 mt-2">{error}</p>
      </div>
    );

  const CourseCard = ({ course, showDate = false }) => (
    <div className="px-2 w-full" style={{ minWidth: `${100 / cardsToShow}%` }}>
      <div className="bg-gray-800 rounded-xl shadow-lg overflow-hidden h-[400px] md:h-[350px] cursor-pointer flex flex-col border border-gray-700 hover:border-blue-500 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
        <div className="relative overflow-hidden h-40 md:h-48">
          <img
            src={course.thumbnail}
            alt={course.name}
            className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src =
                "https://via.placeholder.com/300x200?text=Course+Image";
            }}
          />
          <div className="absolute bottom-2 right-2 bg-black bg-opacity-70 text-yellow-400 text-xs px-2 py-1 rounded flex items-center">
            <svg
              className="w-3 h-3 mr-1"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            {course.averageRating}
          </div>
        </div>
        <div className="p-4 flex flex-col flex-grow">
          <h3 className="text-md md:text-lg font-bold mb-2 line-clamp-2 text-gray-200 hover:text-blue-400 transition-colors">
            {course.name}
          </h3>
          <p className="text-gray-400 text-sm mb-2">
            By{" "}
            {Array.isArray(course.instructor)
              ? course.instructor.map((inst, index) => (
                  <span key={inst._id || index} className="text-gray-100">
                    {inst.firstName} {inst.lastName}
                    {index < course.instructor.length - 1 ? ", " : ""}
                  </span>
                ))
              : course.instructor}
          </p>

          <div className="mt-auto">
            {showDate && (
              <p className="text-gray-400 text-s mb-3 font-bold">
                Added :{" "}
                <span className="text-red-500 text-s mb-3  font-bold ">
                  {new Date(course.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </span>
              </p>
            )}
            <div className="flex justify-between items-center mb-3">
              <span className="text-green-400 font-bold text-sm">
                {new Intl.NumberFormat("en-IN", {
                  style: "currency",
                  currency: "INR",
                }).format(course.price)}
              </span>
              <button
                onClick={() => {
                  navigateEnroll(course._id);
                }}
                className="bg-blue-600 cursor-pointer hover:bg-blue-700 text-white px-3 py-1 rounded-full text-xs transition-all duration-300 transform hover:scale-105"
              >
                Enroll Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const CourseSlider = ({ courses, title, showDate, scrollRef }) => {
    const [showLeftButton, setShowLeftButton] = useState(false);
    const [showRightButton, setShowRightButton] = useState(true);

    const checkScrollPosition = () => {
      if (!scrollRef.current) return;

      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setShowLeftButton(scrollLeft > 0);
      setShowRightButton(scrollLeft < scrollWidth - clientWidth);
    };

    useEffect(() => {
      const container = scrollRef.current;
      if (container) {
        container.addEventListener("scroll", checkScrollPosition);
        checkScrollPosition(); // Initial check
      }
      return () => {
        if (container) {
          container.removeEventListener("scroll", checkScrollPosition);
        }
      };
    }, [courses, cardsToShow]);

    return (
      <section className="mb-16 relative">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-200">
            {title}
          </h2>
          <div className="flex space-x-2">
            <button
              onClick={() => handleScroll(scrollRef, "left")}
              className={`p-2 rounded-full bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white transition-all ${
                !showLeftButton ? "opacity-50 cursor-not-allowed" : ""
              }`}
              disabled={!showLeftButton}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
            <button
              onClick={() => handleScroll(scrollRef, "right")}
              className={`p-2 rounded-full bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white transition-all ${
                !showRightButton ? "opacity-50 cursor-not-allowed" : ""
              }`}
              disabled={!showRightButton}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </div>
        </div>

        <div className="relative">
          <div
            ref={scrollRef}
            className="flex overflow-x-hidden scroll-smooth space-x-0 py-2"
          >
            {courses.map((course) => (
              <div
                key={course._id}
                className="flex-shrink-0"
                style={{ width: `${100 / cardsToShow}%` }}
              >
                <CourseCard course={course} showDate={showDate} />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white">
          Featured Courses
        </h1>
        <p className="text-gray-400 max-w-2xl mx-auto">
          Discover our top-rated and newest courses to boost your skills and
          career
        </p>
      </div>

      <CourseSlider
        courses={topRatedCourses}
        title="Top Rated Courses"
        scrollRef={topRatedRef}
      />

      <CourseSlider
        courses={recentCourses}
        title="Recently Added"
        showDate={true}
        scrollRef={recentRef}
      />
    </div>
  );
};

export default CourseDisplay;
