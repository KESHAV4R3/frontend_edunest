import React from "react";
import BenefitSection_1 from "../../assets/homepage/BenefitSection_1.png";
import Compare_with_others from "../../assets/homepage/Compare_with_others.png";
import Know_your_progress from "../../assets/homepage/Know_your_progress.png";
import Plan_your_lessons from "../../assets/homepage/Plan_your_lessons.png";
import { FaUserTie } from "react-icons/fa";
import { FaGraduationCap } from "react-icons/fa";
import { IoDiamond } from "react-icons/io5";
import { FaCode } from "react-icons/fa";
import {
  para5_1,
  para5_2,
  para6_1,
  para6_2,
} from "../../data/heroSectionCategoryData";
import Paragraph_1 from "./Paragraph_1";
import Paragraph_2 from "./Paragraph_2";
import Button from "../application/Button";
import { useNavigate } from "react-router-dom";
const BenefitSection = () => {
  const navigate = useNavigate();
  return (
    <div className="bg-[#fffffb]">
      {/* section 1 */}
      <div
        className="relative min-h-[300px] tablet:min-h-[350px] flex items-center justify-center"
        style={{
          backgroundImage: `url(${BenefitSection_1})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <div className="relative z-10 pt-20">
          <div className="flex items-center gap-8 justify-center">
            <div
              onClick={() => {
                navigate("/about-us");
              }}
            >
              <Button data="Learn More" color="red" />
            </div>
          </div>
        </div>
      </div>

      {/* section 2 */}
      <div className="w-[90%] max-w-[1400px] mb-10 p-5 gap-7 tablet:gap-15 flex flex-col tablet:flex-row m-auto pt-10">
        <div className=" w-full tablet:w-[50%]">
          <Paragraph_1
            data1={para5_1[0]}
            data2={para5_1[1]}
            back="white"
            container="true"
          />
        </div>
        <div className="flex flex-col gap-5 w-full max-w-[750px] tablet:w-[50%]">
          <Paragraph_2 data={para5_2} container="true" back="white" />

          <div className="flex items-center justify-center tablet:justify-start gap-8 mt-5">
            <div
              onClick={() => {
                navigate("/about-us");
              }}
            >
              <Button data="Learn More" color="red" />
            </div>
          </div>
        </div>
      </div>

      {/* section 3 */}
      <div className=" w-[90%] max-w-[1300px] p-4 gap-15 flex items-center flex-col tablet:flex-row m-auto">
        <div className="0 w-full tablet:w-[40%] h-full flex justify-center tablet:justify-start gap-5">
          <div className=" flex gap-3 flex-col w-[10%] justify-between items-center">
            <div className="bg-white shadow-2xl shadow-gray-900 w-[50px] h-[50px] rounded-full flex justify-center items-center">
              <FaUserTie className="text-[22px] text-blue-500" />
            </div>
            <div className="h-[50px] w-1 border-r-2 border-dashed text-gray-400 py-2"></div>
            <div className="bg-white shadow-2xl shadow-gray-900 w-[50px] h-[50px] rounded-full flex justify-center items-center">
              <FaGraduationCap className="text-[22px] text-pink-600" />
            </div>
            <div className="h-[50px] w-1 border-r-2 border-dashed text-gray-400 py-2"></div>
            <div className="bg-white shadow-2xl shadow-gray-900 w-[50px] h-[50px] rounded-full flex justify-center items-center">
              <IoDiamond className="text-[22px] text-yellow-500" />
            </div>
            <div className="h-[50px] w-1 border-r-2 border-dashed text-gray-400 py-2"></div>
            <div className="bg-white shadow-2xl shadow-gray-900 w-[50px] h-[50px] rounded-full flex justify-center items-center">
              <FaCode className="text-[22px] text-green-500" />
            </div>
          </div>
          <div className="flex flex-col justify-between items-start">
            <div>
              <p>Leadership</p>
              <p>Fully commited to the success company</p>
            </div>
            <div>
              <p>Leadership</p>
              <p>Fully commited to the success company</p>
            </div>
            <div>
              <p>Leadership</p>
              <p>Fully commited to the success company</p>
            </div>
            <div>
              <p>Leadership</p>
              <p>Fully commited to the success company</p>
            </div>
          </div>
        </div>

        <div className=" m-auto flex flex-col gap-5 w-full max-w-[750px] tablet:w-[60%]">
          <img
            src="https://res.cloudinary.com/dort5nnis/image/upload/v1741757446/img3_bhfdug.jpg"
            className="rounded-lg shadow-[0_0_40px_25px_rgba(96,165,250,0.2)]"
          />
          <div className="-mt-[40px] tablet:-mt-[70px] flex flex-row flex-wrap gap-2 justify-between p-2 m-auto  tablet:w-[80%] max-w-[500px] bg-green-900">
            <div className="bg-green-800 p-2 rounded-lg w-[46%] min-w-[230px] flex items-center justify-center m-auto gap-5">
              <div className="text-white font-[700] text-[15px] tablet:text-[30px]">
                10
              </div>
              <div className="text-white tablet:text-[20px] tracking-wide">
                YEARS EXPERIENCE
              </div>
            </div>

            <div className="bg-green-800 p-2 rounded-lg w-[46%] min-w-[230px] flex items-center justify-center m-auto gap-5">
              <div className="text-white font-[700] text-[15px] tablet:text-[30px]">
                250
              </div>
              <div className="text-white tablet:text-[18px] tracking-wide">
                TYPES OF COURSES
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* section4 */}
      <div className="bg-white w-full pt-10 tablet:pt-20 pb-10">
        <div className="flex flex-col gap-4">
          <Paragraph_1 data1={para6_1[0]} data2={para6_1[1]} back="white" />
          <Paragraph_2 data={para6_2} back="white" />
        </div>

        <div className="flex justify-center flex-wrap gap-5 items-center mt-10 p-10">
          <div className="rotate-z-20 hover:rotate-z-0 hover:z-[20] duration-200 hover:scale-110 shadow-2xl w-[300px] tablet:w-[330px]">
            <img src={Know_your_progress} alt="edunest_edtech_img" />
          </div>
          <div className="-rotate-z-10 hover:rotate-z-0 hover:z-[20] duration-200 hover:scale-110 shadow-2xl w-[300px] tablet:w-[330px]">
            <img src={Compare_with_others} alt="edunest_edtech_img" />
          </div>
          <div className="rotate-z-10 hover:rotate-z-0 hover:z-[20] duration-200 hover:scale-110 shadow-2xl w-[300px] tablet:w-[330px]">
            <img src={Plan_your_lessons} alt="edunest_edtech_img" />
          </div>
        </div>

        <div className="w-full flex items-center justify-center gap-8 mt-10">
          <div
            onClick={() => {
              navigate("/about-us");
            }}
          >
            <Button data="Learn more" color="red" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default BenefitSection;
