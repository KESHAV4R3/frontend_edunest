import { useState, useEffect, useRef } from "react";
import { apiLinks } from "../../services/apiLink";
import { apiConnector } from "../../services/apiConnector";
import { IoIosArrowForward, IoIosArrowBack } from "react-icons/io";

// Sample data matching the new structure
const sampleCourse = [
  {
    id: 1,
    name: "Advanced React Development",
    instructor: "Jane Smith",
    averageRating: 4.9,
    price: 89.99,
    thumbnail:
      "https://gratisography.com/wp-content/uploads/2024/11/gratisography-augmented-reality-800x525.jpg",
    createdAt: "2023-04-10T10:00:00Z",
  },
  {
    id: 2,
    name: "Complete JavaScript Mastery",
    instructor: "John Doe",
    averageRating: 4.8,
    price: 79.99,
    thumbnail:
      "https://gratisography.com/wp-content/uploads/2024/11/gratisography-augmented-reality-800x525.jpg",
    createdAt: "2023-03-15T08:30:00Z",
  },
  {
    id: 3,
    name: "Node.js From Beginner to Expert",
    instructor: "Mike Johnson",
    averageRating: 4.7,
    price: 99.99,
    thumbnail:
      "https://gratisography.com/wp-content/uploads/2024/11/gratisography-augmented-reality-800x525.jpg",
    createdAt: "2023-05-01T14:15:00Z",
  },
  {
    id: 4,
    name: "Introduction to TypeScript",
    instructor: "Sarah Williams",
    averageRating: 4.6,
    price: 69.99,
    thumbnail:
      "https://gratisography.com/wp-content/uploads/2024/11/gratisography-augmented-reality-800x525.jpg",
    createdAt: "2023-05-15T09:45:00Z",
  },
  {
    id: 5,
    name: "Modern CSS with Tailwind",
    instructor: "David Brown",
    averageRating: 4.5,
    price: 59.99,
    thumbnail:
      "https://gratisography.com/wp-content/uploads/2024/11/gratisography-augmented-reality-800x525.jpg",
    createdAt: "2023-05-10T11:20:00Z",
  },
  {
    id: 6,
    name: "GraphQL Fundamentals",
    instructor: "Emily Davis",
    averageRating: 4.4,
    price: 79.99,
    thumbnail:
      "https://gratisography.com/wp-content/uploads/2024/11/gratisography-augmented-reality-800x525.jpg",
    createdAt: "2023-05-05T16:10:00Z",
  },
];

