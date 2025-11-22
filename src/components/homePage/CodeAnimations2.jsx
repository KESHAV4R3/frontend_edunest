import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Tilt from "react-parallax-tilt";
import "./blinking.css";

const codeLines = [
  'import React from "react";',
  'import CTAButton from "./Button";',
  'import TypeAnimation from "react-type";',
  'import { FaArrowRight } from "react-icons/fa";',
  "const Home = () => {",
  "return (",
  "<div>Home</div>",
  "}",
  "export default Home",
];

const CodeAnimations2 = ({ cardNumber }) => {
  const [displayedText, setDisplayedText] = useState([]);
  const [lineIndex, setLineIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [reverse, setReverse] = useState(false);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.1,
      },
    },
  };

  const lineVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        ease: "easeOut",
        duration: 0.3,
      },
    },
  };

  useEffect(() => {
    let timer;
    const isTyping = !reverse;
    const currentLine = codeLines[lineIndex];

    if (isTyping) {
      if (charIndex < currentLine.length) {
        timer = setTimeout(() => {
          setDisplayedText((prev) => {
            const newDisplay = [...prev];
            if (!newDisplay[lineIndex]) newDisplay[lineIndex] = "";
            newDisplay[lineIndex] = currentLine.substring(0, charIndex + 1);
            return newDisplay;
          });
          setCharIndex(charIndex + 1);
        }, 50);
      } else if (lineIndex < codeLines.length - 1) {
        timer = setTimeout(() => {
          setLineIndex(lineIndex + 1);
          setCharIndex(0);
        }, 150);
      } else {
        timer = setTimeout(() => {
          setReverse(true);
          setCharIndex(currentLine.length);
        }, 1000);
      }
    } else {
      if (charIndex >= 0) {
        timer = setTimeout(() => {
          setDisplayedText((prev) => {
            const newDisplay = [...prev];
            newDisplay[lineIndex] = currentLine.substring(0, charIndex);
            return newDisplay;
          });
          setCharIndex(charIndex - 1);
        }, 30);
      } else if (lineIndex > 0) {
        timer = setTimeout(() => {
          setLineIndex(lineIndex - 1);
          setCharIndex(codeLines[lineIndex - 1].length);
        }, 100);
      } else {
        timer = setTimeout(() => {
          setDisplayedText([]);
          setLineIndex(0);
          setCharIndex(0);
          setReverse(false);
        }, 700);
      }
    }

    return () => clearTimeout(timer);
  }, [lineIndex, charIndex, reverse]);

  return (
    <Tilt
      options={{
        max: 8,
        scale: 1.02,
        speed: 1000,
        glare: true,
        "max-glare": 0.2,
      }}
      className="tilt-wrapper"
    >
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="bg-gray-900 cursor-pointer  text-green-400 p-6 sm:p-8 rounded-xl font-mono text-base sm:text-sm w-[370px] screen2:w-[500px] h-[430px] screen2:h-[400px] overflow-hidden shadow-xl border border-green-900/50 relative code-terminal"
      >
        {/* Terminal header */}
        <div className="flex items-center mb-4 pb-2 border-b border-green-900/30">
          <div className="flex space-x-2 mr-4">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
          </div>
          <div className="text-green-300 text-xs">terminal</div>
        </div>

        {/* Code lines */}
        <div className="overflow-y-auto h-[calc(100%-50px)] pr-2">
          {
            <div>
              {codeLines.map((line, i) => {
                const text = displayedText[i] || "";
                const isCurrentLine = i === lineIndex;
                const showCursor = isCurrentLine && !reverse;

                return (
                  <motion.div
                    key={i}
                    variants={lineVariants}
                    className="mb-2 flex items-start"
                  >
                    <span className="text-green-600 mr-2 select-none">$</span>
                    <span>
                      {text}
                      {showCursor && <span className="blinking">|</span>}
                    </span>
                  </motion.div>
                );
              })}
            </div>
          }
        </div>

        {/* Watermark */}
        <motion.div
          className="absolute bottom-2 right-4 text-green-900/30 text-xs"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
        >
          dev-terminal
        </motion.div>
      </motion.div>
    </Tilt>
  );
};

export default React.memo(CodeAnimations2);
