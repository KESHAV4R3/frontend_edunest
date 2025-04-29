import React from "react";
import HeroSection from "../components/homePage/HeroSection";
import BenefitSection from "../components/homePage/BenefitSection";
import InstructorSection from "../components/homePage/InstructorSection";
import ReviewSection from "../components/homePage/ReviewSection";
import Footer from "../components/application/Footer";

const HomePage = () => {
  return (
    <div className="max-w-[1500px] min-w-[390px] m-auto">
      <HeroSection />
      <BenefitSection />
      <InstructorSection />
      <ReviewSection />
      <Footer />
    </div>
  );
};

export default HomePage;
