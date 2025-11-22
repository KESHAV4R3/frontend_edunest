import React from "react";
import UserCard from "./UserCard";
import { useSelector } from "react-redux";

const DashboardPageInstructorAdmin = () => {
  const allInstructors = useSelector((state) => state.profile.allInstructors);

  return (
    <div className="overflow-hidden mt-10 w-[96%] m-auto mb-10 tablet2:w-full">
      <div className="w-[90%] m-auto flex flex-wrap justify-center items-center gap-5">
        {allInstructors.length > 0 ? (
          allInstructors.map((value, index) => {
            const Instructor = {
              name: value.firstName + " " + value.lastName,
              email: value.email,
              image: value.image,
              dob: value.profile.dob,
              username: value.profile.userName,
              gender: value.profile.gender,
              profession: value.profile.profession,
              about: value.profile.about.substring(0, 15),
              id: value._id,
            };
            return (
              <UserCard user={Instructor} type={"Instructor"} key={index} />
            );
          })
        ) : (
          // 📢 No Data Found Message
          <p className="text-gray-300 text-center mt-5">
            No Instructor data is available.
          </p>
        )}
      </div>
    </div>
  );
};

export default React.memo(DashboardPageInstructorAdmin);
