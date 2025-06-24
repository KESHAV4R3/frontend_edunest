import React, { lazy, Suspense } from "react";
import HeroSection from "../components/homePage/HeroSection";
import Footer from "../components/application/Footer";
import { motion } from "framer-motion";

// Lazy loaded components
const BenefitSection = lazy(() =>
  import("../components/homePage/BenefitSection")
);
const InstructorSection = lazy(() =>
  import("../components/homePage/InstructorSection")
);
const ReviewSection = lazy(() =>
  import("../components/homePage/ReviewSection")
);

// More pronounced animation variants
const cardVariants = {
  offscreen: {
    y: 100, // Increased from 50 to make more noticeable
    opacity: 0,
    scale: 0.95,
  },
  onscreen: {
    y: 0,
    opacity: 1,
    scale: 1,
    transition: {
      type: "spring",
      bounce: 0.4,
      duration: 1, // Increased duration
    },
  },
};

const HomePage = () => {
  return (
    <div className="max-w-[1500px] min-w-[370px] m-auto">
      <HeroSection />

      <Suspense
        fallback={
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        }
      >
        {/* Section 1 - Made animations more obvious */}
        <motion.div
          initial="offscreen"
          whileInView="onscreen"
          viewport={{ once: false, amount: 0.2 }} // Changed to false for testing
          variants={cardVariants}
          className="mb-20 min-h-[50vh] bg-gray-100 p-8 rounded-xl" // Added bg and min-height for visibility
        >
          <BenefitSection />
        </motion.div>

        {/* Section 2 */}
        <motion.div
          initial="offscreen"
          whileInView="onscreen"
          viewport={{ once: false, amount: 0.2 }}
          variants={cardVariants}
          className="mb-20 min-h-[50vh] bg-gray-800 p-1 rounded-xl"
        >
          <InstructorSection />
        </motion.div>

        {/* Section 3 */}
        <motion.div
          initial="offscreen"
          whileInView="onscreen"
          viewport={{ once: false, amount: 0.2 }}
          variants={cardVariants}
          className="mb-20 min-h-[50vh] bg-gray-900 p-8 rounded-xl"
        >
          <ReviewSection />
        </motion.div>
      </Suspense>

      <Footer />
    </div>
  );
};

export default HomePage;
