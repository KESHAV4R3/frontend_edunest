import React, { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { useSelector } from "react-redux"; // Added to get user role
import {
  data,
  dataList,
  para1_1,
  para1_2,
  para2_1,
  para2_2,
  para3_1,
  para3_2,
  para4_1,
  para4_2,
} from "../../data/heroSectionCategoryData";
import { FaArrowRight, FaChartLine, FaShieldAlt } from "react-icons/fa";
import { TbHierarchy3 } from "react-icons/tb";
import { HiMiniUsers } from "react-icons/hi2";
import Paragraph_2 from "./Paragraph_2";
import Paragraph_1 from "./Paragraph_1";
import Button from "../application/Button";
import { useNavigate } from "react-router-dom";
import CodeAnimation from "./CodeAnimation";
import CodeAnimations2 from "./CodeAnimations2";
import { motion, AnimatePresence } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { LazyLoadComponent } from "react-lazy-load-image-component";
import CourseDisplay from "./CourseDisplay";

// Memoized components
const MemoizedParagraph1 = React.memo(Paragraph_1);
const MemoizedParagraph2 = React.memo(Paragraph_2);
const MemoizedButton = React.memo(Button);

// Variants (kept outside for performance)
const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1 } } };
const itemVariants = { hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1, transition: { duration: 0.5 } } };
const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
  hover: { scale: 1.03, transition: { duration: 0.3 } },
  exit: { opacity: 0, scale: 0.95, transition: { duration: 0.2 } }
};

