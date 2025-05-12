import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RxCross2 } from "react-icons/rx";
import { FaEdit } from "react-icons/fa";
import { toast } from "react-toastify";
import { apiConnector } from "../../services/apiConnector";
import { apiLinks } from "../../services/apiLink";
import { setProfile, setPersonalData } from "../../redux/slices/profileSlice";
import { MdSecurityUpdateGood } from "react-icons/md";

const DashboardPageMyProfile = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [personalLoading, setPersonalLoading] = useState(false);
  const [editMyProfile, setEditMyProfile] = useState(false);
  const [editPersonalInfo, setEditPersonalInfo] = useState(false);
  const { user, personalData } = useSelector((state) => state.profile);
  const [updatedProfile, setUpdatedProfile] = useState({
    image: null,
    imageUrl: null,
  });
  const [updatedPersonalnfo, setUpdatedPersonalInfo] = useState({
    firstName: personalData?.firstName || "",
    lastName: personalData?.lastName || "",
    gender: personalData?.gender || "Male",
    dob: personalData?.dob || "",
    userName: personalData?.userName || "",
    about: personalData?.about || "",
    profession: personalData?.profession || "",
  });

  useEffect(() => {
    setUpdatedPersonalInfo({
      firstName: personalData?.firstName || "",
      lastName: personalData?.lastName || "",
      gender: personalData?.gender || "Male",
      dob: personalData?.dob || "",
      userName: personalData?.userName || "",
      about: personalData?.about || "",
      profession: personalData?.profession || "",
    });
  }, [personalData]);

  const updatePersonalHandler = (event) => {
    setUpdatedPersonalInfo((prevData) => ({
      ...prevData,
      [event.target.name]: event.target.value,
    }));
  };

  const updateProfileHandler = (event) => {
    const file = event.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setUpdatedProfile({
        image: file,
        imageUrl,
      });
    }
  };

  const updateProfileBackendCall = async () => {
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("profilePicture", updatedProfile.image);

      const response = await apiConnector(
        "PUT",
        apiLinks.updateProfile,
        null,
        formData
      );

      if (response.success) {
        console.log(response.user);
        toast.success(response.message, {
          autoClose: 900,
          hideProgressBar: true,
          pauseOnHover: false,
          closeOnClick: true,
          draggable: false,
        });
        dispatch(setProfile(response.user));
        // setUpdatedProfile({ image: null, imageUrl: null });
        setEditMyProfile(false);
      }
    } catch (error) {
      toast.error("unable to update data", {
        autoClose: 900,
        hideProgressBar: true,
        pauseOnHover: false,
        closeOnClick: true,
        draggable: false,
      });
    } finally {
      setLoading(false);
    }
  };

  const updatePersonalDataBackendCall = async () => {
    try {
      setPersonalLoading(true);
      const response = await apiConnector(
        "PUT",
        apiLinks.updateProfile,
        null,
        updatedPersonalnfo
      );

      if (response.success) {
        toast.success(response.message, {
          autoClose: 900,
          hideProgressBar: true,
          pauseOnHover: false,
          closeOnClick: true,
          draggable: false,
        });
        dispatch(setPersonalData(response.personalData));
        setEditPersonalInfo(false);
      }
    } catch (error) {
      toast.error("unable to update data", {
        autoClose: 900,
        hideProgressBar: true,
        pauseOnHover: false,
        closeOnClick: true,
        draggable: false,
      });
    } finally {
      setPersonalLoading(false);
    }
  };

  return (
    <div className="w-[96%] m-auto md:w-[90%] mt-10">
      <p className="text-4xl font-[600] text-gray-300 w-full md:w-[90%] text-center md:text-start mb-5 m-auto">
        My Profile ( {user.accountType} )
      </p>

      {/* profile */}
      {editMyProfile ? (
        // display my profile
        <div className="bg-gray-800 relative flex flex-col tablet2:flex-row justify-between p-5 gap-5 items-start tablet2:items-center w-full tablet2:w-[90%] m-auto md:p-10 rounded-lg">
          {/* Close Icon */}
          <div
            className="absolute top-3 right-3 cursor-pointer text-gray-400 text-[20px] hover:text-white"
            onClick={() => setEditMyProfile(false)}
          >
            <RxCross2 />
          </div>

          {/* File Upload Label and Input */}
          <div className="flex flex-col gap-2 items-start w-full tablet2:w-[30%]">
            <label
              htmlFor="imageFile"
              className="text-[18px] text-blue-400 hover:text-blue-600 cursor-pointer"
            >
              Choose your image
            </label>
            <input
              type="file"
              name="image"
              id="imageFile"
              accept="image/*"
              className="sr-only"
              onChange={updateProfileHandler}
            />
          </div>

          {/* Preview and Action Buttons */}
          {updatedProfile.imageUrl && (
            <div className="flex flex-col tablet2:flex-row justify-center items-center gap-5 w-full tablet2:w-[65%]">
              {/* Image Preview */}
              <img
                src={updatedProfile.imageUrl}
                alt="preview"
                className="w-[100px] h-[70px] object-cover rounded-md shadow-md"
              />

              {/* Remove Image Button */}
              {!loading && (
                <button
                  onClick={() =>
                    setUpdatedProfile((prevData) => ({
                      ...prevData,
                      image: null,
                      imageUrl: null,
                    }))
                  }
                  className="bg-dark_red cursor-pointer text-white font-semibold p-3 rounded-lg hover:bg-dark_red/80 transition-all duration-300 flex items-center justify-center"
                >
                  <RxCross2 className="text-[22px]" />
                </button>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                onClick={updateProfileBackendCall}
                disabled={loading}
                className="mt-3 tablet2:mt-0 w-full tablet2:w-auto flex justify-center items-center py-2 px-5 bg-dark_red hover:bg-dark_red/80 cursor-pointer text-white font-medium rounded-md transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <>
                    <MdSecurityUpdateGood className="mr-2" />
                    Update
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="bg-gray-800 flex flex-col tablet2:flex-row tablet2:justify-between gap-5 tablet2:items-center w-full tablet2:w-[90%] m-auto tablet2:p-10 p-5 rounded-lg">
          {/* Profile Info and Edit Button in a flex column for smaller screens */}
          <div className="w-full flex flex-col tablet2:flex-row justify-between items-start tablet2:items-center gap-5">
            {/* Profile Info */}
            <div className="flex gap-5 items-center w-full">
              <img
                src={user.image}
                alt="user_img"
                className="rounded-full w-[80px] h-[80px]"
              />
              <div className="flex flex-col">
                <p className="text-[20px] md:text-[25px]">{user.name}</p>
                <p className="text-[14px] md:text-[16px] text-gray-400">
                  {user.email}
                </p>
              </div>
            </div>

            {/* Edit Button */}
            <div
              onClick={() => {
                setEditMyProfile(true);
              }}
              className="flex justify-center items-center gap-2 mt-4 tablet2:mt-0 tablet2:ml-auto rounded-lg w-full tablet2:w-auto h-[45px] cursor-pointer bg-dark_red hover:bg-red-600 px-4"
            >
              <FaEdit className="text-[16px]" />
              <p className="text-[16px]">Edit</p>
            </div>
          </div>
        </div>
      )}

      {/* personal detail */}
      {editPersonalInfo ? (
        <div className="relative bg-gray-800 mt-10 rounded-lg w-full md:w-[90%] mx-auto p-4 md:p-6 mb-10">
          <div
            className="absolute top-3 right-3 cursor-pointer text-gray-400 text-[17px] hover:text-white"
            onClick={() => {
              setEditPersonalInfo(false);
            }}
          >
            <RxCross2 className=" text-[17px]" />
          </div>
          <form className="grid grid-cols-1 mt-5 md:grid-cols-2 gap-4 mb-6">
            {/* Column 1 */}
            <div className="space-y-4">
              <div className="bg-gray-700 p-4 rounded-lg">
                <p className="text-gray-400 text-[17px] mb-1">First Name</p>
                <input
                  name="firstName"
                  onChange={updatePersonalHandler}
                  value={updatedPersonalnfo.firstName}
                  type="text"
                  placeholder="Enter first name"
                  className="outline rounded-lg p-2 w-full outline-gray-900"
                />
              </div>

              <div className="bg-gray-700 p-4 rounded-lg">
                <p className="text-gray-400 text-[17px] mb-1">Date of Birth</p>
                <input
                  name="dob"
                  onChange={updatePersonalHandler}
                  value={updatedPersonalnfo.dob}
                  type="text"
                  placeholder="Enter DOB (DD-MM-YYYY)"
                  className="outline rounded-lg p-2 w-full outline-gray-900"
                />
              </div>

              <div className="bg-gray-700 p-4 rounded-lg">
                <p className="text-gray-400 text-[17px] mb-1">Gender</p>
                <select
                  name="gender"
                  onChange={updatePersonalHandler}
                  value={updatedPersonalnfo.gender}
                  className="outline rounded-lg p-2 w-full outline-gray-900 bg-transparent"
                >
                  <option value="Male" className="bg-transparent text-gray-800">
                    Male
                  </option>
                  <option
                    value="Female"
                    className="bg-transparent text-gray-800"
                  >
                    Female
                  </option>
                </select>
              </div>
            </div>

            {/* Column 2 */}
            <div className="space-y-4">
              <div className="bg-gray-700 p-4 rounded-lg">
                <p className="text-gray-400 text-[17px] mb-1">Last Name</p>
                <input
                  name="lastName"
                  onChange={updatePersonalHandler}
                  value={updatedPersonalnfo.lastName}
                  type="text"
                  placeholder="Enter last name"
                  className="outline rounded-lg p-2 w-full outline-gray-900"
                />
              </div>

              <div className="bg-gray-700 p-4 rounded-lg">
                <p className="text-gray-400 text-[17px] mb-1">Username</p>
                <input
                  name="userName"
                  onChange={updatePersonalHandler}
                  value={updatedPersonalnfo.userName}
                  type="text"
                  placeholder="Enter Username"
                  className="outline rounded-lg p-2 w-full outline-gray-900"
                />
              </div>

              <div className="bg-gray-700 p-4 rounded-lg">
                <p className="text-gray-400 text-[17px] mb-1">Profession</p>
                <input
                  name="profession"
                  onChange={updatePersonalHandler}
                  value={updatedPersonalnfo.profession}
                  type="text"
                  placeholder="Enter Profession"
                  className="outline rounded-lg p-2 w-full outline-gray-900"
                />
              </div>
            </div>
          </form>

          <div className="bg-gray-700 p-4 rounded-lg w-full mb-5">
            <p className="text-gray-400 text-[17px] mb-1">About</p>
            <textarea
              name="about"
              onChange={updatePersonalHandler}
              value={updatedPersonalnfo.about}
              type="text"
              placeholder="About (Bio)"
              className="outline rounded-lg p-2 w-full outline-gray-900"
            />
          </div>

          {/* Edit Button - Centered and full width on mobile, auto width on desktop */}
          <div className="flex justify-center">
            <button
              type="submit"
              onClick={updatePersonalDataBackendCall}
              disabled={personalLoading}
              className="flex justify-center items-center gap-2 bg-dark_red cursor-pointer text-white font-semibold p-3 rounded-lg hover:bg-dark_red/80 transition-all duration-300 disabled:opacity-50"
            >
              {personalLoading ? (
                <div className="w-5 h-5 border-4 border-gray-300 border-t-dark_red rounded-full animate-spin"></div>
              ) : (
                "Update Profile"
              )}
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-gray-800 mt-10 rounded-lg w-full md:w-[90%] mx-auto p-4 md:p-6 mb-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {/* Column 1 */}
            <div className="space-y-4">
              <div className="bg-gray-700 p-4 rounded-lg">
                <p className="text-gray-400 text-[17px] mb-1">First Name</p>
                <p className="font-medium text-[19px] text-white">
                  {personalData.firstName || "---"}
                </p>
              </div>

              <div className="bg-gray-700 p-4 rounded-lg">
                <p className="text-gray-400 text-[17px] mb-1">Date of Birth</p>
                <p className="font-medium text-[19px] text-white">
                  {personalData.dob || "---"}
                </p>
              </div>

              <div className="bg-gray-700 p-4 rounded-lg">
                <p className="text-gray-400 text-[17px] mb-1">Gender</p>
                <p className="font-medium text-[19px] text-white">
                  {personalData.gender || "---"}
                </p>
              </div>
            </div>

            {/* Column 2 */}
            <div className="space-y-4">
              <div className="bg-gray-700 p-4 rounded-lg">
                <p className="text-gray-400 text-[17px] mb-1">Last Name</p>
                <p className="font-medium text-[19px] text-white">
                  {personalData.lastName || "---"}
                </p>
              </div>

              <div className="bg-gray-700 p-4 rounded-lg">
                <p className="text-gray-400 text-[17px] mb-1">Username</p>
                <p className="font-medium text-[19px] text-white">
                  {personalData.userName || "---"}
                </p>
              </div>

              <div className="bg-gray-700 p-4 rounded-lg">
                <p className="text-gray-400 text-[17px] mb-1">Profession</p>
                <p className="font-medium text-[19px] text-white">
                  {personalData.profession || "---"}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-gray-700 p-4 rounded-lg w-full mb-5">
            <p className="text-gray-400 text-[17px] mb-1">About</p>
            <p className="font-medium text-[19px] text-white">
              {personalData.about || "---"}
            </p>
          </div>

          {/* Edit Button - Centered and full width on mobile, auto width on desktop */}
          <div className="flex justify-center">
            <button
              onClick={() => {
                setEditPersonalInfo(true);
              }}
              className="flex cursor-pointer items-center justify-center gap-2 rounded-lg w-full md:w-auto px-6 py-3 bg-red-600 hover:bg-red-700 transition-colors"
            >
              <FaEdit className="text-lg" />
              <span className="text-lg">Edit Profile</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardPageMyProfile;
