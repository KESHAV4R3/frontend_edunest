import React, { useState } from "react";
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
const HeroSection = () => {
  const navigate = useNavigate();
  const [currentCategory, setCurrentCategory] = useState(dataList[0]);
  const [currentData, setCurrentData] = useState(data[0]);

  function updateDataCategory(index) {
    setCurrentCategory(dataList[index]);
    setCurrentData(data[index]);
  }

  return (
    <div className="w-full bg-dark_bg mt-20 flex flex-col items-center gap-7 justify-center">
      {/* become instructor button */}
      <button
        onClick={() => {
          navigate("/register");
        }}
        className="cursor-pointer mb-5 hover:scale-105 transition-all duration-300 hover:bg-gray-900 flex items-center gap-3 text-[18px] text-gray-300 border border-gray-500 rounded-2xl bg-gray-800 px-5 py-3"
      >
        Become an instructor <FaArrowRight />
      </button>

      {/* intro section text */}
      <div className="w-full py-10 flex flex-col justify-center items-center gap-7">
        <Paragraph_1 data1={para1_1[0]} data2={para1_1[1]} />
        <Paragraph_2 data={para1_2} />
        <div className="flex items-center gap-8 mt-5">
          <div
            onClick={() => {
              navigate("/about-us");
            }}
          >
            <Button data="Learn More" color="red" />
          </div>
        </div>
      </div>

      {/* video section */}
      <div className="mt-5 w-[90%] max-w-[900px] rounded-xl bg-gray-800 flex items-center justify-center overflow-visible shadow-[0_0_40px_25px_rgba(96,165,250,0.1)]">
        <video
          autoPlay
          muted
          loop
          className={`w-full h-full object-cover rounded-xl`}
        >
          <source
            src="https://res.cloudinary.com/dort5nnis/video/upload/v1741756665/home_page_video_oedqfi.mp4"
            type="video/mp4"
          />
        </video>
      </div>

      {/* section 1 */}
      <div className="w-[90%] tablet:mt-20 max-w-[1300px] p-5 gap-15 flex flex-col tablet:flex-row">
        <div className="flex flex-col gap-5 w-full max-w-[750px] tablet:w-[50%]">
          <Paragraph_1
            data1={para2_1[0]}
            data2={para2_1[1]}
            data3={para2_1[2]}
            container="true"
          />
          <Paragraph_2 data={para2_2} container="true" />

          <div className="flex items-center justify-center tablet:justify-start gap-8 mt-5">
            <div
              onClick={() => {
                navigate("/register");
              }}
            >
              <Button data="Try it YourSelf" color="red" />
            </div>
            <div
              onClick={() => {
                navigate("/about-us");
              }}
            >
              <Button data="Learn more" color="gray" />
            </div>
          </div>
        </div>

        <div className="w-full tablet:w-[50%] flex justify-center items-center">
          <CodeAnimation />
        </div>
      </div>

      {/* section 2 */}
      <div className="w-[90%] tablet:mt-10 max-w-[1300px] p-5 gap-15 flex flex-col tablet:flex-row">
        <div className="w-full tablet:w-[50%] flex justify-center items-center">
          <CodeAnimations2 />
        </div>
        <div className="flex flex-col gap-5 w-full max-w-[750px] tablet:w-[50%]">
          <Paragraph_1 data1={para3_1[0]} data2={para3_1[1]} container="true" />
          <Paragraph_2 data={para3_2} container="true" />
          <div className="flex items-center justify-center tablet:justify-start gap-8 mt-5">
            <div
              onClick={() => {
                navigate("/register");
              }}
            >
              <Button data="Continue lesson" color="red" />
            </div>
            <div
              onClick={() => {
                navigate("/about-us");
              }}
            >
              <Button data="Learn more" color="gray" />
            </div>
          </div>
        </div>
      </div>

      {/* section 3 */}
      <div className="w-full flex flex-col items-center mt-20">
        <div className="flex flex-col gap-4">
          <Paragraph_1 data1={para4_1[0]} data2={para4_1[1]} />
          <Paragraph_2 data={para4_2} />
        </div>

        <div className="mt-10 flex flex-wrap justify-center items-center gap-5 tablet:gap-7 bg-gray-900 w-[90%] p-2 max-w-[1100px] m-auto rounded-2xl">
          {dataList.map((value, index) => (
            <div
              key={index}
              className={`m-auto text-[20px] w-[160px] h-[35px] tablet:h-[50px] font-[600] text-center text-white cursor-pointer rounded-lg flex justify-center items-center 
            ${value == currentCategory ? "bg-gray-800" : ""}`}
              onClick={() => {
                updateDataCategory(index);
              }}
            >
              {value}
            </div>
          ))}
        </div>

        <div className="mt-20 z-1 w-[90%] max-w-[1200px] flex justify-center items-center gap-10 flex-wrap -mb-[100px]">
          {currentData.map((value, index) => (
            <div
              key={index}
              className="bg-gray-800 relative w-full min-h-[300px] max-w-[350px] p-7 rounded-lg cursor-pointer hover:scale-105 group hover:bg-gray-900 duration-200"
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
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
