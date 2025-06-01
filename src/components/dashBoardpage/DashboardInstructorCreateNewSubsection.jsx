import React, { useState, useRef, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { apiConnector } from "../../services/apiConnector";
import { apiLinks } from "../../services/apiLink";
import { IoSend } from "react-icons/io5";
import { FaRegFileVideo, FaTimes, FaRegEdit, FaCheck } from "react-icons/fa";
import { MdDelete, MdCancel } from "react-icons/md";

const DashboardInstructorCreateNewSubsection = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const sectionId = searchParams.get("section_id");
  const [subsections, setSubsections] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // For new subsection creation
  const [newSubsection, setNewSubsection] = useState({
    sectionId,
    title: "",
    timeDuration: "",
    description: "",
  });

  // For editing existing subsection
  const [editingSubsectionId, setEditingSubsectionId] = useState(null);
  const [editedSubsection, setEditedSubsection] = useState({
    title: "",
    timeDuration: "",
    description: "",
  });

  const [videoFile, setVideoFile] = useState(null);
  const [videoPreview, setVideoPreview] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [fileName, setFileName] = useState("");
  const fileInputRef = useRef(null);

  // Fetch all subsections
  const fetchAllSubsections = async () => {
    try {
      const response = await apiConnector(
        "GET",
        apiLinks.getAllSubsections + `/${sectionId}`
      );
      if (response.data) {
        console.log(response.data.subSection);
        setSubsections(response.data.subSection);
      } else {
        setSubsections([]);
      }
    } catch (error) {
      console.error("Error fetching subsections:", error);
      toast.error("Failed to fetch subsections");
    }
  };

  useEffect(() => {
    fetchAllSubsections();
  }, [sectionId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewSubsection((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditedSubsection((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleVideoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.includes("video/mp4")) {
        toast.error("Only MP4 videos are allowed", {
          autoClose: 900,
          hideProgressBar: true,
        });
        return;
      }

      if (file.size > 100 * 1024 * 1024) {
        toast.error("Video file size must be less than 100MB", {
          autoClose: 900,
          hideProgressBar: true,
        });
        return;
      }

      setVideoFile(file);
      setFileName(file.name);
      setVideoPreview(URL.createObjectURL(file));
    }
  };

  const cancelVideoUpload = () => {
    if (videoPreview) URL.revokeObjectURL(videoPreview);
    setVideoFile(null);
    setVideoPreview(null);
    setFileName("");
    setUploadProgress(0);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // Start editing a subsection
  const startEditing = (subsection) => {
    setEditingSubsectionId(subsection._id);
    setEditedSubsection({
      title: subsection.title,
      timeDuration: subsection.timeDuration,
      description: subsection.description,
    });
  };

  // Cancel editing
  const cancelEditing = () => {
    setEditingSubsectionId(null);
    setEditedSubsection({
      title: "",
      timeDuration: "",
      description: "",
    });
  };

  // Create new subsection
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !newSubsection.title.trim() ||
      !newSubsection.description.trim() ||
      !videoFile
    ) {
      toast.error("Please fill in all required fields", {
        autoClose: 900,
        hideProgressBar: true,
      });
      return;
    }

    try {
      setIsSubmitting(true);
      const formData = new FormData();
      formData.append("uploadedVideoFile", videoFile);
      formData.append("title", newSubsection.title);
      formData.append("timeDuration", newSubsection.timeDuration);
      formData.append("description", newSubsection.description);
      formData.append("sectionId", sectionId);

      const response = await apiConnector(
        "POST",
        apiLinks.createSubSection,
        null,
        formData
      );

      if (!response.success) {
        throw new Error("Unable to create subsection");
      }

      toast.success("Subsection created successfully", {
        autoClose: 900,
        hideProgressBar: true,
      });

      // Refresh the list
      await fetchAllSubsections();

      // Reset form
      setNewSubsection({
        sectionId,
        title: "",
        timeDuration: "",
        description: "",
      });
      cancelVideoUpload();
    } catch (error) {
      console.error("Error:", error);
      toast.error(error.message || "Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Update existing subsection
  const handleUpdate = async (subsectionId) => {
    try {
      setIsSubmitting(true);
      const data = {
        subSectionId: subsectionId,
        title: editedSubsection.title,
        timeDuration: editedSubsection.timeDuration,
        description: editedSubsection.description,
      };
      console.log(editedSubsection);
      const response = await apiConnector(
        "PATCH",
        apiLinks.updateSubSection,
        null,
        data
      );

      console.log(response);

      if (!response.success) {
        toast.error("failed to update the subsection", {
          autoClose: 900,
          hideProgressBar: true,
          pauseOnHover: false,
          closeOnClick: true,
          draggable: false,
        });
        return;
      }

      subsections.forEach((element) => {
        if (element._id == subsectionId) {
          element.title = data.title || element.title;
          element.timeDuration = data.timeDuration || element.timeDuration;
          element.description = data.description || element.description;
        }
      });

      toast.success("Subsection updated successfully", {
        autoClose: 900,
        hideProgressBar: true,
      });
      cancelEditing();
    } catch (error) {
      console.error("Error:", error);
      toast.error(error.message || "Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Delete subsection
  const deleteSubsection = async (subsectionId) => {
    try {
      setIsSubmitting(true);
      const url =
        apiLinks.deleteSubSection +
        `/${sectionId}?subSectionId=${subsectionId}`;

      const response = await apiConnector("DELETE", url);

      if (!response.success) {
        toast.error("unable to delete subsection", {
          autoClose: 900,
          hideProgressBar: true,
          pauseOnHover: false,
          closeOnClick: true,
          draggable: false,
        });
        return;
      }

      setSubsections(subsections.filter((value) => value._id != subsectionId));
      toast.success("Subsection deleted successfully", {
        autoClose: 900,
        hideProgressBar: true,
        pauseOnHover: false,
        closeOnClick: true,
        draggable: false,
      });
    } catch (error) {
      toast.error(error.message || "Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-2xl font-bold mb-6 text-white">Course Subsections</h1>

      {/* Existing Subsections */}
      <div className="mb-8 w-full">
        <h2 className="text-xl font-semibold mb-4 text-gray-300">
          Existing Subsections
        </h2>
        {subsections.length === 0 ? (
          <div className="p-6 border border-gray-700 rounded-lg text-center">
            <p className="text-gray-400">No subsections created yet</p>
          </div>
        ) : (
          <div className="space-y-4 p-6 w-full bg-black rounded-md max-h-[500px] overflow-y-auto">
            {subsections.map((subsection) => (
              <div
                key={subsection._id}
                className="w-full space-y-4 p-4 border border-gray-700 rounded-lg bg-gray-800"
              >
                {/* Responsive Flex: Text + Video */}
                <div className="flex flex-col md:flex-row gap-6">
                  {/* Text Content */}
                  <div className="flex-1 space-y-4">
                    {/* Title */}
                    <div>
                      <p className="text-sm font-medium underline-offset-2 underline text-gray-400 uppercase tracking-wider">
                        Title
                      </p>
                      {editingSubsectionId === subsection._id ? (
                        <input
                          type="text"
                          name="title"
                          value={editedSubsection.title}
                          onChange={handleEditInputChange}
                          className="w-full mt-2 p-2 bg-gray-700 border  border-gray-600 text-white rounded-md focus:border-2 outline-none"
                        />
                      ) : (
                        <h3 className="text-xl font-bold text-white mt-1">
                          {subsection.title}
                        </h3>
                      )}
                    </div>

                    {/* Duration */}
                    <div>
                      <p className="text-sm font-medium underline-offset-2 underline text-gray-400 uppercase tracking-wider">
                        Duration
                      </p>
                      {editingSubsectionId === subsection._id ? (
                        <input
                          type="text"
                          name="timeDuration"
                          value={editedSubsection.timeDuration}
                          onChange={handleEditInputChange}
                          className="w-full mt-2 p-2 bg-gray-700 border border-gray-600 outline-none text-white rounded-md focus:border-2"
                        />
                      ) : (
                        <p className="text-gray-300 mt-1">
                          {subsection.timeDuration || "No duration specified"}
                        </p>
                      )}
                    </div>

                    {/* Description */}
                    <div>
                      <p className="text-sm font-medium underline-offset-2 underline text-gray-400 uppercase tracking-wider">
                        Description
                      </p>
                      {editingSubsectionId === subsection._id ? (
                        <textarea
                          name="description"
                          value={editedSubsection.description}
                          onChange={handleEditInputChange}
                          className="w-full mt-2 p-2 bg-gray-700 border outline-none border-gray-600 text-white rounded-md focus:border-2"
                          rows="3"
                        />
                      ) : (
                        <p className="text-gray-300 mt-1">
                          {subsection.description || "No description provided"}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Responsive Video */}
                  <div className="w-full md:w-[300px] flex-shrink-0">
                    <p className="text-sm font-medium text-gray-400 uppercase tracking-wider">
                      Video
                    </p>
                    <div className="mt-2 rounded-md overflow-hidden bg-black aspect-video">
                      <video
                        controls
                        className="w-full h-full object-cover"
                        src={subsection.videoUrl}
                      />
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="pt-3 mt-3 border-t border-gray-700 flex justify-end space-x-3">
                  {editingSubsectionId === subsection._id ? (
                    <>
                      <button
                        onClick={cancelEditing}
                        type="button"
                        className="px-3 py-1.5 cursor-pointer text-sm rounded-md bg-orange-900/50 text-orange-400 hover:bg-orange-800/50 flex items-center"
                      >
                        <MdCancel className="mr-2" />
                        Cancel
                      </button>
                      <button
                        onClick={() => handleUpdate(subsection._id)}
                        type="button"
                        disabled={isSubmitting}
                        className="px-3 py-1.5 text-sm rounded-md cursor-pointer bg-green-900/50 text-green-400 hover:bg-green-800/50 flex items-center disabled:opacity-50"
                      >
                        <FaCheck className="mr-2" />
                        Save Changes
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => startEditing(subsection)}
                        type="button"
                        disabled={editingSubsectionId !== null}
                        className={`px-3 py-1.5 text-sm rounded-md bg-blue-900/50 text-blue-400 hover:bg-blue-800/50 flex items-center ${
                          editingSubsectionId !== null
                            ? "opacity-50 cursor-not-allowed"
                            : "cursor-pointer"
                        }`}
                      >
                        <FaRegEdit className="mr-2" />
                        Edit
                      </button>
                      <button
                        onClick={() => deleteSubsection(subsection._id)}
                        type="button"
                        disabled={editingSubsectionId !== null || isSubmitting}
                        className={`px-3 py-1.5 text-sm rounded-md bg-red-900/50 text-red-400 hover:bg-red-800/50 flex items-center ${
                          editingSubsectionId !== null || isSubmitting
                            ? "opacity-50 cursor-not-allowed"
                            : "cursor-pointer"
                        }`}
                      >
                        <MdDelete className="mr-2" />
                        Delete
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Create New Subsection Form */}
      <div className="p-6 border border-gray-700 rounded-lg bg-gray-800">
        <h2 className="text-xl font-semibold mb-4 text-white">
          Create New Subsection
        </h2>
        <form onSubmit={handleSubmit}>
          {/* Title Field */}
          <div className="mb-4">
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-300 mb-1"
            >
              Title <span className="text-red-500 ml-1">*</span>
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={newSubsection.title}
              onChange={handleInputChange}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 text-white rounded-md  outline-none focus:border-2"
              required
              disabled={isSubmitting}
            />
          </div>

          {/* Time Duration Field */}
          <div className="mb-4">
            <label
              htmlFor="timeDuration"
              className="block text-sm font-medium text-gray-300 mb-1"
            >
              Time Duration (e.g., 10:30)
            </label>
            <input
              type="text"
              id="timeDuration"
              name="timeDuration"
              value={newSubsection.timeDuration}
              onChange={handleInputChange}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 text-white rounded-md focus:border-2 outline-none  "
              disabled={isSubmitting}
            />
          </div>

          {/* Description Field */}
          <div className="mb-4">
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-300 mb-1"
            >
              Description <span className="text-red-500 ml-1">*</span>
            </label>
            <textarea
              id="description"
              name="description"
              value={newSubsection.description}
              onChange={handleInputChange}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 text-white rounded-md  focus:border-2 outline-none"
              rows="3"
              required
              disabled={isSubmitting}
            />
          </div>

          {/* Video Upload Field */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Video <span className="text-red-500 ml-1">*</span>
            </label>
            <div
              className={`border-2 border-dashed ${
                videoFile ? "border-green-500" : "border-gray-400"
              } rounded-lg p-6 text-center transition-colors`}
            >
              <div className="flex justify-center items-center flex-col">
                {videoPreview ? (
                  <div className="w-full relative">
                    <div className="relative pt-[56.25%]">
                      <video
                        controls
                        className="absolute inset-0 w-full h-full bg-black rounded-md"
                        src={videoPreview}
                      />
                    </div>
                    <div className="mt-2 flex justify-between items-center">
                      <p className="text-green-400 truncate max-w-[70%]">
                        {fileName}
                      </p>
                      <button
                        type="button"
                        onClick={cancelVideoUpload}
                        className="text-red-500 hover:text-red-400 p-1"
                        title="Remove video"
                      >
                        <FaTimes className="text-lg" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <FaRegFileVideo className="text-[70px] text-gray-600" />
                    <div className="mt-4 flex text-sm text-gray-600">
                      <label
                        htmlFor="video-upload"
                        className="relative cursor-pointer bg-transparent rounded-md font-medium text-red-500 hover:text-blue-500 focus-within:outline-none"
                      >
                        <span>Upload a video file</span>
                        <input
                          id="video-upload"
                          ref={fileInputRef}
                          name="video"
                          type="file"
                          accept="video/mp4"
                          onChange={handleVideoChange}
                          className="sr-only"
                          required
                        />
                      </label>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                      MP4 format only (max 100MB)
                    </p>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="pt-4 flex gap-2 flex-wrap items-center justify-center space-x-3">
            <button
              type="button"
              onClick={() => navigate(-1)}
              disabled={isSubmitting}
              className="px-6 py-2 bg-gray-600 hover:bg-gray-700 text-white font-medium rounded-md transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !videoFile}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-t-transparent border-white rounded-full animate-spin mr-2" />
                  Submitting...
                </>
              ) : (
                <>
                  <IoSend className="mr-2" />
                  Create Subsection
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DashboardInstructorCreateNewSubsection;
