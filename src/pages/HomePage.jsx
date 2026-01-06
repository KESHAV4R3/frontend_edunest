import React, { lazy, Suspense, memo } from "react";
import HeroSection from "../components/homePage/HeroSection";

// Lazy loaded components for optimized bundle size
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

// Card Variants preserved as requested
const cardVariants = {
  offscreen: { y: 100, opacity: 0, scale: 0.95 },
  onscreen: {
    y: 0,
    opacity: 1,
    scale: 1,
    transition: { type: "spring", bounce: 0.4, duration: 1 },
  },
};

const HomePage = () => {
  return (
    <div className="bg-gray-900 w-full min-h-screen selection:bg-red-600/30">
      <div className="max-w-[1500px] min-w-[320px] mx-auto overflow-hidden">
        
        <HeroSection />

        <Suspense
          fallback={
            <div className="w-full py-40 flex flex-col items-center justify-center bg-gray-900">
              {/* Signature Red Glowing Spinner */}
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-red-600 mb-6 shadow-[0_0_15px_rgba(220,38,38,0.5)]"></div>
              <p className="text-gray-500 text-[10px] uppercase tracking-[0.3em] animate-pulse font-black">
                Assembling Content...
              </p>
            </div>
          }
        >
          <div className="flex flex-col">
            <BenefitSection />
            <InstructorSection />
            <ReviewSection />
            <Footer />
          </div>
        </Suspense>
      </div>
    </div>
  );
};

// Memoized to prevent parent re-renders from affecting the home structure
export default memo(HomePage);