import React, { useEffect, useState, useCallback, memo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RxCross2 } from "react-icons/rx";
import { FaEdit, FaCamera, FaUser, FaEnvelope } from "react-icons/fa";
import { toast } from "react-toastify";
import { apiConnector } from "../../services/apiConnector";
import { apiLinks } from "../../services/apiLink";
import { setProfile, setPersonalData } from "../../redux/slices/profileSlice";
import { MdSecurityUpdateGood } from "react-icons/md";
import { setLoading } from "../../redux/slices/uiSlice";

const DashboardPageMyProfile = () => {
  const dispatch = useDispatch();

  // Selectors with fallbacks
  const { loading } = useSelector((state) => state.ui) || { loading: false };
  const { user, personalData } = useSelector((state) => state.profile) || { user: {}, personalData: {} };

  const [editMyProfile, setEditMyProfile] = useState(false);
  const [editPersonalInfo, setEditPersonalInfo] = useState(false);

  const [updatedProfile, setUpdatedProfile] = useState({
    image: null,
    imageUrl: null,
  });

  const [updatedPersonalnfo, setUpdatedPersonalInfo] = useState({
    firstName: "",
    lastName: "",
    gender: "Male",
    dob: "",
    userName: "",
    about: "",
    profession: "",
  });

  // Sync state with personalData safely
  useEffect(() => {
    if (personalData) {
      setUpdatedPersonalInfo({
        firstName: personalData.firstName || "",
        lastName: personalData.lastName || "",
        gender: personalData.gender || "Male",
        dob: personalData.dob || "",
        userName: personalData.userName || "",
        about: personalData.about || "",
        profession: personalData.profession || "",
      });
    }
  }, [personalData]);

  const updatePersonalHandler = useCallback((event) => {
    const { name, value } = event.target;
    setUpdatedPersonalInfo((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  }, []);

  const updateProfileHandler = useCallback((event) => {
    const file = event.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setUpdatedProfile({
        image: file,
        imageUrl,
      });
    }
  }, []);

  const updateProfileBackendCall = async () => {
    if (!updatedProfile.image) return;
    try {
      dispatch(setLoading(true));
      const formData = new FormData();
      formData.append("profilePicture", updatedProfile.image);

      const response = await apiConnector("PUT", apiLinks.updateProfile, null, formData);

      if (response?.success) {
        toast.success(response.message || "Profile Picture Updated");
        dispatch(setProfile(response.user));
        setEditMyProfile(false);
        setUpdatedProfile({ image: null, imageUrl: null });
      } else {
        throw new Error(response?.message || "Update failed");
      }
    } catch (error) {
      console.error("Profile Update Error:", error);
      toast.error(error.message || "Unable to update profile image");
    } finally {
      dispatch(setLoading(false));
    }
  };

  const updatePersonalDataBackendCall = async (e) => {
    e.preventDefault();
    try {
      dispatch(setLoading(true));
      const response = await apiConnector("PUT", apiLinks.updateProfile, null, updatedPersonalnfo);

      if (response?.success) {
        toast.success(response.message || "Information Updated");
        dispatch(setPersonalData(response.personalData));
        setEditPersonalInfo(false);
      } else {
        throw new Error(response?.message || "Update failed");
      }
    } catch (error) {
      console.error("Personal Data Update Error:", error);
      toast.error(error.message || "Unable to update personal data");
    } finally {
      dispatch(setLoading(false));
    }
  };

  // Prevent rendering if user is missing to avoid crashes
  if (!user) return <div className="text-white p-10">Loading profile...</div>;

  return (
    <div className="w-full max-w-[1400px] mx-auto p-1 flex flex-col min-h-full">
      <h1 className="text-3xl font-black text-gray-100 mb-10 text-center tracking-tight">
        MANAGE <span className="text-red-600 ml-2">PROFILE</span>
      </h1>

      {/* --- Content Wrapper: Matching reference 'flex-1' to unify scroller --- */}
      <div className="flex-1 flex flex-col gap-4 pb-10">
        
        {/* --- Section 1: Top Profile Card --- */}
        <div className="bg-gray-800 border border-gray-700 rounded-2xl p-6 md:p-10 shadow-lg">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex flex-col md:flex-row items-center gap-6 text-center md:text-start">
              {/* Avatar Logic */}
              <div className="relative group">
                <img
                  src={updatedProfile.imageUrl || user?.image}
                  alt="Profile"
                  className="w-24 h-24 md:w-32 md:h-32 rounded-full object-cover border-4 border-gray-700 shadow-xl"
                />
                <label
                  htmlFor="imageFile"
                  className="absolute bottom-1 right-1 bg-red-600 p-2 rounded-full cursor-pointer hover:bg-red-700 transition-colors border-2 border-gray-800"
                  onClick={() => setEditMyProfile(true)}
                >
                  <FaCamera className="text-white text-sm" />
                </label>
                <input type="file" id="imageFile" className="hidden" accept="image/*" onChange={updateProfileHandler} />
              </div>

              <div>
                <h2 className="text-2xl font-semibold text-white flex items-center gap-2">
                  {user?.name || "User Name"}
                </h2>
                <p className="text-gray-400 flex items-center justify-center md:justify-start gap-2">
                  <FaEnvelope className="text-sm" /> {user?.email}
                </p>
                {editMyProfile && updatedProfile.imageUrl && (
                  <div className="mt-4 flex gap-2">
                    <button
                      onClick={updateProfileBackendCall}
                      className="bg-red-600 text-white px-4 py-1.5 rounded-lg text-sm font-medium hover:bg-red-700 transition-all flex items-center gap-2"
                    >
                      {loading ? "..." : "Save Image"}
                    </button>
                    <button
                      onClick={() => { setUpdatedProfile({ image: null, imageUrl: null }); setEditMyProfile(false); }}
                      className="bg-gray-700 text-white px-4 py-1.5 rounded-lg text-sm font-medium hover:bg-gray-600"
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </div>
            </div>

            {!editMyProfile && (
              <button
                onClick={() => setEditMyProfile(true)}
                className="flex items-center gap-2 bg-gray-700 hover:bg-gray-600 text-white px-5 py-2.5 rounded-xl transition-all border border-gray-600"
              >
                <FaEdit /> Edit Photo
              </button>
            )}
          </div>
        </div>

        {/* --- Section 2: Personal Details Card --- */}
        <div className="bg-gray-800 border border-gray-700 rounded-2xl p-6 md:p-10 shadow-lg">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-semibold text-white flex items-center gap-2">
              <FaUser className="text-red-500" /> Personal Information
            </h3>
            {!editPersonalInfo && (
              <button
                onClick={() => setEditPersonalInfo(true)}
                className="flex items-center gap-2 text-red-500 hover:text-red-400 font-medium transition-all"
              >
                <FaEdit /> Edit
              </button>
            )}
          </div>

          {editPersonalInfo ? (
            <form onSubmit={updatePersonalDataBackendCall} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  { label: "First Name", name: "firstName", type: "text" },
                  { label: "Last Name", name: "lastName", type: "text" },
                  { label: "Username", name: "userName", type: "text" },
                  { label: "Profession", name: "profession", type: "text" },
                  { label: "Date of Birth", name: "dob", type: "text", placeholder: "DD-MM-YYYY" },
                ].map((field) => (
                  <div key={field.name} className="flex flex-col gap-2">
                    <label className="text-gray-400 text-sm ml-1">{field.label}</label>
                    <input
                      name={field.name}
                      type={field.type}
                      placeholder={field.placeholder}
                      value={updatedPersonalnfo[field.name]}
                      onChange={updatePersonalHandler}
                      className="bg-gray-900 text-white rounded-xl p-3 border border-gray-700 outline-none focus:border-red-500 transition-all"
                    />
                  </div>
                ))}
                <div className="flex flex-col gap-2">
                  <label className="text-gray-400 text-sm ml-1">Gender</label>
                  <select
                    name="gender"
                    value={updatedPersonalnfo.gender}
                    onChange={updatePersonalHandler}
                    className="bg-gray-900 text-white rounded-xl p-3 border border-gray-700 outline-none focus:border-red-500 appearance-none"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-gray-400 text-sm ml-1">About (Bio)</label>
                <textarea
                  name="about"
                  value={updatedPersonalnfo.about}
                  onChange={updatePersonalHandler}
                  rows={4}
                  className="bg-gray-900 text-white rounded-xl p-3 border border-gray-700 outline-none focus:border-red-500 resize-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setEditPersonalInfo(false)}
                  className="px-6 py-2.5 rounded-xl text-gray-400 hover:text-white transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-red-600 hover:bg-red-700 text-white px-8 py-2.5 rounded-xl font-semibold shadow-lg shadow-red-900/20 transition-all disabled:opacity-50"
                >
                  {loading ? "Saving..." : "Update Profile"}
                </button>
              </div>
            </form>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-8 gap-x-12">
              {[
                { label: "First Name", value: personalData?.firstName },
                { label: "Last Name", value: personalData?.lastName },
                { label: "Username", value: personalData?.userName },
                { label: "Profession", value: personalData?.profession },
                { label: "Date of Birth", value: personalData?.dob },
                { label: "Gender", value: personalData?.gender },
              ].map((item, idx) => (
                <div key={idx} className="border-b border-gray-700 pb-2">
                  <p className="text-gray-500 text-xs uppercase tracking-wider mb-1">{item.label}</p>
                  <p className="text-white font-medium text-lg">{item.value || "---"}</p>
                </div>
              ))}
              <div className="md:col-span-2">
                <p className="text-gray-500 text-xs uppercase tracking-wider mb-1">About</p>
                <p className="text-gray-300 leading-relaxed italic">
                  {personalData?.about || "No biography provided yet."}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default memo(DashboardPageMyProfile);