const CourseDisplay = () => {
  const [topRatedCourses, setTopRatedCourses] = useState([]);
  const [recentCourses, setRecentCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [topRatedIndex, setTopRatedIndex] = useState(0);
  const [recentIndex, setRecentIndex] = useState(0);
  const topRatedRef = useRef(null);
  const recentRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  // Responsive number of cards to show
  const getCardsToShow = () => {
    if (typeof window === 'undefined') return 4;
    const width = window.innerWidth;
    if (width < 640) return 1;  // Mobile
    if (width < 768) return 2;  // Tablet
    if (width < 1024) return 3; // Small desktop
    return 4;                   // Large desktop
  };

  const [cardsToShow, setCardsToShow] = useState(getCardsToShow());

  useEffect(() => {
    const handleResize = () => {
      setCardsToShow(getCardsToShow());
      // Reset indexes on resize to prevent empty space
      setTopRatedIndex(0);
      setRecentIndex(0);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const getCourses = async () => {
      try {
        setLoading(true);
        const url = apiLinks.getTopCourses;
        const response = await apiConnector("get", url);

        if (response?.success) {
          setTopRatedCourses(sampleCourse);
          setRecentCourses(sampleCourse);
        } else {
          setTopRatedCourses(sampleCourse);
          setRecentCourses(sampleCourse);
        }
      } catch (err) {
        setError(err.message);
        setTopRatedCourses(sampleCourse);
        setRecentCourses(sampleCourse);
      } finally {
        setLoading(false);
      }
    };

    getCourses();
  }, []);

  const nextTopRatedSlide = () => {
    setTopRatedIndex((prevIndex) =>
      prevIndex >= topRatedCourses.length - cardsToShow ? 0 : prevIndex + 1
    );
  };

  const prevTopRatedSlide = () => {
    setTopRatedIndex((prevIndex) =>
      prevIndex === 0 ? topRatedCourses.length - cardsToShow : prevIndex - 1
    );
  };

  const nextRecentSlide = () => {
    setRecentIndex((prevIndex) =>
      prevIndex >= recentCourses.length - cardsToShow ? 0 : prevIndex + 1
    );
  };

  const prevRecentSlide = () => {
    setRecentIndex((prevIndex) =>
      prevIndex === 0 ? recentCourses.length - cardsToShow : prevIndex - 1
    );
  };

  // Touch and mouse event handlers for swipe
  const handleDragStart = (e, ref) => {
    setIsDragging(true);
    setStartX(e.pageX || e.touches[0].pageX);
    setScrollLeft(ref.current.scrollLeft);
  };

  const handleDragMove = (e, ref) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX || e.touches[0].pageX;
    const walk = (x - startX) * 2; // Adjust scroll speed
    ref.current.scrollLeft = scrollLeft - walk;
  };

  const handleDragEnd = (ref, setIndex) => {
    setIsDragging(false);
    const container = ref.current;
    const cardWidth = container.scrollWidth / recentCourses.length;
    const newIndex = Math.round(container.scrollLeft / cardWidth);
    setIndex(Math.max(0, Math.min(newIndex, recentCourses.length - cardsToShow)));
  };

  // Helper function to format price
  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "INR",
    }).format(price);
  };

  // Helper function to format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (loading) {
    return <div className="text-center py-8 text-gray-200">Loading courses...</div>;
  }

  if (error) {
    return <div className="text-center py-8 text-red-500">Error: {error}</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <hr className="border-gray-700 mb-10" />
      <h1 className="text-3xl md:text-4xl font-bold mb-8 text-gray-200 text-center">
        Featured Courses
      </h1>

      {/* Top Rated Courses Section */}
      <section className="mb-12 relative">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl md:text-2xl font-semibold text-gray-400">
            Top Rated Courses
            <div className="w-full h-[1px] bg-gray-700 mt-1"></div>
          </h2>
          <div className="flex space-x-2">
            <button
              onClick={prevTopRatedSlide}
              className="p-2 rounded-full cursor-pointer hover:bg-gray-700 transition"
              aria-label="Previous slide"
            >
              <IoIosArrowBack className="text-white bg-gray-800 w-6 h-6 md:w-8 md:h-8 p-1 md:p-2 rounded-full" />
            </button>
            <button
              onClick={nextTopRatedSlide}
              className="p-2 rounded-full cursor-pointer hover:bg-gray-700 transition"
              aria-label="Next slide"
            >
              <IoIosArrowForward className="text-white bg-gray-800 w-6 h-6 md:w-8 md:h-8 p-1 md:p-2 rounded-full" />
            </button>
          </div>
        </div>

        <div className="relative overflow-hidden">
          <div
            ref={topRatedRef}
            className="flex transition-transform duration-300 ease-in-out"
            style={{
              transform: `translateX(-${topRatedIndex * (100 / cardsToShow)}%)`,
              width: `${topRatedCourses.length * (100 / cardsToShow)}%`,
            }}
            onMouseDown={(e) => handleDragStart(e, topRatedRef)}
            onMouseMove={(e) => handleDragMove(e, topRatedRef)}
            onMouseUp={() => handleDragEnd(topRatedRef, setTopRatedIndex)}
            onMouseLeave={() => handleDragEnd(topRatedRef, setTopRatedIndex)}
            onTouchStart={(e) => handleDragStart(e, topRatedRef)}
            onTouchMove={(e) => handleDragMove(e, topRatedRef)}
            onTouchEnd={() => handleDragEnd(topRatedRef, setTopRatedIndex)}
          >
            {topRatedCourses.map((course) => (
              <div
                key={course.id}
                className="flex-shrink-0 px-2 transition-all duration-300"
                style={{ 
                  width: `${100 / cardsToShow}%`,
                  minWidth: `${100 / Math.min(cardsToShow, topRatedCourses.length)}%`
                }}
              >
                <div className="bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow h-full flex flex-col border border-gray-700">
                  <img
                    src={course.thumbnail}
                    alt={course.name}
                    className="w-full h-40 md:h-48 object-cover"
                    onError={(e) => {
                      e.target.src =
                        "https://via.placeholder.com/300x200?text=Course+Image";
                    }}
                  />
                  <div className="p-4 flex flex-col flex-grow">
                    <h3 className="text-md md:text-lg font-bold mb-2 line-clamp-2 text-gray-200">
                      {course.name}
                    </h3>
                    <p className="text-gray-400 text-sm mb-2">
                      By {course.instructor}
                    </p>
                    <div className="flex justify-between items-center mb-3 mt-auto">
                      <div className="flex items-center">
                        <span className="text-yellow-500 font-bold mr-1">
                          {course.averageRating}
                        </span>
                        <svg
                          className="w-4 h-4 text-yellow-500"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      </div>
                      <span className="text-green-400 font-bold text-sm">
                        {formatPrice(course.price)}
                      </span>
                    </div>
                    <button className="w-full bg-blue-600 text-white px-3 py-2 rounded hover:bg-blue-700 transition text-sm mt-2">
                      Enroll Now
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Recent Courses Section */}
      <section className="relative mb-12">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl md:text-2xl font-semibold text-gray-400">
            Recently Added
            <div className="w-full h-[1px] bg-gray-700 mt-1"></div>
          </h2>
          <div className="flex space-x-2">
            <button
              onClick={prevRecentSlide}
              className="p-2 rounded-full cursor-pointer hover:bg-gray-700 transition"
              aria-label="Previous slide"
            >
              <IoIosArrowBack className="text-white bg-gray-800 w-6 h-6 md:w-8 md:h-8 p-1 md:p-2 rounded-full" />
            </button>
            <button
              onClick={nextRecentSlide}
              className="p-2 rounded-full cursor-pointer hover:bg-gray-700 transition"
              aria-label="Next slide"
            >
              <IoIosArrowForward className="text-white bg-gray-800 w-6 h-6 md:w-8 md:h-8 p-1 md:p-2 rounded-full" />
            </button>
          </div>
        </div>

        <div className="relative overflow-hidden">
          <div
            ref={recentRef}
            className="flex transition-transform duration-300 ease-in-out"
            style={{
              transform: `translateX(-${recentIndex * (100 / cardsToShow)}%)`,
              width: `${recentCourses.length * (100 / cardsToShow)}%`,
            }}
            onMouseDown={(e) => handleDragStart(e, recentRef)}
            onMouseMove={(e) => handleDragMove(e, recentRef)}
            onMouseUp={() => handleDragEnd(recentRef, setRecentIndex)}
            onMouseLeave={() => handleDragEnd(recentRef, setRecentIndex)}
            onTouchStart={(e) => handleDragStart(e, recentRef)}
            onTouchMove={(e) => handleDragMove(e, recentRef)}
            onTouchEnd={() => handleDragEnd(recentRef, setRecentIndex)}
          >
            {recentCourses.map((course) => (
              <div
                key={course.id}
                className="flex-shrink-0 px-2 transition-all duration-300"
                style={{ 
                  width: `${100 / cardsToShow}%`,
                  minWidth: `${100 / Math.min(cardsToShow, recentCourses.length)}%`
                }}
              >
                <div className="bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow h-full flex flex-col border border-gray-700">
                  <img
                    src={course.thumbnail}
                    alt={course.name}
                    className="w-full h-40 md:h-48 object-cover"
                    onError={(e) => {
                      e.target.src =
                        "https://via.placeholder.com/300x200?text=Course+Image";
                    }}
                  />
                  <div className="p-4 flex flex-col flex-grow">
                    <h3 className="text-md md:text-lg font-bold mb-2 line-clamp-2 text-gray-200">
                      {course.name}
                    </h3>
                    <p className="text-gray-400 text-sm mb-2">
                      By {course.instructor}
                    </p>
                    <div className="flex justify-between items-center mb-3 mt-auto">
                      <div className="flex items-center">
                        <span className="text-yellow-500 font-bold mr-1">
                          {course.averageRating}
                        </span>
                        <svg
                          className="w-4 h-4 text-yellow-500"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      </div>
                      <span className="text-green-400 font-bold text-sm">
                        {formatPrice(course.price)}
                      </span>
                    </div>
                    <p className="text-gray-500 text-xs mb-3">
                      Added: {formatDate(course.createdAt)}
                    </p>
                    <button className="w-full bg-blue-600 text-white px-3 py-2 rounded hover:bg-blue-700 transition text-sm">
                      Enroll Now
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default CourseDisplay;