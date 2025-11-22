import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const para7_1 = ["Become an Instructor", "Inspire learners around the world"];
const para7_2 =
  "Join our global community of educators and empower students by sharing your expertise. Whether you're experienced or just starting, you can make a difference.";

const InstructorSection = () => {
  const navigate = useNavigate();

  return (
    <section className="bg-dark_bg py-16 px-4 tablet:px-10 w-full">
      <div className="max-w-7xl mx-auto flex flex-col tablet2:flex-row items-center justify-between gap-14">

        {/* Left Animated Image */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          className="w-full tablet2:w-[48%]"
        >
          <img
            src="https://res.cloudinary.com/dort5nnis/image/upload/v1742982075/portrait-smiling-senior-businessman-library_yyt0ek.jpg"
            alt="Instructor"
            className="w-full h-auto rounded-2xl object-cover shadow-[0_0_40px_10px_rgba(255,255,255,0.1)] hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
        </motion.div>

        {/* Right Animated Content */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          className="w-full tablet2:w-[48%] flex flex-col items-center gap-8 text-center"
        >
          {/* Main Heading */}
          <div>
            <h2 className="text-white text-3xl tablet:text-4xl font-bold">
              {para7_1[0]}
            </h2>
            <p className="text-lg text-gray-300 mt-2">{para7_1[1]}</p>
          </div>

          {/* Description */}
          <div>
            <p className="text-base text-gray-400 max-w-[550px] mx-auto leading-relaxed">
              {para7_2}
            </p>
          </div>

          {/* Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate("/register")}
            className="px-6 py-3 rounded-full text-white font-semibold bg-red-600 hover:bg-red-700 transition duration-300 shadow-lg"
          >
            Start teaching today
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
};

export default React.memo(InstructorSection);