const HeroSection = () => {
  const navigate = useNavigate();
  
  // 1. Get User Role from Redux
  const { user } = useSelector((state) => state.profile);
  const accountType = user?.accountType || "Guest";

  // 2. Role-Based Configuration Object
  const roleConfig = useMemo(() => {
    switch (accountType) {
      case "Admin":
        return {
          topBtn: "Platform Control Center",
          topBtnPath: "/dashboard",
          topBtnIcon: <FaShieldAlt />,
          mainTitle: ["System", "Infrastructure"],
          mainDesc: "Oversee global curriculum deployments and manage platform security protocols.",
          cta1: "Manage Users",
          cta1Path: "/dashboard/student-see-all",
          cta2: "View Logs"
        };
      case "Instructor":
        return {
          topBtn: "Instructor Dashboard",
          topBtnPath: "/dashboard/Analytics",
          topBtnIcon: <FaChartLine />,
          mainTitle: ["Knowledge", "Monetization"],
          mainDesc: "Scale your teaching impact. Manage your courses and track revenue growth.",
          cta1: "Create Course",
          cta1Path: "/dashboard/Analytics",
          cta2: "Earnings"
        };
      default: // Student / Guest
        return {
          topBtn: "Become an Instructor",
          topBtnPath: "/register",
          topBtnIcon: <FaArrowRight />,
          mainTitle: para1_1,
          mainDesc: para1_2,
          cta1: "Explore Courses",
          cta1Path: "/dashboard/courses",
          cta2: "Learn More"
        };
    }
  }, [accountType]);

  const [currentCategory, setCurrentCategory] = useState(dataList[0]);
  const [currentData, setCurrentData] = useState(data[0]);
  const [isAnimating, setIsAnimating] = useState(false);
  const videoRef = useRef(null);

  const [section1Ref, section1InView] = useInView({ triggerOnce: true, threshold: 0.1 });
  const [section2Ref, section2InView] = useInView({ triggerOnce: true, threshold: 0.1 });
  const [section3Ref, section3InView] = useInView({ triggerOnce: true, threshold: 0.1 });

  const updateDataCategory = useCallback((index) => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentCategory(dataList[index]);
    setTimeout(() => {
      setCurrentData(data[index]);
      setIsAnimating(false);
    }, 200);
  }, [isAnimating]);

  const renderCategoryButtons = useMemo(() =>
    dataList.map((value, index) => (
      <motion.button
        key={index}
        className={`m-auto text-sm w-[150px] h-[45px] font-black uppercase tracking-widest text-center text-white cursor-pointer rounded-xl flex justify-center items-center border-2 transition-all 
          ${value === currentCategory ? "bg-red-600 border-red-500 shadow-lg shadow-red-900/40" : "bg-gray-800 border-gray-700 hover:border-red-600"}`}
        onClick={() => updateDataCategory(index)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        disabled={isAnimating}
      >
        {value}
      </motion.button>
    )),
    [currentCategory, updateDataCategory, isAnimating]
  );

  const renderDataCards = useMemo(() => (
    <div className="mt-16 w-full flex justify-center items-center gap-8 flex-wrap relative">
      <AnimatePresence mode="wait">
        {currentData.map((value, index) => (
          <motion.div
            key={`${currentCategory}-${index}`}
            className="bg-gray-800 border border-gray-700 w-full min-h-[250px] max-w-[320px] p-6 rounded-2xl cursor-pointer group hover:border-red-600 transition-all shadow-2xl"
            variants={cardVariants}
            initial="hidden" animate="visible" exit="exit" whileHover="hover"
          >
            <p className="text-[10px] text-red-500 font-black uppercase tracking-widest mb-2">Module {index + 1}</p>
            <p className="text-white font-bold text-xl uppercase tracking-tight">{value.title}</p>
            <p className="text-gray-400 mt-4 text-sm leading-relaxed">{value.data}</p>

            <div className="flex justify-between items-center w-full border-t border-gray-700 mt-6 pt-4">
              <div className="flex items-center gap-2 text-gray-500 group-hover:text-red-500 transition-colors">
                <HiMiniUsers size={14} />
                <span className="text-[10px] font-black uppercase">Active</span>
              </div>
              <div className="flex items-center gap-2 text-gray-500 group-hover:text-red-500 transition-colors">
                <TbHierarchy3 size={14} />
                <span className="text-[10px] font-black uppercase">Syllabus</span>
              </div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  ), [currentData, currentCategory]);

  return (
    <div className="w-full max-w-[1400px] m-auto bg-gray-900 pt-20 flex flex-col items-center gap-7 justify-center overflow-hidden">
      
      {/* 3. DYNAMIC TOP BUTTON */}
      <motion.button
        initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }}
        onClick={() => navigate(roleConfig.topBtnPath)}
        className="flex items-center gap-3 text-sm font-black uppercase text-gray-300 border border-gray-700 rounded-full bg-gray-800/50 px-6 py-3 hover:bg-red-600 hover:text-white transition-all shadow-xl"
      >
        {roleConfig.topBtn} {roleConfig.topBtnIcon}
      </motion.button>

      {/* 4. DYNAMIC HERO TEXT */}
      <motion.div className="w-full py-6 flex flex-col justify-center items-center text-center gap-6" initial="hidden" animate="visible" variants={containerVariants}>
        <motion.div variants={itemVariants}>
          <MemoizedParagraph1 data1={roleConfig.mainTitle[0]} data2={roleConfig.mainTitle[1]} />
        </motion.div>
        <motion.div variants={itemVariants} className="max-w-2xl px-4">
          <p className="text-gray-400 text-[19px] leading-relaxed">{roleConfig.mainDesc}</p>
          
        </motion.div>
        
        <motion.div className="flex items-center gap-6 mt-4" variants={itemVariants}>
          <div onClick={() => navigate(roleConfig.cta1Path)}>
            <MemoizedButton data={roleConfig.cta1} color="red" />
          </div>
          <div onClick={() => navigate("/about-us")}>
            <MemoizedButton data={roleConfig.cta2} color="gray" />
          </div>
        </motion.div>
      </motion.div>

      {/* Video Section (Standard for all) */}
      <motion.div className="mt-8 w-[90%] max-w-[900px] border-4 border-gray-800 rounded-2xl overflow-hidden shadow-[0_0_50px_rgba(220,38,38,0.15)]">
        <LazyLoadComponent threshold={200}>
          <video autoPlay muted loop playsInline className="w-full h-full object-cover">
            <source src="https://res.cloudinary.com/dort5nnis/video/upload/v1741756665/home_page_video_oedqfi.mp4" type="video/mp4" />
          </video>
        </LazyLoadComponent>
      </motion.div>

      {/* Static Sections with Code Animations */}
      <motion.div ref={section1Ref} className="w-[90%] mt-20 max-w-[1300px] flex flex-col md:flex-row justify-center items-center gap-16" initial="hidden" animate={section1InView ? "visible" : "hidden"} variants={containerVariants}>
        <div className="w-full md:w-1/2 flex flex-col gap-6">
          <MemoizedParagraph1 data1={para2_1[0]} data2={para2_1[1]} data3={para2_1[2]} container="true" />
          <MemoizedParagraph2 data={para2_2} container="true" />
        </div>
        <div className="w-full md:w-1/2"><LazyLoadComponent threshold={200}><CodeAnimation /></LazyLoadComponent></div>
      </motion.div>

      {/* Dynamic Data Interaction Section */}
      <motion.div ref={section3Ref} className="w-full flex flex-col items-center mt-20 pb-20 z-100" initial="hidden" animate={section3InView ? "visible" : "hidden"} variants={containerVariants}>
        <motion.div className="text-center mb-12" variants={itemVariants}>
          <h2 className="text-3xl font-black text-white uppercase tracking-tight">Technical <span className="text-red-600 ml-2">Inventory</span></h2>
          <p className="text-gray-500 text-[18px] font-black tracking-[0.1em] mt-2">Filter protocols based on user requirements</p>
        </motion.div>

        <motion.div className="flex flex-wrap justify-center items-center gap-4 bg-gray-800/50 p-4 rounded-2xl border border-gray-700" variants={itemVariants}>
          {renderCategoryButtons}
        </motion.div>

        {renderDataCards}
      </motion.div>
    </div>
  );
};

export default React.memo(HeroSection);