import React, {
  useState,
  useEffect,
  useCallback,
  useRef,
  useMemo,
} from "react";
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
import { FaArrowRight } from "react-icons/fa6";
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

const HeroSection = () => {
  const navigate = useNavigate();
  const [currentCategory, setCurrentCategory] = useState(dataList[0]);
  const [currentData, setCurrentData] = useState(data[0]);
  const [isAnimating, setIsAnimating] = useState(false);
  const videoRef = useRef(null);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);

  // Animation variants
  const containerVariants = useMemo(
    () => ({
      hidden: { opacity: 0 },
      visible: {
        opacity: 1,
        transition: {
          staggerChildren: 0.1,
        },
      },
    }),
    []
  );

  const itemVariants = useMemo(
    () => ({
      hidden: { y: 20, opacity: 0 },
      visible: {
        y: 0,
        opacity: 1,
        transition: {
          duration: 0.5,
          ease: "easeOut",
        },
      },
    }),
    []
  );

  const cardVariants = useMemo(
    () => ({
      hidden: { opacity: 0, y: 20, scale: 0.95 },
      visible: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: {
          type: "spring",
          stiffness: 300,
          damping: 20,
          duration: 0.5,
        },
      },
      hover: {
        scale: 1.03,
        y: -5,
        boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.2)",
        transition: {
          duration: 0.3,
        },
      },
      exit: {
        opacity: 0,
        y: -20,
        transition: {
          duration: 0.3,
          ease: "easeIn",
        },
      },
    }),
    []
  );

  const videoVariants = useMemo(
    () => ({
      hidden: { opacity: 0, scale: 0.95, rotateY: -10 },
      visible: {
        opacity: 1,
        scale: 1,
        rotateY: 0,
        transition: {
          delay: 0.4,
          type: "spring",
          stiffness: 100,
          damping: 10,
        },
      },
    }),
    []
  );

  // Intersection Observer hooks
  const [section1Ref, section1InView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
    rootMargin: "-50px 0px",
  });

  const [section2Ref, section2InView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
    rootMargin: "-50px 0px",
  });

  const [section3Ref, section3InView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
    rootMargin: "-50px 0px",
  });

  // Memoized update function with animation handling
  const updateDataCategory = useCallback(
    (index) => {
      if (isAnimating) return;

      setIsAnimating(true);
      setCurrentCategory(dataList[index]);

      // Small delay to allow exit animations to start
      setTimeout(() => {
        setCurrentData(data[index]);
        setIsAnimating(false);
      }, 200);
    },
    [isAnimating]
  );

  // Handle video loading and playback
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleCanPlay = () => {
      setIsVideoPlaying(true);
      video.play().catch((e) => console.log("Autoplay prevented:", e));
    };

    video.addEventListener("canplay", handleCanPlay);
    video.addEventListener("loadedmetadata", handleCanPlay);

    // Preload minimal data
    video.preload = "metadata";
    video.load();

    return () => {
      video.removeEventListener("canplay", handleCanPlay);
      video.removeEventListener("loadedmetadata", handleCanPlay);
    };
  }, []);

  // Optimized category buttons render
  const renderCategoryButtons = useMemo(
    () =>
      dataList.map((value, index) => (
        <motion.button
          key={index}
          className={`m-auto text-[18px] w-[140px] tablet:w-[160px] h-[35px] tablet:h-[50px] font-[600] text-center text-white cursor-pointer rounded-lg flex justify-center items-center 
            ${
              value === currentCategory
                ? "bg-gray-800 shadow-lg"
                : "hover:bg-gray-700"
            }`}
          onClick={() => updateDataCategory(index)}
          whileHover={{
            scale: 1.05,
            y: -3,
            boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.2)",
          }}
          whileTap={{ scale: 0.95 }}
          transition={{ type: "spring", stiffness: 400, damping: 17 }}
          disabled={isAnimating}
        >
          {value}
        </motion.button>
      )),
    [currentCategory, updateDataCategory, isAnimating]
  );

  // Optimized data cards render with improved transitions
  const renderDataCards = useMemo(
    () => (
      <div className="mt-20 z-10 w-[90%] max-w-[1200px] flex justify-center items-center gap-10 flex-wrap -mb-[15 0px] relative">
        <AnimatePresence mode="wait">
          {currentData.map((value, index) => (
            <motion.div
              key={`${currentCategory}-${index}`}
              className="bg-gray-800 relative mb-10 z-30 w-full min-h-[300px] max-w-[350px] p-7 rounded-lg cursor-pointer group hover:bg-gray-900 duration-200 shadow-xl"
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              whileHover="hover"
              layout
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 20,
                duration: 0.5,
              }}
            >
              <p className="text-white font-[600] text-[23px]">{value.title}</p>
              <p className="text-gray-400 mt-5">{value.data}</p>

              <div className="absolute bottom-4 left-0 px-5 flex justify-between mt-5 gap-10 items-center w-full border-dashed border-t-[2px] pt-2 border-gray-600">
                <div className="flex justify-center items-center gap-2">
                  <HiMiniUsers className="text-blue-500 group-hover:text-dark_red text-[17px]" />
                  <p className="text-blue-500 group-hover:text-dark_red text-[17px]">
                    Beginner
                  </p>
                </div>
                <div className="flex justify-center items-center gap-2">
                  <TbHierarchy3 className="text-blue-500 group-hover:text-dark_red text-[17px]" />
                  <p className="text-blue-500 group-hover:text-dark_red text-[17px]">
                    6 Lessons
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    ),
    [currentData, currentCategory, cardVariants]
  );

  return (
    <div className="w-[95%] m-auto bg-dark_bg pt-20 flex flex-col items-center gap-7 justify-center overflow-hidden">
      {/* become instructor button */}
      <motion.button
        initial={{ opacity: 0, y: 2 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, type: "spring", stiffness: 100 }}
        onClick={() => navigate("/register")}
        className="cursor-pointer mb-2 hover:scale-105 transition-all duration-300 hover:bg-gray-900 flex items-center gap-3 text-[18px] text-gray-300 border border-gray-500 rounded-2xl bg-gray-800 px-5 py-3"
        whileHover={{
          scale: 1.05,
          y: -1,
          boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.2)",
        }}
        whileTap={{ scale: 0.98 }}
      >
        Become an instructor <FaArrowRight />
      </motion.button>

      {/* intro section text */}
      <motion.div
        className="w-full py-10 flex flex-col justify-center items-center gap-7"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <motion.div variants={itemVariants}>
          <MemoizedParagraph1 data1={para1_1[0]} data2={para1_1[1]} />
        </motion.div>
        <motion.div variants={itemVariants}>
          <MemoizedParagraph2 data={para1_2} />
        </motion.div>
        <motion.div
          className="flex items-center gap-8 mt-5"
          variants={itemVariants}
        >
          <div onClick={() => navigate("/about-us")}>
            <MemoizedButton data="Learn More" color="red" />
          </div>
        </motion.div>
      </motion.div>

      {/* video section with 3D effect */}
      <motion.div
        className="mt-5 w-[90%] max-w-[900px] rounded-xl bg-gray-800 flex items-center justify-center overflow-visible shadow-[0_0_40px_25px_rgba(96,165,250,0.1)]"
        initial="hidden"
        animate="visible"
        variants={videoVariants}
        whileHover={{
          rotateY: 3,
          transition: { duration: 0.3 },
        }}
      >
        <LazyLoadComponent threshold={200}>
          <video
            ref={videoRef}
            autoPlay
            muted
            loop
            playsInline
            className="w-full h-full object-cover rounded-xl"
            poster="https://res.cloudinary.com/dort5nnis/image/upload/v1741756665/video-poster.jpg"
            preload="metadata"
            aria-label="Demo video showing platform features"
          >
            <source
              src="https://res.cloudinary.com/dort5nnis/video/upload/v1741756665/home_page_video_oedqfi.mp4"
              type="video/mp4"
            />
            Your browser does not support the video tag.
          </video>
        </LazyLoadComponent>
      </motion.div>

      {/* section 1 */}
      <motion.div
        ref={section1Ref}
        className="w-[90%] tablet:mt-20 max-w-[1300px] p-5 gap-15 flex flex-col tablet:flex-row justify-center items-center"
        initial="hidden"
        animate={section1InView ? "visible" : "hidden"}
        variants={containerVariants}
      >
        <motion.div
          className="flex flex-col gap-5 w-full max-w-[750px] tablet:w-[50%]"
          variants={itemVariants}
        >
          <MemoizedParagraph1
            data1={para2_1[0]}
            data2={para2_1[1]}
            data3={para2_1[2]}
            container="true"
          />
          <MemoizedParagraph2 data={para2_2} container="true" />

          <motion.div
            className="flex items-center justify-center tablet:justify-start gap-8 mt-5"
            variants={itemVariants}
          >
            <div onClick={() => navigate("/register")}>
              <MemoizedButton data="Try it YourSelf" color="red" />
            </div>
            <div onClick={() => navigate("/about-us")}>
              <MemoizedButton data="Learn more" color="gray" />
            </div>
          </motion.div>
        </motion.div>

        <motion.div
          className="w-full tablet:w-[50%] flex justify-center items-center"
          variants={itemVariants}
          whileHover={{ scale: 1.02 }}
        >
          <LazyLoadComponent threshold={200}>
            <CodeAnimation />
          </LazyLoadComponent>
        </motion.div>
      </motion.div>

      {/* section 2 */}
      <motion.div
        ref={section2Ref}
        className="w-[90%] tablet:mt-10 max-w-[1300px] p-5 gap-15 flex flex-col tablet:flex-row justify-center items-center"
        initial="hidden"
        animate={section2InView ? "visible" : "hidden"}
        variants={containerVariants}
      >
        <motion.div
          className="w-full tablet:w-[50%] flex justify-center items-center order-1 tablet:order-none"
          variants={itemVariants}
          whileHover={{ scale: 1.02 }}
        >
          <LazyLoadComponent threshold={200}>
            <CodeAnimations2 />
          </LazyLoadComponent>
        </motion.div>
        <motion.div
          className="flex flex-col gap-5 w-full max-w-[750px] tablet:w-[50%] order-0 tablet:order-none"
          variants={itemVariants}
        >
          <MemoizedParagraph1
            data1={para3_1[0]}
            data2={para3_1[1]}
            container="true"
          />
          <MemoizedParagraph2 data={para3_2} container="true" />
          <motion.div
            className="flex items-center justify-center tablet:justify-start gap-8 mt-5"
            variants={itemVariants}
          >
            <div onClick={() => navigate("/register")}>
              <MemoizedButton data="Continue lesson" color="red" />
            </div>
            <div onClick={() => navigate("/about-us")}>
              <MemoizedButton data="Learn more" color="gray" />
            </div>
          </motion.div>
        </motion.div>
      </motion.div>

      <CourseDisplay />

      {/* section 3 with enhanced 3D effects */}
      <motion.div
        ref={section3Ref}
        className="w-full flex flex-col items-center mt-10 relative"
        initial="hidden"
        animate={section3InView ? "visible" : "hidden"}
        variants={containerVariants}
      >
        <motion.div
          className="flex flex-col gap-4 z-10"
          variants={itemVariants}
        >
          <MemoizedParagraph1 data1={para4_1[0]} data2={para4_1[1]} />
          <MemoizedParagraph2 data={para4_2} />
        </motion.div>

        <motion.div
          className="mt-10 flex flex-wrap justify-center items-center gap-5 tablet:gap-7 bg-gray-900 w-[90%] p-2 max-w-[1100px] m-auto rounded-2xl z-10"
          variants={itemVariants}
          whileInView={{
            scale: [0.98, 1],
            transition: { duration: 0.5 },
          }}
        >
          {renderCategoryButtons}
        </motion.div>

        {renderDataCards}
      </motion.div>
    </div>
  );
};

export default React.memo(HeroSection);
