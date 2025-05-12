import React, { useState, useEffect, useMemo } from "react";
import ContactForm from "../components/aboutUsPage/ContactForm";
import Footer from "../components/application/Footer";
import { useNavigate } from "react-router-dom";
import ReviewSection from "../components/homePage/ReviewSection";

// Memoize static data to prevent recreation on every render
const STATIC_DATA = {
  images: [
    {
      url: "https://res.cloudinary.com/dort5nnis/image/upload/v1741757554/img1_utd6w0.jpg",
      alt: "Stay Consistent with us",
    },
    {
      url: "https://res.cloudinary.com/dort5nnis/image/upload/v1741757594/customer-service-handsome-man-grey-suit-with-computer-headset-writing-down-notes_i6y4gn.jpg",
      alt: "Expert Faculties",
    },
    {
      url: "https://res.cloudinary.com/dort5nnis/image/upload/v1741757676/digital-tablet-screen-smart-tech_rgct3z.jpg",
      alt: "Track yourself for better results",
    },
  ],
  statsTargets: [50, 10, 300, 500],
  statsLabels: ["Courses", "Years Experience", "Instructors", "Students"],
};

const AboutUsPage = () => { 
  const navigate = useNavigate();
  const [loadedImages, setLoadedImages] = useState([]);
  const [stats, setStats] = useState(
    STATIC_DATA.statsLabels.map((label) => ({ number: "0", label }))
  );
  const [loading, setLoading] = useState(true);

  // Memoize expensive calculations
  const memoizedImages = useMemo(() => STATIC_DATA.images, []);

  const handleImageLoad = (index) => {
    setLoadedImages((prev) => [...prev, index]);
  };

  // Optimized stats animation with requestAnimationFrame
  const animateStats = () => {
    const startTime = performance.now();
    const duration = 1500; // Reduced from 2000ms for faster loading

    const animate = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      setStats((prev) =>
        prev.map((stat, i) => ({
          ...stat,
          number: Math.floor(progress * STATIC_DATA.statsTargets[i]).toString(),
        }))
      );

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  };

  // Load data with minimal delay
  useEffect(() => {
    const loadData = async () => {
      // Start stats animation immediately
      animateStats();

      setLoading(false);
    };

    loadData();

    return () => {
      // Cleanup if needed
    };
  }, []);

  // Skeleton Loading Components - memoized
  const SkeletonText = React.memo(({ lines = 1, width = "full" }) => {
    return (
      <div className="space-y-2">
        {Array.from({ length: lines }).map((_, i) => (
          <div
            key={i}
            className={`h-4 bg-gray-700 rounded animate-pulse w-${width}`}
          ></div>
        ))}
      </div>
    );
  });

  const SkeletonImageCard = React.memo(() => (
    <div className="relative group overflow-hidden rounded-xl cursor-pointer shadow-xl min-h-[200px] sm:min-h-[320px] bg-gray-700 animate-pulse">
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-12 h-12 rounded-full bg-gray-600"></div>
      </div>
    </div>
  ));

  const SkeletonStatCard = React.memo(() => (
    <div className="bg-gray-900/50 p-4 rounded-lg text-center">
      <div className="h-10 bg-gray-700 rounded animate-pulse mb-2 w-3/4 mx-auto"></div>
      <div className="h-6 bg-gray-700 rounded animate-pulse w-1/2 mx-auto"></div>
    </div>
  ));

  if (loading) {
    return (
      <div className="w-full bg-dark_bg text-white py-12 px-4 sm:px-6 lg:px-10 min-h-screen">
        {/* Optimized skeleton loading with fewer elements */}
        <section className="text-center max-w-4xl mx-auto mb-16">
          <div className="h-12 bg-gray-700 rounded animate-pulse w-3/4 mx-auto mb-4"></div>
          <div className="w-24 h-1 bg-gray-700 rounded-full mx-auto mt-6"></div>
        </section>

        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8 mb-16">
          {[1, 2, 3].map((_, index) => (
            <SkeletonImageCard key={index} />
          ))}
        </section>

        <section className="max-w-5xl mx-auto mb-16 px-4 grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2].map((_, index) => (
            <div
              key={index}
              className="bg-gray-800/50 p-6 rounded-xl border-t-4 border-gray-700"
            >
              <SkeletonText lines={4} width="full" />
            </div>
          ))}
        </section>

        <section className="max-w-5xl mx-auto mb-16 px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((_, index) => (
              <SkeletonStatCard key={index} />
            ))}
          </div>
        </section>

        <div className="h-20 bg-gray-900 mt-16"></div>
      </div>
    );
  }

  return (
    <div className="w-full bg-dark_bg text-white py-12 mt-10 px-4 sm:px-6 lg:px-10 min-h-screen">
      {/* Header Section */}
      <section className="text-center max-w-4xl mx-auto mb-16 animate-fade-in">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 leading-tight">
          Driving Innovation in Online Education for a Brighter Future
        </h1>
        <div className="w-24 h-1 bg-gradient-to-r from-blue-400 to-purple-500 mx-auto mt-6 rounded-full"></div>
      </section>

      {/* Image Grid with Intersection Observer for lazy loading */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8 mb-16">
        {memoizedImages.map((value, index) => (
          <LazyImageCard
            key={index}
            index={index}
            value={value}
            loadedImages={loadedImages}
            onLoad={handleImageLoad}
          />
        ))}
      </section>

      {/* Introduction Section */}
      <section className="text-center max-w-4xl mx-auto mb-16 px-4">
        <p className="text-gray-300 text-lg md:text-xl leading-relaxed">
          We are passionate about revolutionizing the way we learn. Our
          innovative platform combines{" "}
          <span className="text-blue-400 font-medium">
            technology, expertise,
          </span>{" "}
          and community to create an{" "}
          <span className="text-blue-400 font-medium">
            engaging and educational experience
          </span>{" "}
          that adapts to your learning style.
        </p>
      </section>

      {/* Founding Story */}
      <FoundingStorySection />

      {/* Vision and Mission Section */}
      <VisionMissionSection />

      {/* Statistics Section */}
      <section className="max-w-5xl mx-auto mb-16 px-4">
        <div className="bg-gray-800/50 p-6 rounded-xl shadow-lg">
          <h2 className="text-2xl font-bold text-center text-white mb-8">
            Our Impact in Numbers
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="bg-gray-900/50 p-4 rounded-lg text-center hover:bg-gray-800 transition-colors"
              >
                <h3 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 mb-2">
                  {stat.number}+
                </h3>
                <p className="text-gray-300 text-lg">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section className="max-w-3xl mx-auto mb-16 px-4 border-gray-600 border p-10 rounded-lg">
        <ContactForm />
      </section>

      {/* CTA Section */}
      <CTASection navigate={navigate} />

      {/* Review Section */}
      <ReviewSection />

      {/* Footer */}
      <Footer />
    </div>
  );
};

