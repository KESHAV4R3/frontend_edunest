import React, { useEffect, useState } from "react";
import { apiConnector } from "../../services/apiConnector";
import { apiLinks } from "../../services/apiLink";
import CourseCard from "../../components/dashBoardpage/CourseCard";
import { useSelector } from "react-redux";

const DashboardPageCourses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState("All"); // state for course category filter
  const user = useSelector((state) => state.profile.user);

  // Function to fetch all courses and categories
  async function getAllCourses() {
    try {
      setLoading(true);
      let response = null;
      if (user.accountType === "Admin") {
        response = await apiConnector("GET", apiLinks.getAllCoursesInDataBase);
        if (response.allCourse.length > 0) {
          setCourses(response.allCourse);
        }
      } else if (
        user.accountType === "Instructor" ||
        user.accountType === "Student"
      ) {
        response = await apiConnector("GET", apiLinks.getAllCourses);
        if (response.allCourses.course.length > 0) {
          setCourses(response.allCourses.course);
        }
      }
    } catch (error) {
      setCourses([]);
    } finally {
      setLoading(false);
    }
  }

  // Filter courses based on selected category
  const filteredCourses =
    category === "All"
      ? courses
      : courses.filter((course) => course.category === category);

  // Fetch courses and categories on mount
  useEffect(() => {
    getAllCourses();
  }, []);

  // Loading spinner
  if (loading) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-5 mb-3 border-b-5 border-gray-600"></div>
        <p className="text-[20px] text-gray-400">Loading courses ...</p>
      </div>
    );
  }

  return (
    <div className="px-5 py-3">
      <h2 className="text-center text-[30px] mb-5">Your Courses</h2>

      {/* Display courses */}
      {filteredCourses.length === 0 ? (
        <div className="w-full mt-[300px] flex justify-center items-center">
          <p className="text-[20px] text-gray-400">No courses found.</p>
        </div>
      ) : (
        <div className="flex justify-center items-center flex-wrap p-5 gap-4">
          {filteredCourses.map((course) => (
            <CourseCard key={course._id} course={course} id={course._id} />
          ))}
        </div>
      )}
    </div>
  );
};

export default React.memo(DashboardPageCourses);
