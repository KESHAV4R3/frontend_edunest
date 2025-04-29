import React, { useState, useEffect } from "react";

const ReviewSection = () => {
  const reviewData = [
    {
      url: "https://images.unsplash.com/photo-1633332755192-727a05c4013d",
      name: "Kumar Rai",
      message: "Amazing product! I loved it. Will buy again.",
      rating: 4.5,
    },
    {
      url: "https://images.unsplash.com/photo-1520813792240-56fc4a3765a7",
      name: "Aisha Singh",
      message: "Great quality, fast delivery. Highly recommended!",
      rating: 5,
    },
    {
      url: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d",
      name: "Rahul Verma",
      message: "Satisfactory experience. Could be better!",
      rating: 3.8,
    },
    {
      url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb",
      name: "Priya Sharma",
      message: "Totally worth it! Superb service.",
      rating: 4.8,
    },
    {
      url: "https://images.unsplash.com/photo-1599566150163-29194dcaad36",
      name: "Vikram Patel",
      message: "Excellent customer support and product quality.",
      rating: 4.7,
    },
    {
      url: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2",
      name: "Neha Gupta",
      message: "Very happy with my purchase. Will shop again!",
      rating: 4.9,
    },
  ];

  const createInfiniteArray = (arr, repetitions = 10) => {
    let result = [];
    for (let i = 0; i < repetitions; i++) {
      result = [...result, ...arr];
    }
    return result;
  };

  const infiniteCards = createInfiniteArray(reviewData);
  const [isPaused, setIsPaused] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [cardWidth, setCardWidth] = useState(100); // Dynamic width

  useEffect(() => {
    let interval;
    if (!isPaused) {
      interval = setInterval(() => {
        setCurrentIndex((prev) => prev + 1);
      }, 3000);
    }

    return () => clearInterval(interval);
  }, [isPaused]);

  // Update card width dynamically
  useEffect(() => {
    const updateCardWidth = () => {
      if (window.innerWidth >= 1024) {
        setCardWidth(25); // 4 cards per row
      } else if (window.innerWidth >= 768) {
        setCardWidth(33.33); // 3 cards per row
      } else if (window.innerWidth >= 640) {
        setCardWidth(50); // 2 cards per row
      } else {
        setCardWidth(100); // 1 card per row
      }
    };

    updateCardWidth();
    window.addEventListener("resize", updateCardWidth);
    return () => window.removeEventListener("resize", updateCardWidth);
  }, []);

  // Calculate the transform value
  const getTransformValue = () => {
    return `translateX(-${currentIndex * cardWidth}%)`;
  };

  return (
    <div className="relative w-full m-auto overflow-hidden py-12 px-4 sm:px-6 lg:px-8">
      <p
        className="text-white text-center font-bold text-2xl sm:text-3xl w-full mb-10"
        style={{ fontFamily: "Modern Antiqua, serif" }}
      >
        CUSTOMER REVIEW'S
      </p>
      <div className="relative max-w-7xl mx-auto overflow-hidden">
        <div
          className="flex transition-transform duration-500 ease-in-out"
          style={{
            transform: getTransformValue(),
          }}
        >
          {infiniteCards.map((review, index) => (
            <div
              key={`${review.name}-${index}`}
              className={`flex-shrink-0 px-3 w-full sm:w-1/2 md:w-1/3 lg:w-1/4 ${
                isPaused ? "hover:scale-97 transition-transform" : ""
              }`}
              onMouseEnter={() => setIsPaused(true)}
              onMouseLeave={() => setIsPaused(false)}
            >
              <div className="bg-gray-900 p-6 rounded-xl shadow-lg h-full flex flex-col cursor-pointer">
                <img
                  src={review.url}
                  alt={review.name}
                  className="w-16 h-16 rounded-full mx-auto mb-4 object-cover"
                />
                <h3 className="text-center font-semibold text-lg text-gray-100">
                  {review.name}
                </h3>
                <p className="text-center text-gray-400 mt-3 flex-grow">
                  {review.message}
                </p>
                <div className="text-center mt-4">
                  <span className="inline-flex items-center bg-dark_bg p-3 text-yellow-800 rounded-xl text-sm font-semibold">
                    ⭐ {review.rating.toFixed(1)} / 5
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ReviewSection;
