import React, { memo } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

import BenefitSection_1 from "../../assets/homepage/BenefitSection_1.png";
import Compare_with_others from "../../assets/homepage/Compare_with_others.png";
import Know_your_progress from "../../assets/homepage/Know_your_progress.png";
import Plan_your_lessons from "../../assets/homepage/Plan_your_lessons.png";

import { FaUserTie, FaGraduationCap, FaCode } from "react-icons/fa";
import { IoDiamond } from "react-icons/io5";

import {
  para5_1,
  para5_2,
  para6_1,
  para6_2,
} from "../../data/heroSectionCategoryData";

import Paragraph_1 from "./Paragraph_1";
import Paragraph_2 from "./Paragraph_2";
import Button from "../application/Button";

const BenefitSection = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-[#fffffb] -mt-25 overflow-hidden">
      {/* Section 1 */}
      <motion.div
        className="relative min-h-[300px] tablet:min-h-[350px] flex items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        style={{
          backgroundImage: `url(${BenefitSection_1})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="relative z-10 pt-20">
          <div className="flex items-center gap-8 justify-center">
            <div onClick={() => navigate("/about-us")}>
              <Button data="Learn More" color="red" />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Section 2 */}
      <div className="w-[90%] max-w-[1400px] mb-10 p-5 gap-7 tablet:gap-15 flex flex-col tablet:flex-row m-auto pt-10">
        <motion.div
          className="w-full tablet:w-[50%]"
          initial={{ x: -100, opacity: 0 }}
          whileInView={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          <Paragraph_1
            data1={para5_1[0]}
            data2={para5_1[1]}
            back="white"
            container="true"
          />
        </motion.div>

        <motion.div
          className="flex flex-col gap-5 w-full max-w-[750px] tablet:w-[50%]"
          initial={{ x: 100, opacity: 0 }}
          whileInView={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          <Paragraph_2 data={para5_2} container="true" back="white" />
          <div className="flex items-center justify-center tablet:justify-start gap-8 mt-5">
            <div onClick={() => navigate("/about-us")}>
              <Button data="Learn More" color="red" />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Section 3 */}
      <div className="w-[90%] max-w-[1300px] p-4 gap-15 flex items-center flex-col tablet:flex-row m-auto">
        {/* Left side icons and labels */}
        <motion.div
          className="w-full tablet:w-[40%] h-full flex justify-center tablet:justify-start gap-5"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="flex gap-3 flex-col w-[10%] justify-between items-center">
            {[FaUserTie, FaGraduationCap, IoDiamond, FaCode].map((Icon, i) => (
              <React.Fragment key={i}>
                <div className="bg-white shadow-2xl shadow-gray-900 w-[50px] h-[50px] rounded-full flex justify-center items-center">
                  <Icon
                    className={`text-[22px] ${
                      i === 0
                        ? "text-blue-500"
                        : i === 1
                        ? "text-pink-600"
                        : i === 2
                        ? "text-yellow-500"
                        : "text-green-500"
                    }`}
                  />
                </div>
                {i < 3 && (
                  <div className="h-[50px] w-1 border-r-2 border-dashed text-gray-400 py-2"></div>
                )}
              </React.Fragment>
            ))}
          </div>

          <div className="flex flex-col justify-between items-start">
            {[...Array(4)].map((_, idx) => (
              <div key={idx}>
                <p className="font-semibold">Leadership</p>
                <p className="text-gray-600 text-sm">
                  Fully committed to the success company
                </p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Right image and stats */}
        <motion.div
          className="m-auto flex flex-col gap-5 w-full max-w-[750px] tablet:w-[60%]"
          initial={{ scale: 0.9, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <img
            src="https://res.cloudinary.com/dort5nnis/image/upload/v1741757446/img3_bhfdug.jpg"
            className="rounded-lg shadow-[0_0_40px_25px_rgba(96,165,250,0.2)]"
            loading="lazy"
          />
          <div className="-mt-[40px] tablet:-mt-[70px] flex flex-wrap gap-2 justify-between p-2 m-auto tablet:w-[80%] max-w-[500px] bg-green-900 rounded-xl">
            {[
              { label: "YEARS EXPERIENCE", value: "10" },
              { label: "TYPES OF COURSES", value: "250" },
            ].map((item, i) => (
              <div
                key={i}
                className="bg-green-800 p-2 rounded-lg w-[46%] min-w-[230px] flex items-center justify-center gap-5"
              >
                <div className="text-white font-bold text-[15px] tablet:text-[30px]">
                  {item.value}
                </div>
                <div className="text-white tablet:text-[18px] tracking-wide">
                  {item.label}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Section 4 */}
      <div className="bg-white w-full pt-10 tablet:pt-20 pb-10">
        <div className="w-full flex justify-center px-4 tablet:px-8 mt-8">
          <div className="flex flex-col gap-6 max-w-4xl w-full">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Paragraph_1 data1={para6_1[0]} data2={para6_1[1]} back="white" />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Paragraph_2 data={para6_2} back="white" />
            </motion.div>
          </div>
        </div>

        {/* Rotating & Animated Image Cards */}
        <div className="flex justify-center flex-wrap gap-6 items-center mt-14 px-4 tablet:px-10">
          {[Know_your_progress, Compare_with_others, Plan_your_lessons].map(
            (img, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.05, rotateY: 5, zIndex: 10 }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
                className="w-[90%] tablet:w-[300px] bg-white rounded-xl overflow-hidden shadow-xl hover:shadow-2xl transition-shadow duration-300 cursor-pointer"
                style={{
                  perspective: "1000px",
                }}
              >
                <img
                  src={img}
                  alt={`benefit_img_${idx}`}
                  className="w-full h-auto rounded-xl transform transition duration-300"
                  loading="lazy"
                />

                {/* Optional Label Overlay (Uncomment if needed) */}
                {/*
      <div className="absolute bottom-3 left-3 bg-black/60 text-white px-3 py-1 rounded text-sm">
        {['Track Progress', 'Compare with Others', 'Plan Lessons'][idx]}
      </div>
      */}
              </motion.div>
            )
          )}
        </div>

        <div className="w-full flex items-center justify-center gap-8 mt-10">
          <div onClick={() => navigate("/about-us")}>
            <Button data="Learn more" color="red" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default memo(BenefitSection);