// Extracted components for better readability and performance
const LazyImageCard = React.memo(({ index, value, loadedImages, onLoad }) => (
  <div className="relative group overflow-hidden rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 min-h-[200px] sm:min-h-[320px]">
    {!loadedImages.includes(index) && (
      <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-800 z-10">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-600"></div>
        <p className="mt-3 text-gray-600 text-sm">Loading image...</p>
      </div>
    )}
    <img
      src={value.url}
      alt={value.alt}
      className={`w-full h-60 sm:h-80 object-cover transition-all duration-500 ${
        loadedImages.includes(index)
          ? "opacity-100 scale-100"
          : "opacity-0 scale-95"
      } group-hover:scale-105`}
      onLoad={() => onLoad(index)}
      loading="lazy"
      decoding="async"
    />
    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
      <span className="text-white text-lg font-medium translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
        {value.alt}
      </span>
    </div>
  </div>
));

const FoundingStorySection = React.memo(() => (
  <section className="max-w-5xl mx-auto mb-16 px-4">
    <div className="bg-gray-800/50 p-6 sm:p-8 rounded-xl border-l-4 border-red-400 shadow-lg">
      <h2 className="text-2xl sm:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-orange-400 mb-4">
        Our Founding Story
      </h2>
      <div className="space-y-4 text-gray-300 text-lg">
        <p>
          Founded in 2015, we started as a small team of educators and
          technologists who believed learning should be accessible, engaging,
          and effective for everyone.
        </p>
        <p>
          What began as a passion project has grown into a platform serving
          thousands of learners worldwide, with innovative features that make
          education more interactive and personalized than ever before.
        </p>
      </div>
    </div>
  </section>
));

const VisionMissionSection = React.memo(() => (
  <section className="max-w-5xl mx-auto mb-16 px-4">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <VisionCard />
      <MissionCard />
    </div>
  </section>
));

const VisionCard = React.memo(() => (
  <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-6 rounded-xl border-t-4 border-yellow-400 shadow-lg hover:shadow-xl transition-shadow">
    <div className="flex items-center mb-4">
      <div className="w-10 h-10 rounded-full bg-yellow-400/20 flex items-center justify-center mr-4">
        <svg
          className="w-6 h-6 text-yellow-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
          ></path>
        </svg>
      </div>
      <h2 className="text-xl font-bold text-yellow-400">Our Vision</h2>
    </div>
    <p className="text-gray-300 text-lg">
      To create a world where high-quality education is accessible to anyone,
      anywhere, breaking down barriers and unlocking human potential through
      innovative learning solutions.
    </p>
  </div>
));

const MissionCard = React.memo(() => (
  <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-6 rounded-xl border-t-4 border-green-400 shadow-lg hover:shadow-xl transition-shadow">
    <div className="flex items-center mb-4">
      <div className="w-10 h-10 rounded-full bg-green-400/20 flex items-center justify-center mr-4">
        <svg
          className="w-6 h-6 text-green-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M13 10V3L4 14h7v7l9-11h-7z"
          ></path>
        </svg>
      </div>
      <h2 className="text-xl font-bold text-green-400">Our Mission</h2>
    </div>
    <p className="text-gray-300 text-lg">
      To empower learners of all ages and backgrounds through technology-driven
      education, expert guidance, and a supportive community that fosters
      continuous growth and achievement.
    </p>
  </div>
));

const CTASection = React.memo(({ navigate }) => (
  <section className="max-w-3xl mx-auto px-4 mb-10">
    <div className="bg-gradient-to-r from-purple-900/50 to-blue-900/50 p-8 rounded-xl shadow-2xl text-center border border-gray-700">
      <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
        Ready to Start Your Learning Journey?
      </h2>
      <p className="text-gray-300 mb-6 text-lg">
        Join thousands of learners who are transforming their lives through
        education.
      </p>
      <button
        onClick={() => navigate("/register")}
        className="px-8 py-3 bg-gradient-to-r from-yellow-400 to-yellow-500 text-black font-semibold rounded-lg hover:from-yellow-500 hover:to-yellow-600 transition-all text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 duration-300"
      >
        Start Learning Today
      </button>
    </div>
  </section>
));

export default AboutUsPage;
