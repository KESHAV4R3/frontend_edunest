import React, { useEffect, useState } from "react";
import { apiConnector } from "../../services/apiConnector";
import { apiLinks } from "../../services/apiLink";
import { FiUsers, FiDollarSign, FiBook } from "react-icons/fi";

const Earnings = () => {
  const [earnings, setEarnings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalEarnings, setTotalEarnings] = useState(0);

  useEffect(() => {
    const getEarningData = async () => {
      try {
        const response = await apiConnector("get", apiLinks.getAllEarnings);
        setEarnings(response.earnings || []);

        // Calculate total earnings across all courses
        const total = response.earnings.reduce(
          (sum, earning) =>
            sum + earning.course.price * earning.studentEnrolled,
          0
        );
        setTotalEarnings(total);
      } catch (error) {
        console.error("Error fetching earnings data:", error);
      } finally {
        setLoading(false);
      }
    };
    getEarningData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Your Earnings</h1>
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-lg shadow-lg">
          <p className="text-sm font-medium">Total Earnings</p>
          <p className="text-2xl font-bold">
            ₹{totalEarnings.toLocaleString()}
          </p>
        </div>
      </div>

      {/* No Data State */}
      {earnings.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm p-8 text-center">
          <FiBook className="mx-auto text-4xl text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-700">
            No earnings data available
          </h3>
          <p className="text-gray-500 mt-2">
            Your earnings will appear here when students enroll in your courses.
          </p>
        </div>
      ) : (
        // Earnings Cards
        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3">
          {earnings.map((earning) => (
            <div
              key={earning._id}
              className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow duration-300"
            >
              {/* Thumbnail */}
              <img
                src={earning.course.thumbnail}
                alt={earning.course.name}
                className="w-full h-40 object-cover"
              />

              {/* Course Info */}
              <div className="p-4 space-y-2">
                <h3 className="text-lg font-semibold text-gray-800 line-clamp-2">
                  {earning.course.name}
                </h3>
                <p className="text-sm text-gray-500">
                  Course Price: ₹{earning.course.price.toLocaleString()}
                </p>

                {/* Enrollment & Revenue */}
                <div className="flex justify-between items-center mt-2">
                  <div className="flex items-center gap-1 text-sm text-gray-600">
                    <FiUsers className="text-blue-500" />
                    {earning.studentEnrolled} students
                  </div>
                  <div className="flex items-center gap-1 text-sm font-semibold text-green-600">
                    <FiDollarSign />
                    ₹
                    {(
                      earning.course.price * earning.studentEnrolled
                    ).toLocaleString()}
                  </div>
                </div>

                {/* Visual Progress Bar */}
                <div className="w-full bg-gray-100 rounded-full h-2 mt-3">
                  <div
                    className="bg-blue-500 h-2 rounded-full"
                    style={{
                      width: `${Math.min(
                        earning.studentEnrolled * 10,
                        100
                      )}%`,
                    }}
                  ></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Earnings;
