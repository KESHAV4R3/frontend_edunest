import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FaExclamationTriangle, FaHome } from "react-icons/fa";

const PageNotFound = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gradient-to-br from-dark_bg to-gray-900 flex flex-col items-center justify-center px-4"
    >
      <motion.div
        initial={{ y: -50, scale: 0.8 }}
        animate={{ y: 0, scale: 1 }}
        transition={{ type: "spring", damping: 10, stiffness: 100 }}
        className="text-center"
      >
        <motion.div
          animate={{
            rotate: [0, 10, -10, 0],
            scale: [1, 1.1, 1.1, 1],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            repeatType: "mirror",
          }}
          className="flex justify-center mb-6"
        >
          <FaExclamationTriangle className="text-7xl text-red-600" />
        </motion.div>

        <h1 className="text-8xl font-bold text-red-500 mb-4">404</h1>
        <h2 className="text-3xl font-semibold text-gray-200 mb-4">
          Page Not Found
        </h2>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-gray-300 mb-8 text-lg max-w-md"
        >
          Oops! The page you're looking for doesn't exist or has been moved.
        </motion.p>

        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Link
            to="/"
            className="px-8 py-3 bg-gradient-to-r from-dark_red to-red-700 text-white rounded-lg shadow-lg hover:shadow-red-500/20 transition-all duration-300 flex items-center justify-center gap-2 text-lg"
          >
            <FaHome />
            Return to Home
          </Link>
        </motion.div>

        <motion.div
          className="mt-12 text-gray-500 text-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <div className="flex justify-center gap-4 mt-2">
            <Link to="/contact-us" className="hover:text-gray-300 transition">
              Contact Support
            </Link>
            <Link to="/help" className="hover:text-gray-300 transition">
              Help Center
            </Link>
          </div>
        </motion.div>
      </motion.div>

      <motion.div
        className="absolute bottom-8 text-gray-600 text-xs"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
      >
        Error Code: 404 | {new Date().getFullYear()}
      </motion.div>
    </motion.div>
  );
};

export default PageNotFound;
