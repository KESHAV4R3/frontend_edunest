import React from "react";
import { para7_1, para7_2 } from "../../data/heroSectionCategoryData";
import Paragraph_1 from "./Paragraph_1";
import Paragraph_2 from "./Paragraph_2";
import Button from "../application/Button";
import { useNavigate } from "react-router-dom";
const InstructorSection = () => {
  const navigate=useNavigate()
  return (
    <div>
      <div className="bg-dark_bg flex justify-center items-center flex-wrap gap-10 p-10">
        <div className="w-full tablet2:w-[45%] pt-20 ">
          <img
            src="https://res.cloudinary.com/dort5nnis/image/upload/v1742982075/portrait-smiling-senior-businessman-library_yyt0ek.jpg"
            className="w-full h-full object-contain rounded-lg shadow-[0_0_40px_25px_rgba(96,165,250,0.1)]"
          />
        </div>
        <div className="w-full tablet2:w-[45%] flex justify-center items-center flex-col gap-10">
          <div className="flex flex-col">
            <Paragraph_1
              data1={para7_1[0]}
              data2={para7_1[1]}
              container="true"
            />
            <Paragraph_2 data={para7_2} container="true" />
          </div>
          <div onClick={()=>{navigate('/register')}}><Button data="Start teaching today" color="red" /></div>
          
        </div>
      </div>
    </div>
  );
};

export default InstructorSection;
