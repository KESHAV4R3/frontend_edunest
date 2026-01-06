import React, { memo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

import BenefitSection_1 from "../../assets/homepage/BenefitSection_1.png";
import Compare_with_others from "../../assets/homepage/Compare_with_others.png";
import Know_your_progress from "../../assets/homepage/Know_your_progress.png";
import Plan_your_lessons from "../../assets/homepage/Plan_your_lessons.png";

import { FaUserTie, FaGraduationCap, FaCode } from "react-icons/fa";
import { IoDiamond } from "react-icons/io5";

import Button from "../application/Button";

const BenefitSection = () => {
  const navigate = useNavigate();

  const handleNavigation = useCallback((path) => {
    navigate(path);
  }, [navigate]);

  return (
    <div className="bg-gray-900 -mt-24 overflow-hidden text-gray-100 selection:bg-red-600/40">
      
      {/* --- Section 1: Hero Transition --- */}
      <motion.div
        className="relative min-h-[300px] tablet:min-h-[400px] flex items-center justify-center border-b border-gray-800"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        style={{
          backgroundImage: `linear-gradient(to bottom, rgba(17, 24, 39, 0.5), rgba(17, 24, 39, 1)), url(${BenefitSection_1})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />

      {/* --- Section 2: Job Skills Header & Intro --- */}
      <div className="w-[90%] max-w-6xl py-20 gap-12 flex flex-col tablet:flex-row mx-auto items-center">
        <motion.div
          className="w-full tablet:w-1/2 space-y-4"
          initial={{ x: -20, opacity: 0 }}
          whileInView={{ x: 0, opacity: 1 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl font-black tracking-tight uppercase leading-tight">
            GET THE SKILLS YOU NEED FOR A <br/>
            <span className="text-red-600">JOB THAT IS IN DEMAND</span>
          </h2>
          <div className="h-1 w-20 bg-red-600 rounded-full" />
        </motion.div>

        <motion.div
          className="flex flex-col gap-6 w-full tablet:w-1/2"
          initial={{ x: 20, opacity: 0 }}
          whileInView={{ x: 0, opacity: 1 }}
          viewport={{ once: true }}
        >
          <p className="text-lg text-gray-300 leading-relaxed font-medium">
            The modern Edunest establishes its own identity. In today's world, becoming a competitive specialist requires more than just professional skills.
          </p>
          <div className="flex justify-center tablet:justify-start">
            <div onClick={() => handleNavigation("/about-us")}>
              <Button data="Learn More" color="red" />
            </div>
          </div>
        </motion.div>
      </div>

      {/* --- Section 3: Leadership Vertical Grid (Colorful) --- */}
      <div className="w-[90%] max-w-6xl py-20 gap-16 flex flex-col tablet:flex-row items-center mx-auto">
        
        {/* Leadership Icon List with Colorful Indicators */}
        <motion.div
          className="w-full tablet:w-[45%] flex gap-8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="flex flex-col items-center">
            {[
              { icon: <FaUserTie />, color: "border-blue-500 text-blue-500 shadow-blue-900/20" },
              { icon: <FaGraduationCap />, color: "border-red-500 text-red-500 shadow-red-900/20" },
              { icon: <IoDiamond />, color: "border-yellow-500 text-yellow-500 shadow-yellow-900/20" },
              { icon: <FaCode />, color: "border-green-500 text-green-500 shadow-green-900/20" }
            ].map((item, i) => (
              <React.Fragment key={i}>
                <div className={`bg-gray-800 border-2 ${item.color} w-14 h-14 rounded-full flex justify-center items-center shadow-2xl transition-transform hover:scale-110`}>
                  <span className="text-2xl">{item.icon}</span>
                </div>
                {i < 3 && <div className="h-14 w-px border-r-2 border-dashed border-gray-700"></div>}
              </React.Fragment>
            ))}
          </div>

          <div className="flex flex-col justify-between py-2 space-y-6">
            {[
              { t: "Leadership", d: "Committed to global education success" },
              { t: "Responsibility", d: "Student growth is our primary directive" },
              { t: "Flexibility", d: "Adapting to modern industry standards" },
              { t: "Problem Solving", d: "Technical excellence in every module" }
            ].map((item, idx) => (
              <div key={idx} className="group">
                <p className="font-black text-gray-100 uppercase text-lg tracking-tight group-hover:text-red-500 transition-colors">
                  {item.t}
                </p>
                <p className="text-gray-400 text-sm mt-1 leading-snug">
                  {item.d}
                </p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Dynamic Image & Stats Bar */}
        <motion.div
          className="relative w-full tablet:w-[55%]"
          initial={{ scale: 0.95, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          viewport={{ once: true }}
        >
          <img
            src="https://res.cloudinary.com/dort5nnis/image/upload/v1741757446/img3_bhfdug.jpg"
            className="rounded-3xl border border-gray-700 shadow-[0_0_60px_rgba(220,38,38,0.15)]"
            alt="Platform Preview"
            loading="lazy"
          />
          
          <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-[85%] bg-red-600 rounded-2xl p-8 flex flex-wrap justify-around items-center shadow-2xl shadow-red-900/50 border border-red-400/20">
            <div className="flex items-center gap-5 border-r border-red-400/40 pr-10">
              <span className="text-4xl font-black text-white">10</span>
              <span className="text-[11px] font-black uppercase tracking-widest text-red-100 leading-tight">Years Of<br/>Experience</span>
            </div>
            <div className="flex items-center gap-5 pl-4">
              <span className="text-4xl font-black text-white">250</span>
              <span className="text-[11px] font-black uppercase tracking-widest text-red-100 leading-tight">Elite<br/>Curriculums</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* --- Section 4: Swiss Knife Header & Cards --- */}
      <div className="bg-gray-900 w-full pt-32 pb-20">
        <div className="max-w-4xl mx-auto px-6 text-center space-y-4 flex flex-col items-center">
           <h2 className="text-4xl font-black text-white uppercase tracking-tight">
            YOUR SWISS KNIFE FOR <br/>
            <span className="text-red-600">LEARNING ANY LANGUAGE</span>
          </h2>
          <p className="text-gray-500 text-[16px] md:w-[80%] font-black tracking-[0.1em] mt-2">
            Using spin making learning multiple languages easy. with 20+ languages realistic voiceover, progress tracking, custom schedule and more.
          </p>
        </div>

        {/* Image Cards */}
        <div className="flex flex-wrap justify-center gap-8 mt-20 px-6">
          {[Know_your_progress, Compare_with_others, Plan_your_lessons].map((img, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              whileHover={{ y: -12, scale: 1.03 }}
              viewport={{ once: true }}
              className="w-full max-w-[340px] bg-gray-800 border border-gray-700 rounded-3xl overflow-hidden shadow-2xl hover:border-red-600/50 transition-all cursor-pointer group"
            >
              <img
                src={img}
                alt="Swiss Knife Feature"
                className="w-full h-auto opacity-90 group-hover:opacity-100 transition-opacity"
                loading="lazy"
              />
            </motion.div>
          ))}
        </div>

        <div className="flex justify-center mt-20">
          <div onClick={() => handleNavigation("/about-us")}>
            <Button data="Explore Tools" color="red" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default memo(BenefitSection);