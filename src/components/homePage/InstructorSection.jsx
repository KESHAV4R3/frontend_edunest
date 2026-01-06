import React, { memo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FaArrowRight } from "react-icons/fa6";

const para7_1 = ["Become an", "Instructor"];
const para7_2 =
  "Join our global community of educators and empower students by sharing your expertise. Whether you're experienced or just starting, you can make a difference and inspire learners around the world.";

const InstructorSection = () => {
  const navigate = useNavigate();

  // Memoized navigation handler for high performance
  const handleJoin = useCallback(() => {
    navigate("/register");
  }, [navigate]);

  return (
    <section className="bg-gray-900 py-24 px-4 tablet:px-10 w-full selection:bg-red-600/40">
      <div className="max-w-7xl mx-auto flex flex-col tablet2:flex-row items-center justify-between gap-16">

        {/* --- Left Content: Themed Image --- */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          viewport={{ once: true }}
          className="w-full tablet2:w-[48%]"
        >
          <img
            src="https://res.cloudinary.com/dort5nnis/image/upload/v1742982075/portrait-smiling-senior-businessman-library_yyt0ek.jpg"
            alt="Lead Instructor"
            className="w-full h-auto rounded-3xl object-cover border border-gray-700 shadow-[0_0_50px_rgba(220,38,38,0.1)] transition-transform duration-500 hover:scale-[1.02]"
            loading="lazy"
          />
        </motion.div>

        {/* --- Right Content: High-Contrast Info --- */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          viewport={{ once: true }}
          className="w-full tablet2:w-[48%] flex flex-col items-center tablet2:items-start gap-8 text-center tablet2:text-left"
        >
          {/* Main Technical Heading */}
          <div className="space-y-4">
            <h2 className="text-4xl tablet:text-5xl font-black tracking-tight uppercase leading-tight text-white">
              {para7_1[0]} <br/>
              <span className="text-red-600">{para7_1[1]}</span>
            </h2>
            <div className="h-1.5 w-20 bg-red-600 rounded-full mx-auto tablet2:mx-0" />
          </div>

          {/* Detailed Description */}
          <div className="max-w-[550px]">
            <p className="text-lg text-gray-300 leading-relaxed font-medium">
              {para7_2}
            </p>
          </div>

          {/* Signature Action Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleJoin}
            className="group flex items-center gap-3 px-8 py-4 bg-red-600 hover:bg-red-700 text-white text-xs font-black uppercase tracking-[0.2em] rounded-xl transition-all shadow-xl shadow-red-900/20"
          >
            Start teaching today
            <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
};

export default memo(InstructorSection);