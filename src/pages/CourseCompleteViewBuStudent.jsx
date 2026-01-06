import React, { useEffect, useState, useRef } from "react";
import { apiLinks } from "../services/apiLink";
import { apiConnector } from "../services/apiConnector";
import { useLocation } from "react-router-dom";
import {
  FaPlay,
  FaClock,
  FaCheck,
  FaStar,
  FaRegStar,
  FaEdit,
  FaTrash,
} from "react-icons/fa";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import { motion } from "framer-motion";
import { toast } from "react-toastify";

const CourseCompleteViewByStudent = () => {
  const location = useLocation();
  const courseId = location.pathname.split("/").at(-1);
  const [loading, setLoading] = useState(true);
  const [course, setCourse] = useState(null);
  const [activeSection, setActiveSection] = useState(0);
  const [activeSubSection, setActiveSubSection] = useState(0);
  const [videoLoading, setVideoLoading] = useState(true);
  const [openSections, setOpenSections] = useState({});
  const [completedVideos, setCompletedVideos] = useState([]);
  const [progressPercent, setProgressPercent] = useState(0);
  const [totalVideos, setTotalVideos] = useState(0);
  const videoRef = useRef(null);
  const [totalVideo, setTotalVideo] = useState(0);

  // Review states
  const [userReview, setUserReview] = useState(null);
  const [reviewForm, setReviewForm] = useState({
    rating: 5,
    review: "",
    review_id: "",
  });
  const [updateReviewForm, setUpdateReviewForm] = useState({
    rating: 5,
    review: "",
    review_id: "",
  });
  const [isEditingReview, setIsEditingReview] = useState(false);
  const [reviewLoading, setReviewLoading] = useState(false);
  const [deleteReviewLoading, setDeleteReviewLoading] = useState(false);
  const [isReviewUpdating, setIsReviewUpdating] = useState(false);

  useEffect(() => {
    async function fetchCourseDetail() {
      try {
        setLoading(true);
        const url = apiLinks.getCourseById + `/${courseId}`;
        const response = await apiConnector("GET", url);

        let temp = 0;
        for (let i = 0; i < response?.data?.section.length; i++) {
          for (
            let j = 0;
            j < response?.data?.section[i].subSection.length;
            j++
          ) {
            temp++;
          }
        }
        setTotalVideo(temp);

        if (response.success) {
          const parsedCourse = {
            ...response.data,
            whatYouWillLearn:
              typeof response.data.whatYouWillLearn === "string"
                ? JSON.parse(response.data.whatYouWillLearn)
                : response.data.whatYouWillLearn,
          };
          setCourse(parsedCourse);
        }
      } catch (error) {
        console.error("Error fetching course details:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchCourseDetail();
  }, [courseId]);

  const fetchProgress = async () => {
    try {
      const res = await apiConnector(
        "GET",
        `${apiLinks.get_progress}/${courseId}`
      );

      if (res.success && res.data) {
        const { completed, completedCount, totalCount } = res.data;

        setCompletedVideos(completed);
        setTotalVideos(totalCount);

        const percent =
          totalCount === 0 ? 0 : (completedCount / totalCount) * 100;
        setProgressPercent(Math.round(percent));
      }
    } catch (err) {
      console.error("Error fetching progress", err);
    }
  };

  // Fetch reviews data
  const fetchReviews = async () => {
    try {
      setReviewLoading(true);
      const reviewsResponse = await apiConnector(
        "GET",
        `${apiLinks.getReview}/${courseId}`
      );

      if (reviewsResponse?.success && reviewsResponse.data) {
        setReviewForm({
          rating: reviewsResponse.data.rating,
          review: reviewsResponse.data.review,
          review_id: reviewsResponse.data._id,
        });
        setUserReview(reviewsResponse.data);
      } else {
        // Reset if no review exists
        setReviewForm({
          rating: 5,
          review: "",
          review_id: "",
        });
        setUserReview(null);
      }
    } catch (error) {
      console.error("Error fetching reviews:", error);
      toast.error("Failed to load reviews");
    } finally {
      setReviewLoading(false);
    }
  };

  // Delete review
  const deleteReview = async () => {
    try {
      setDeleteReviewLoading(true);
      const url =
        apiLinks.deleteReview + `/${reviewForm.review_id}/${course._id}`;
      const response = await apiConnector("DELETE", url);

      if (response.success) {
        toast.success("Review deleted successfully");
        setReviewForm({
          rating: 5,
          review: "",
          review_id: "",
        });
        setUserReview(null);
      }
    } catch (error) {
      console.error("Error deleting review:", error);
      toast.error("Failed to delete review");
    } finally {
      setDeleteReviewLoading(false);
    }
  };

  const handleReviewChange = (e) => {
    const { name, value } = e.target;
    setReviewForm((prev) => ({
      ...prev,
      [name]: name === "rating" ? parseInt(value) : value,
    }));
  };

  const handleUpdateReviewChange = (e) => {
    const { name, value } = e.target;
    setUpdateReviewForm((prev) => ({
      ...prev,
      [name]: name === "rating" ? parseInt(value) : value,
    }));
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();

    if (!reviewForm.review.trim()) {
      toast.error("Please write a review");
      return;
    }

    try {
      setReviewLoading(true);
      let response;

      if (reviewForm.review_id) {
        // Update existing review
        response = await apiConnector(
          "PUT",
          `${apiLinks.updateReview}/${reviewForm.review_id}`,
          null,
          { rating: reviewForm.rating, review: reviewForm.review }
        );
      } else {
        // Create new review
        response = await apiConnector("POST", apiLinks.addReview, null, {
          rating: reviewForm.rating,
          review: reviewForm.review,
          courseId,
        });
      }

      if (response.success) {
        setIsEditingReview(false);
        toast.success(
          `Review ${
            reviewForm.review_id ? "updated" : "submitted"
          } successfully`
        );
        await fetchReviews();

        if (!reviewForm.review_id) {
          // Reset form if new review
          setReviewForm({
            rating: 5,
            review: "",
            review_id: "",
          });
        }
      }
    } catch (error) {
      console.error("Error submitting review:", error);
      toast.error("Failed to submit review");
    } finally {
      setReviewLoading(false);
    }
  };

  const handleEditReview = () => {
    setUpdateReviewForm({
      rating: reviewForm.rating,
      review: reviewForm.review,
      review_id: reviewForm.review_id,
    });
    setIsEditingReview(true);
  };

  const handleUpdateReview = async (e) => {
    e.preventDefault();

    if (!updateReviewForm.review.trim()) {
      toast.error("Please write a review");
      return;
    }

    try {
      setIsReviewUpdating(true);
      const response = await apiConnector(
        "PUT",
        `${apiLinks.updateReview}/${updateReviewForm.review_id}`,
        null,
        {
          rating: updateReviewForm.rating,
          review: updateReviewForm.review,
        }
      );

      if (response.success) {
        toast.success("Review updated successfully");
        await fetchReviews();
        setIsEditingReview(false);
      }
    } catch (error) {
      console.error("Error updating review:", error);
      toast.error("Failed to update review");
    } finally {
      setIsReviewUpdating(false);
    }
  };

  const cancelEdit = () => {
    setIsEditingReview(false);
  };

  useEffect(() => {
    fetchProgress();
    fetchReviews();
  }, [courseId]);

  const handleSubSectionClick = (sectionIndex, subSectionIndex) => {
    setActiveSection(sectionIndex);
    setActiveSubSection(subSectionIndex);
    setVideoLoading(true);

    setTimeout(() => {
      if (videoRef.current) {
        videoRef.current.load();
        videoRef.current.play().catch((error) => {
          console.error("Autoplay prevented:", error);
        });
      }
    }, 100);
  };

  const toggleSection = (sectionIndex) => {
    setOpenSections((prev) => ({
      ...prev,
      [sectionIndex]: !prev[sectionIndex],
    }));
  };

  const toggleVideoCompletion = async (subSectionId) => {
    try {
      const isCompleted = completedVideos.includes(subSectionId);
      const endpoint = isCompleted
        ? apiLinks.remove_completed
        : apiLinks.mark_completed;

      const res = await apiConnector("POST", endpoint, null, {
        courseId,
        subSectionId,
      });

      if (res.success) {
        fetchProgress();
      }
    } catch (error) {
      console.error("Error toggling video completion", error);
    }
  };

  const renderStars = (rating) => {
    return (
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <span key={star}>
            {star <= rating ? (
              <FaStar className="text-yellow-400" />
            ) : (
              <FaRegStar className="text-yellow-400" />
            )}
          </span>
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-900">
        <p className="text-xl text-white">Course not found</p>
      </div>
    );
  }

  const currentSection = course.section[activeSection];
  const currentSubSection =
    currentSection?.subSection?.[activeSubSection] || null;
  const completedCount = completedVideos.length;

  return (
    <div className={`bg-gray-950 min-h-screen py-8 text-white pt-20`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="md:w-2/3">
            {/* Video Player Section */}
            <div className="bg-black rounded-xl overflow-hidden aspect-video mb-6 shadow-2xl relative">
              {currentSubSection ? (
                <>
                  {videoLoading && (
                    <div className="absolute inset-0 flex justify-center items-center bg-gray-900 z-10">
                      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                    </div>
                  )}
                  <video
                    ref={videoRef}
                    controls
                    className="w-full h-full"
                    onLoadedData={() => setVideoLoading(false)}
                    onWaiting={() => setVideoLoading(true)}
                    onPlaying={() => setVideoLoading(false)}
                    controlsList="nodownload"
                  >
                    <source
                      src={apiLinks.streamVideo + `/${currentSubSection._id}`}
                      type="video/mp4"
                    />
                    Your browser does not support the video tag.
                  </video>
                </>
              ) : (
                <div className="flex justify-center items-center h-full bg-gray-800 text-white">
                  <p>No video available for this section</p>
                </div>
              )}
            </div>

            {/* Progress Section */}
            <div className="bg-gray-900 rounded-xl p-6 mb-6 shadow-lg border border-gray-800">
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-lg font-semibold text-blue-400">
                  Your Progress
                </h3>
                <span className="text-sm text-gray-300">
                  {completedCount}/{totalVideo} (
                  {Math.round((completedCount / totalVideo) * 100)}%)
                </span>
              </div>
              <div className="relative h-4 bg-gray-700 rounded-full overflow-hidden">
                <motion.div
                  className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-500 to-green-500 rounded-full"
                  initial={{ width: 0 }}
                  animate={{
                    width: `${
                      totalVideo > 0 ? (completedCount / totalVideo) * 100 : 0
                    }%`,
                  }}
                  transition={{ duration: 1, ease: "easeOut" }}
                />
              </div>
            </div>

            {/* Current Section Info */}
            <div className="bg-gray-900 rounded-xl shadow-lg p-6 border border-gray-800 mb-6">
              <h2 className="text-2xl font-bold mb-4 text-white">
                {currentSection?.name || "Section"}
              </h2>
              <p className="text-gray-300 text-lg">
                {currentSubSection?.description ||
                  "Select a video to get started"}
              </p>
            </div>

            {/* Review Section */}
            <div className="space-y-6">
              {/* Existing Review Display */}
              {!isEditingReview && reviewForm.review_id && (
                <div className="bg-gray-900 rounded-lg shadow-md border border-gray-800 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      {renderStars(reviewForm.rating)}
                      <span className="text-gray-300 text-sm">
                        {reviewForm.rating}.0
                      </span>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={handleEditReview}
                        className="px-3 py-1 bg-green-500 text-white rounded-md hover:bg-green-600 transition text-sm flex items-center"
                      >
                        <FaEdit className="mr-1" /> Edit
                      </button>
                      <button
                        onClick={deleteReview}
                        disabled={deleteReviewLoading}
                        className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 transition text-sm flex items-center"
                      >
                        <FaTrash className="mr-1" />
                        {deleteReviewLoading ? "Deleting..." : "Delete"}
                      </button>
                    </div>
                  </div>
                  <div className="text-gray-200">
                    <p>{reviewForm.review}</p>
                  </div>
                </div>
              )}

              {/* Edit Review Form */}
              {isEditingReview && (
                <div className="bg-gray-900 rounded-lg shadow-md border border-gray-800 p-6">
                  <form onSubmit={handleUpdateReview} className="space-y-4">
                    <div>
                      <label className="block text-md mb-2 font-medium text-gray-300">
                        Your Review
                      </label>
                      <textarea
                        placeholder="Share your thoughts..."
                        value={updateReviewForm.review}
                        onChange={handleUpdateReviewChange}
                        name="review"
                        className="w-full bg-gray-800 border border-gray-700 rounded-md p-3 text-gray-200 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                        rows="4"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-md mb-2 font-medium text-gray-300">
                        Rating
                      </label>
                      <select
                        value={updateReviewForm.rating}
                        onChange={handleUpdateReviewChange}
                        name="rating"
                        className="bg-gray-800 border border-gray-700 text-gray-200 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                        required
                      >
                        {[1, 2, 3, 4, 5].map((num) => (
                          <option key={num} value={num}>
                            {num} {num === 1 ? "star" : "stars"}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="flex space-x-3">
                      <button
                        type="submit"
                        disabled={isReviewUpdating}
                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition duration-200"
                      >
                        {isReviewUpdating ? "Updating..." : "Update Review"}
                      </button>
                      <button
                        type="button"
                        onClick={cancelEdit}
                        className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-medium py-2 px-4 rounded-md transition duration-200"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* New Review Form (only shown if user hasn't reviewed yet) */}
              {!reviewForm.review_id && (
                <div className="bg-gray-900 rounded-lg shadow-md border border-gray-800 p-6">
                  <form onSubmit={handleSubmitReview} className="space-y-4">
                    <div>
                      <label className="block text-md mb-2 font-medium text-gray-300">
                        Your Review
                      </label>
                      <textarea
                        placeholder="Share your thoughts..."
                        value={reviewForm.review}
                        onChange={handleReviewChange}
                        name="review"
                        className="w-full bg-gray-800 border border-gray-700 rounded-md p-3 text-gray-200 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                        rows="4"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-md mb-2 font-medium text-gray-300">
                        Rating
                      </label>
                      <select
                        value={reviewForm.rating}
                        onChange={handleReviewChange}
                        name="rating"
                        className="bg-gray-800 border border-gray-700 text-gray-200 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                        required
                      >
                        {[1, 2, 3, 4, 5].map((num) => (
                          <option key={num} value={num}>
                            {num} {num === 1 ? "star" : "stars"}
                          </option>
                        ))}
                      </select>
                    </div>

                    <button
                      type="submit"
                      disabled={reviewLoading}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition duration-200"
                    >
                      {reviewLoading ? "Submitting..." : "Submit Review"}
                    </button>
                  </form>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar - Course Content */}
          <div className="md:w-1/3">
            <div className="rounded-xl shadow-lg border border-gray-700 overflow-hidden">
              <div className="p-4 bg-gradient-to-r from-blue-800 to-blue-600 text-white">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-semibold">Course Content</h2>
                  <span className="text-sm bg-blue-900 px-2 py-1 rounded-full">
                    {completedCount}/{totalVideo}
                  </span>
                </div>
              </div>

              <div className="divide-y divide-gray-800 max-h-[600px] overflow-y-auto bg-gray-900">
                {course.section.map((section, sectionIndex) => {
                  const sectionCompletedCount = section.subSection.filter(
                    (sub) => completedVideos.includes(sub._id)
                  ).length;

                  return (
                    <div
                      key={section._id}
                      className="p-4 hover:bg-gray-800 transition-colors"
                    >
                      <div
                        className={`flex justify-between items-center cursor-pointer transition-all ${
                          activeSection === sectionIndex
                            ? "text-blue-400"
                            : "text-white"
                        }`}
                        onClick={() => toggleSection(sectionIndex)}
                      >
                        <h3
                          className="font-medium text-lg flex items-center"
                          onClick={() => handleSubSectionClick(sectionIndex, 0)}
                        >
                          <span className="mr-2 text-blue-400">
                            {sectionIndex + 1}.
                          </span>
                          {section.name}
                        </h3>
                        <div className="flex items-center gap-2">
                          <span className="text-xs bg-gray-700 px-2 py-1 rounded-full">
                            {sectionCompletedCount}/{section.subSection.length}
                          </span>
                          {openSections[sectionIndex] ? (
                            <IoIosArrowUp size={18} className="text-gray-400" />
                          ) : (
                            <IoIosArrowDown
                              size={18}
                              className="text-gray-400"
                            />
                          )}
                        </div>
                      </div>

                      {openSections[sectionIndex] && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3 }}
                          className="mt-2 ml-6 space-y-2"
                        >
                          {section.subSection.map(
                            (subSection, subSectionIndex) => (
                              <motion.div
                                key={subSection._id}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className={`flex items-center py-2 px-3 rounded-md cursor-pointer transition-all ${
                                  activeSection === sectionIndex &&
                                  activeSubSection === subSectionIndex
                                    ? "bg-blue-700/80 text-white shadow-md"
                                    : "hover:bg-gray-800/50 text-gray-300"
                                }`}
                                onClick={() =>
                                  handleSubSectionClick(
                                    sectionIndex,
                                    subSectionIndex
                                  )
                                }
                              >
                                <div className="flex items-center w-full">
                                  <div className="flex items-center flex-1">
                                    {completedVideos.includes(
                                      subSection._id
                                    ) ? (
                                      <FaCheck className="mr-3 text-sm text-green-400" />
                                    ) : (
                                      <FaPlay className="mr-3 text-sm text-blue-400" />
                                    )}
                                    <span
                                      className={
                                        completedVideos.includes(subSection._id)
                                          ? "line-through opacity-75"
                                          : ""
                                      }
                                    >
                                      {subSection.title}
                                    </span>
                                  </div>
                                  <div className="flex items-center ml-auto gap-2">
                                    {subSection.timeDuration && (
                                      <span className="flex items-center text-xs text-gray-400">
                                        <FaClock className="mr-1" />
                                        {subSection.timeDuration}
                                      </span>
                                    )}
                                    <input
                                      type="checkbox"
                                      checked={completedVideos.includes(
                                        subSection._id
                                      )}
                                      onChange={(e) => {
                                        e.stopPropagation();
                                        toggleVideoCompletion(subSection._id);
                                      }}
                                      className={`w-4 h-4 cursor-pointer rounded bg-gray-700 border-gray-600 focus:ring-blue-500`}
                                      onClick={(e) => e.stopPropagation()}
                                    />
                                  </div>
                                </div>
                              </motion.div>
                            )
                          )}
                        </motion.div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseCompleteViewByStudent;
