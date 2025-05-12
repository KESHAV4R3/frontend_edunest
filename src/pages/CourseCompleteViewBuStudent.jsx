import React, { useEffect, useState, useRef } from "react";
import { apiLinks } from "../services/apiLink";
import { apiConnector } from "../services/apiConnector";
import { useLocation } from "react-router-dom";
import { FaPlay, FaClock } from "react-icons/fa";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";

const CourseCompleteViewByStudent = () => {
  const location = useLocation();
  const courseId = location.pathname.split("/").at(-1);
  const [loading, setLoading] = useState(true);
  const [course, setCourse] = useState(null);
  const [activeSection, setActiveSection] = useState(0);
  const [activeSubSection, setActiveSubSection] = useState(0);
  const [videoLoading, setVideoLoading] = useState(true);
  const [openSections, setOpenSections] = useState({});
  const videoRef = useRef(null);

  // Comment-related states
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(1);
  const [commentError, setCommentError] = useState("");
  const [submitSuccess, setSubmitSuccess] = useState(false);

  useEffect(() => {
    async function fetchCourseDetail() {
      try {
        setLoading(true);
        const url = apiLinks.getCourseById + `/${courseId}`;
        const response = await apiConnector("GET", url);

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

  const handleCommentSubmit = (e) => {
    e.preventDefault();

    if (comment.length > 80) {
      setCommentError("Comment should not exceed 80 characters.");
      return;
    }

    if (rating < 1 || rating > 5) {
      setCommentError("Rating must be between 1 and 5.");
      return;
    }

    // Simulate submit
    console.log("Comment submitted:", { comment, rating });

    // Reset form and show success message
    setComment("");
    setRating(1);
    setCommentError("");
    setSubmitSuccess(true);

    // Hide success message after 3s
    setTimeout(() => setSubmitSuccess(false), 3000);
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

  return (
    <div className="bg-gray-950 min-h-screen py-8 text-white pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Video Section */}
          <div className="md:w-2/3">
            <div className="bg-black rounded-lg overflow-hidden aspect-video mb-4 shadow-xl">
              {currentSubSection ? (
                <>
                  {videoLoading && (
                    <div className="flex justify-center items-center h-full">
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

            <div className="bg-gray-900 rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold mb-4 text-white">
                {currentSection?.name || "Section"}
              </h2>
              <p className="text-gray-300 text-lg">
                {currentSubSection?.description ||
                  "Select a video to get started"}
              </p>
            </div>
            {/* Comment Form */}
            <div className="mt-6 bg-gray-800 p-6 rounded-md shadow-lg">
              <h3 className="text-xl font-semibold mb-2 text-white">
                Leave a Comment
              </h3>
              {submitSuccess && (
                <p className="text-green-400 text-sm mb-2">
                  Comment submitted successfully!
                </p>
              )}
              <form onSubmit={handleCommentSubmit}>
                <textarea
                  className="w-full p-3 rounded-md bg-gray-900 text-white border border-gray-600 focus:outline-none"
                  rows="4"
                  placeholder="Write your comment..."
                  maxLength={80}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                ></textarea>

                <div className="mt-4 flex items-center gap-6">
                  <label htmlFor="rating" className="text-sm text-gray-300">
                    Rating:
                  </label>
                  <select
                    id="rating"
                    className="bg-gray-900 text-white border border-gray-600 p-2 rounded-md"
                    value={rating}
                    onChange={(e) => setRating(Number(e.target.value))}
                  >
                    {[1, 2, 3, 4, 5].map((num) => (
                      <option key={num} value={num}>
                        {num}
                      </option>
                    ))}
                  </select>
                  <button
                    type="submit"
                    className="ml-auto bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded-md text-sm transition-colors"
                  >
                    Submit
                  </button>
                </div>
                {commentError && (
                  <p className="text-red-400 text-sm mt-2">{commentError}</p>
                )}
              </form>
            </div>
          </div>

          {/* Course Section Navigation */}
          <div className="md:w-1/3">
            <div className="rounded-lg shadow-md border border-gray-700">
              <div className="p-4 bg-blue-800 text-white rounded-t-lg">
                <h2 className="text-xl font-semibold">Course Content</h2>
              </div>

              <div className="divide-y divide-gray-800 max-h-[600px] overflow-y-auto bg-gray-900">
                {course.section.map((section, sectionIndex) => (
                  <div key={section._id} className="p-4">
                    <div
                      className={`flex justify-between items-center cursor-pointer transition-all ${
                        activeSection === sectionIndex
                          ? "text-blue-400"
                          : "text-white"
                      }`}
                      onClick={() => {
                        toggleSection(sectionIndex);
                      }}
                    >
                      <h3
                        className="font-medium text-lg"
                        onClick={() => {
                          handleSubSectionClick(sectionIndex, 0);
                        }}
                      >
                        {section.name}
                      </h3>
                      <div className="flex items-center gap-2 text-sm text-gray-400">
                        <span>{section.subSection.length} videos</span>
                        {openSections[sectionIndex] ? (
                          <IoIosArrowUp size={20} />
                        ) : (
                          <IoIosArrowDown size={20} />
                        )}
                      </div>
                    </div>

                    {openSections[sectionIndex] && (
                      <div className="mt-2 ml-4 space-y-2">
                        {section.subSection.map(
                          (subSection, subSectionIndex) => (
                            <div
                              key={subSection._id}
                              className={`flex items-center py-2 px-3 rounded-md cursor-pointer transition-all ${
                                activeSection === sectionIndex &&
                                activeSubSection === subSectionIndex
                                  ? "bg-blue-700 text-white"
                                  : "hover:bg-gray-800 text-gray-300"
                              }`}
                              onClick={() =>
                                handleSubSectionClick(
                                  sectionIndex,
                                  subSectionIndex
                                )
                              }
                            >
                              <FaPlay className="mr-2 text-xs" />
                              <span className="flex-1">{subSection.title}</span>
                              {subSection.timeDuration && (
                                <span className="ml-auto flex items-center text-xs text-gray-400">
                                  <FaClock className="mr-1" />
                                  {subSection.timeDuration}
                                </span>
                              )}
                            </div>
                          )
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseCompleteViewByStudent;
