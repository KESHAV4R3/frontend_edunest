import React, { useState } from "react";
import { MdDelete } from "react-icons/md";
import { apiConnector } from "../../services/apiConnector";
import { apiLinks } from "../../services/apiLink";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  setAllStudents,
  setAllInstructors,
} from "../../redux/slices/profileSlice";
import { useSelector } from "react-redux";
const UserCard = ({ user, type }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const { allStudents, allInstructors } = useSelector((state) => state.profile);
  const [messageToUser, setMessageToUser] = useState(false);

  // Click handler
  async function clickHandler(event) {
    setLoading(true);
    try {
      const url = apiLinks.deleteAccountByAdmin + `/${user.id}`;
      const response = await apiConnector("DELETE", url);
      if (!response.success) {
        toast.error("unable to delete user", {
          autoClose: 900,
          hideProgressBar: true,
          pauseOnHover: false,
          closeOnClick: true,
          draggable: false,
        });
        return;
      } else {
        toast.success("User deleted successfully", {
          autoClose: 900,
          hideProgressBar: true,
          pauseOnHover: false,
          closeOnClick: true,
          draggable: false,
        });

        // filter the display data
        if (type == "Student") {
          // update the allStudents data
          const filterStudent = allStudents.filter(
            (value) => value._id != user.id
          );
          dispatch(setAllStudents(filterStudent));
        }

        // filter the display data
        if (type == "Instructor") {
          // update the allInstructors data
          const filterInstructor = allInstructors.filter(
            (value) => value._id != user.id
          );
          dispatch(setAllInstructors(filterInstructor));
        }
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  // send mail to user function
  function sendmailToUser() {
    const data = {
      name: user.name,
      email: user.email,
    };
    localStorage.setItem("MailUserData", JSON.stringify(data));
    navigate(`/dashboard/message-from-user`);
  }

  return (
    <div className="w-[400px] bg-gray-800 rounded-lg shadow-md overflow-hidden p-6 border border-gray-700 hover:border-indigo-400 transition-all duration-300 hover:shadow-lg hover:shadow-indigo-900/20">
      <div className="relative flex flex-col gap-6">
        {/* Delete Button */}

        <button
          disabled={loading}
          onClick={clickHandler}
          className="cursor-pointer absolute right-0 top-0 bg-red-600 hover:bg-red-700 rounded-full w-8 h-8 flex justify-center items-center transition-colors duration-200 disabled:cursor-not-allowed"
          title="Delete user"
        >
          {loading ? (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          ) : (
            <MdDelete className="text-lg text-white" />
          )}
        </button>

        {/* Profile Section */}
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <img
              className="h-20 w-20 rounded-full object-cover border-2 border-indigo-400 shadow-md"
              src={user.image}
              alt={user.name}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "https://via.placeholder.com/100";
              }}
            />
          </div>
          <h3 className="text-xl font-bold text-gray-100 text-center">
            {user.name}
          </h3>
        </div>

        {/* User Details */}
        <div className="space-y-4 text-center">
          {/* Username */}
          <div className="space-y-1 bg-gray-700 p-1 rounded-md">
            <p className="text-[17px] underline underline-offset-4 text-gray-400 uppercase tracking-wider">
              Username
            </p>
            <p className="text-gray-100 font-medium">
              {user.username ? user.username : "N/A"}
            </p>
          </div>

          {/* Gender */}
          <div className="space-y-1 bg-gray-700 p-1 rounded-md">
            <p className="text-[17px] underline underline-offset-4 text-gray-400 uppercase tracking-wider">
              Gender
            </p>
            <p className="text-gray-100 font-medium">
              {user.gender ? user.gender : "N/A"}
            </p>
          </div>

          {/* Email */}
          <div className="space-y-1 bg-gray-700 p-1 rounded-md">
            <p className="text-[17px] underline underline-offset-4 text-gray-400 uppercase tracking-wider">
              Email
            </p>
            <p className="text-gray-100 font-medium break-all">{user.email}</p>
          </div>

          <div
            className="space-y-1 bg-gray-700 p-1 rounded-md cursor-pointer"
            onClick={sendmailToUser}
          >
            <p className="text-gray-100 text-[17px] font-medium break-all p-2">
              Message to user
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserCard;
