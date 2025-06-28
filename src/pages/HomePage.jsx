import React, { lazy, Suspense } from "react";
import HeroSection from "../components/homePage/HeroSection";

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
const Footer = lazy(() => import("../components/application/Footer"));

// Optional: Animation config (if using Framer Motion)
const cardVariants = {
  offscreen: {
    y: 100,
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
      duration: 1,
    },
  },
};

const HomePage = () => {
  return (
    <div className="max-w-[1500px] min-w-[370px] m-auto">
      {/* Eager loaded section */}
      <HeroSection />

      {/* Lazy loaded sections */}
      <Suspense
        fallback={
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        }
      >
        <BenefitSection />
        <InstructorSection />
        <ReviewSection />
        <Footer />
      </Suspense>
    </div>
  );
};

export default HomePage;
