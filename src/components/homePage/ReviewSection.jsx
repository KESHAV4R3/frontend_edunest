import { apiLinks } from "../../services/apiLink";
import { apiConnector } from "../../services/apiConnector";
import React, { useState, useEffect, useRef, useCallback } from "react";
import { Rating } from "@material-tailwind/react";

const ReviewSection = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const containerRef = useRef(null);
  const scrollInterval = useRef(null);
  const scrollPositionRef = useRef(0);
  const directionRef = useRef(1); // 1 for right, -1 for left
  const resetThresholdRef = useRef(100); // Distance from end to reset

  // get all the ratings
  useEffect(() => {
    const fetchReviewData = async () => {
      try {
        const url = apiLinks.getAllRatings;
        const response = await apiConnector("get", url);
        if (response.success) {
          setReviews(response.data);
        }
      } catch (error) {
        console.error("Error fetching reviews:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchReviewData();
  }, []);

  // Improved auto-scroll effect with seamless looping
  const startScrolling = useCallback(() => {
    if (!containerRef.current || reviews.length <= 1) return;

    const container = containerRef.current;
    const maxScroll = container.scrollWidth - container.clientWidth;
    const scrollSpeed = 0.25; // Very slow speed

    scrollPositionRef.current += scrollSpeed * directionRef.current;

    // When reaching near the end (with small threshold)
    if (
      scrollPositionRef.current >= maxScroll - 50 &&
      directionRef.current === 1
    ) {
      // Instead of resetting abruptly, we'll:
      // 1. Continue scrolling to the exact end
      scrollPositionRef.current = maxScroll;
      container.scrollLeft = scrollPositionRef.current;

      // 2. Wait a brief moment at the end (500ms)
      setTimeout(() => {
        // 3. Smoothly transition back to start
        const smoothReset = () => {
          scrollPositionRef.current = Math.max(
            scrollPositionRef.current - 0.8,
            0
          );
          container.scrollLeft = scrollPositionRef.current;

          if (scrollPositionRef.current > 0) {
            requestAnimationFrame(smoothReset);
          } else {
            // Restart normal scrolling
            scrollInterval.current = requestAnimationFrame(startScrolling);
          }
        };
        cancelAnimationFrame(scrollInterval.current);
        smoothReset();
      }, 500);
      return;
    }

    container.scrollLeft = scrollPositionRef.current;
    scrollInterval.current = requestAnimationFrame(startScrolling);
  }, [reviews]);

  useEffect(() => {
    if (reviews.length <= 1) return;

    const container = containerRef.current;
    if (!container) return;

    let isPaused = false;
    let isResetting = false;

    const scrollLoop = () => {
      if (!isPaused && !isResetting) {
        startScrolling();
      }
    };

    // Pause on hover
    const pauseScroll = () => {
      isPaused = true;
      cancelAnimationFrame(scrollInterval.current);
    };

    const resumeScroll = () => {
      isPaused = false;
      if (!isResetting) {
        scrollInterval.current = requestAnimationFrame(scrollLoop);
      }
    };

    container.addEventListener("mouseenter", pauseScroll);
    container.addEventListener("mouseleave", resumeScroll);

    // Start initial scrolling
    scrollInterval.current = requestAnimationFrame(scrollLoop);

    return () => {
      cancelAnimationFrame(scrollInterval.current);
      container.removeEventListener("mouseenter", pauseScroll);
      container.removeEventListener("mouseleave", resumeScroll);
    };
  }, [reviews, startScrolling]);
  if (loading) {
    return (
      <div className="text-center py-8 dark:text-gray-300">
        Loading reviews...
      </div>
    );
  }

  if (reviews.length === 0) {
    return (
      <div className="text-center py-8 dark:text-gray-300">No reviews yet.</div>
    );
  }

  return (
    <div className="max-w-9xl mx-auto px-4 py-12 ">
      <h2 className="text-3xl font-bold text-center mb-12 dark:text-white">
        Student Reviews
      </h2>

      <div
        ref={containerRef}
        className="flex overflow-x-hidden scroll-smooth gap-6 py-4 px-2 hide-scrollbar"
      >
        {reviews.map((review) => (
          <div
            key={review._id}
            className="flex-shrink-0 w-80 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
          >
            <div className="flex items-center mb-4">
              <img
                src={review.user.image}
                alt={`${review.user.firstName} ${review.user.lastName}`}
                className="w-12 h-12 rounded-full object-cover mr-4 ring-2 ring-blue-500 dark:ring-blue-400"
              />
              <div>
                <h3 className="font-semibold text-lg dark:text-white">
                  {review.user.firstName} {review.user.lastName}
                </h3>
                <Rating
                  value={review.rating}
                  readonly
                  className="dark:text-yellow-400"
                />
              </div>
            </div>
            <div className="mt-2 text-gray-600 dark:text-gray-400 text-sm">
              {new Date(review.lastUpdated).toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
              })}
            </div>
            <p className="mt-3 text-gray-700 dark:text-gray-300">
              {review.review}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default React.memo(ReviewSection);
