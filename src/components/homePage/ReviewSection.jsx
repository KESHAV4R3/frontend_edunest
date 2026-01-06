import React, { useState, useEffect, useCallback, useMemo, memo } from "react";
import { apiLinks } from "../../services/apiLink";
import { apiConnector } from "../../services/apiConnector";
import { Rating } from "@material-tailwind/react";
import { FaQuoteLeft } from "react-icons/fa";

const ReviewSection = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  // --- API DATA FETCHING ---
  const fetchTopReviews = useCallback(async () => {
    try {
      setLoading(true);
      const response = await apiConnector("GET", apiLinks.topReview);
      if (response?.success) {
        setReviews(response.data || []);
      }
    } catch (error) {
      console.error("Review Fetch Error:", error);
      setReviews([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTopReviews();
  }, [fetchTopReviews]);

  // --- DUPLICATE REVIEWS FOR SEAMLESS LOOP ---
  const displayReviews = useMemo(() => [...reviews, ...reviews], [reviews]);

  if (loading) {
    return (
      <div className="w-full py-32 flex flex-col items-center justify-center bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-yellow-500 mb-4 shadow-[0_0_15px_rgba(234,179,8,0.5)]"></div>
        <p className="text-gray-500 text-[10px] uppercase tracking-[0.3em] font-black animate-pulse">Loading Reviews...</p>
      </div>
    );
  }

  if (reviews.length === 0) return null;

  return (
    <div className="w-full bg-gray-900 py-24 overflow-hidden border-t border-gray-800">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 mb-16 text-center">
        <h2 className="text-3xl md:text-4xl font-black text-gray-100 tracking-tight uppercase">
          VOICE OF THE <span className="text-red-600 ml-2">COMMUNITY</span>
        </h2>
        <p className="text-gray-500 text-sm sm:text-base md:text-[18px] font-black tracking-[0.1em] mt-2">
          Verified performance metrics from global learners
        </p>
      </div>

      {/* --- SCROLLING MARQUEE CONTAINER --- */}
      <div className="relative flex overflow-hidden group">
        <div 
          className="flex gap-4 sm:gap-6 md:gap-8 animate-marquee whitespace-nowrap group-hover:animate-none px-4 sm:px-6"
          onMouseEnter={e => e.currentTarget.style.animationPlayState = 'paused'}
          onMouseLeave={e => e.currentTarget.style.animationPlayState = 'running'}
        >
          {displayReviews.map((review, index) => (
            <div
              key={`${review._id}-${index}`}
              className="flex-shrink-0 w-[280px] h-[200px] sm:w-[320px] md:w-[380px] bg-gray-800 border border-gray-700 p-4 sm:p-6 md:p-8 rounded-xl md:rounded-2xl shadow-xl relative transition-all duration-300 hover:border-yellow-500/50 hover:bg-gray-800/80 flex flex-col"
            >
              <FaQuoteLeft className="absolute top-3 right-4 sm:top-4 sm:right-6 text-gray-700 group-hover:text-yellow-500/20 text-2xl sm:text-3xl md:text-4xl transition-colors" />
              
              <div className="flex items-center gap-3 sm:gap-4 md:gap-5 mb-2 sm:mb-3 flex-shrink-0">
                <img
                  src={review?.user?.image}
                  alt="User"
                  className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-full object-cover border-2 border-yellow-500 shadow-lg shadow-yellow-900/30"
                  loading="lazy"
                />
                <div className="flex flex-col">
                  <h3 className="font-bold text-gray-100 text-xs sm:text-xs md:text-sm uppercase tracking-tight truncate max-w-[120px] sm:max-w-[140px] md:max-w-[160px]">
                    {review?.user?.firstName} {review?.user?.lastName}
                  </h3>
                  <div className="flex items-center gap-1 mt-0.5">
                    <Rating
                      value={review?.rating || 5}
                      readonly
                      ratedColor="yellow"
                      className="text-yellow-500 scale-[0.55] sm:scale-[0.6] md:scale-[0.65] -ml-2.5 sm:-ml-3 md:-ml-3.5"
                    />
                  </div>
                </div>
              </div>

              {/* Scrollable Review Message - Fixed height for 200px card */}
              <div className="flex-grow overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-800/50 mb-2">
                <p className="text-gray-400 text-xs leading-relaxed whitespace-normal italic line-clamp-4 sm:line-clamp-5">
                  "{review?.review}"
                </p>
              </div>

              <div className="pt-2 border-t border-gray-700/50 flex justify-between items-center flex-shrink-0">
                <span className="text-xs text-gray-500 font-normal">
                  secure enrollment
                </span>
                <span className="text-xs text-yellow-500 font-medium truncate max-w-[100px] sm:max-w-[120px] md:max-w-[140px]">
                  {review?.course?.name || "Premium Course"}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* --- INLINE CSS FOR SEAMLESS ANIMATION --- */}
      <style jsx>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 40s linear infinite;
          animation-play-state: running;
        }
        .animate-marquee:hover {
          animation-play-state: paused;
        }
        
        /* Custom scrollbar styles */
        .scrollbar-thin::-webkit-scrollbar {
          width: 3px;
        }
        .scrollbar-thin::-webkit-scrollbar-track {
          background: rgba(31, 41, 55, 0.5);
          border-radius: 10px;
        }
        .scrollbar-thin::-webkit-scrollbar-thumb {
          background: #374151;
          border-radius: 10px;
        }
        .scrollbar-thin::-webkit-scrollbar-thumb:hover {
          background: #4B5563;
        }
        
        /* Line clamp for text truncation */
        .line-clamp-4 {
          display: -webkit-box;
          -webkit-line-clamp: 4;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        
        @media (min-width: 640px) {
          .line-clamp-5 {
            display: -webkit-box;
            -webkit-line-clamp: 5;
            -webkit-box-orient: vertical;
            overflow: hidden;
          }
        }
      `}</style>
    </div>
  );
};

export default memo(ReviewSection);