import React, { useState } from "react";
import { useSelector } from "react-redux";
import { IoSend } from "react-icons/io5";
import { MdDelete } from "react-icons/md";
import { BiImageAdd } from "react-icons/bi";
import { apiConnector } from "../../services/apiConnector";
import { apiLinks } from "../../services/apiLink";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const DashboardInstructorCreateNewCourse = () => {
  const navigate = useNavigate();
  const catagories = useSelector((state) => state.application.catagories);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    language: "English",
    categoryId: "",
    price: "",
    thumbnail: null,
  });

  const [learningPoints, setLearningPoints] = useState([]);
  const [currentPoint, setCurrentPoint] = useState("");
  const [preview, setPreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const languages = [
    "English",
    "Hindi",
    "Spanish",
    "French",
    "German",
    "Japanese",
    "Other",
  ];

  // Add a new learning point
  const addLearningPoint = (data) => {
    if (data.trim()) {
      setLearningPoints([...learningPoints, data.trim()]);
      setCurrentPoint("");
    }
  };

  // Remove a learning point
  const removeLearningPoint = (index) => {
    const updatedPoints = [...learningPoints];
    updatedPoints.splice(index, 1);
    setLearningPoints(updatedPoints);
  };

  // Update an existing learning point
  const updateLearningPoint = (index, value) => {
    const updatedPoints = [...learningPoints];
    updatedPoints[index] = value;
    setLearningPoints(updatedPoints);
  };

  // form field update handler
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleThumbnailChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Check file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size limit is up to 5MB", {
        autoClose: 900,
        hideProgressBar: true,
        pauseOnHover: false,
        closeOnClick: true,
        draggable: false,
      });
      return;
    }

    // Check file format
    const allowedFormats = [
      "image/png",
      "image/jpeg",
      "image/jpg",
      "image/gif",
    ];
    if (!allowedFormats.includes(file.type.toLowerCase())) {
      toast.error("Only PNG, JPG, and GIF formats are allowed", {
        autoClose: 900,
        hideProgressBar: true,
        pauseOnHover: false,
        closeOnClick: true,
        draggable: false,
      });
      return;
    }

    setFormData((prev) => ({ ...prev, thumbnail: file }));
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const data = new FormData();

      // create a data to send overe the backend
      data.append("name", formData.name);
      data.append("description", formData.description);
      data.append("language", formData.language);
      data.append("whatYouWillLearn", JSON.stringify(learningPoints));
      data.append("price", formData.price);
      data.append("categoryId", formData.categoryId);
      data.append("thumbnailImg", formData.thumbnail);

      const response = await apiConnector(
        "POST",
        apiLinks.createCourse,
        null,
        data
      );

      if (!response.success) {
        toast.error("unable to create course", {
          autoClose: 900,
          hideProgressBar: true,
          pauseOnHover: false,
          closeOnClick: true,
          draggable: false,
        });
        return;
      }
      toast.success("Course created successfully", {
        autoClose: 900,
        hideProgressBar: true,
        pauseOnHover: false,
        closeOnClick: true,
        draggable: false,
      });
      navigate(`/dashboard/create-new-section/${response.course_id}`);
      return;
    } catch (error) {
      toast.success("Something went wrong", {
        autoClose: 900,
        hideProgressBar: true,
        pauseOnHover: false,
        closeOnClick: true,
        draggable: false,
      });
    } finally {
      setSubmitSuccess(true);
      setFormData({
        name: "",
        description: "",
        language: "English",
        price: "",
        thumbnail: null,
        category: "",
      });
      setLearningPoints([]);
      setCurrentPoint("");
      setPreview(null);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mb-10 mt-10 mx-auto p-6 bg-gray-800 shadow-lg rounded-lg">
      <h2 className="text-3xl font-bold mb-6 text-gray-800 dark:text-white">
        Create a New Course
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Course Name */}
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            Course Title
            <span className="text-red-500 ml-1">*</span>
          </label>
          <input
            type="text"
            id="name"
            name="name"
            placeholder="e.g., Advanced React Development"
            value={formData.name}
            onChange={handleChange}
            className={`w-full px-4 py-2 outline-none border rounded-lg focus:ring-1 focus:ring-gray-500 focus:border-gray-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white `}
            required
          />
        </div>

        {/* Course Description */}
        <div>
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            Description
            <span className="text-red-500 ml-1">*</span>
          </label>
          <textarea
            id="description"
            name="description"
            placeholder="Describe what your course is about in detail..."
            value={formData.description}
            onChange={handleChange}
            rows={5}
            className={`w-full px-4 py-2 outline-none border rounded-lg focus:ring-1 focus:ring-gray-500 focus:border-gray-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white `}
            required
          />
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            Minimum 50 characters. {formData.description.length}/50
          </p>
        </div>

        {/* Language and Category */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label
              htmlFor="language"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Language
              <span className="text-red-500 ml-1">*</span>
            </label>
            <select
              id="language"
              name="language"
              value={formData.language}
              onChange={handleChange}
              className="w-full px-4 cursor-pointer py-2 outline-none border rounded-lg focus:ring-1 focus:ring-gray-500 focus:border-gray-500   dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            >
              {languages.map((lang) => (
                <option key={lang} value={lang}>
                  {lang}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <label
              htmlFor="category"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Category
              <span className="text-red-500 ml-1">*</span>
            </label>
            <select
              id="category"
              name="categoryId"
              value={formData.categoryId}
              onChange={handleChange}
              className={`w-full px-4 py-2 cursor-pointer outline-none border rounded-lg focus:ring-1 focus:ring-gray-500 focus:border-gray-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white `}
              required
            >
              <option value="" disabled className="text-gray-400">
                Select a category
              </option>
              {catagories?.map((category) => (
                <option
                  key={category._id}
                  value={category._id}
                  className="text-gray-900 dark:text-white"
                >
                  {category.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* What You'll Learn - Enhanced List Version */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            What will students learn?
            <span className="text-red-500 ml-1">*</span>
          </label>

          {/* Only render inputs for existing learning points */}
          <div className="space-y-2 mb-3">
            {learningPoints.map((point, index) => (
              <div key={index} className="flex items-center gap-2">
                <span className="text-gray-500 dark:text-gray-400">
                  {index + 1}.
                </span>
                <input
                  type="text"
                  value={point}
                  onChange={(e) => updateLearningPoint(index, e.target.value)}
                  className={`flex-1 px-3 py-2 outline-none border rounded-lg focus:ring-1 focus:ring-gray-500 focus:border-gray-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white `}
                  placeholder={`Learning point ${index + 1}`}
                />
                <button
                  type="button"
                  onClick={() => removeLearningPoint(index)}
                  className="p-2 cursor-pointer text-red-500 hover:text-red-700"
                  aria-label="Remove learning point"
                >
                  <MdDelete className="text-[20px]" />
                </button>
              </div>
            ))}
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              value={currentPoint}
              onChange={(e) => setCurrentPoint(e.target.value)}
              className="flex-1 px-3 py-2 border-gray-300 outline-none border rounded-lg focus:ring-1 focus:ring-gray-500 focus:border-gray-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              placeholder="Add a new learning point"
            />
            <button
              type="button"
              onClick={() => {
                addLearningPoint(currentPoint);
              }}
              className="px-4 py-2 cursor-pointer bg-dark_red hover:bg-dark_red/80 text-white rounded-lg transition-colors"
            >
              Add Point
            </button>
          </div>
        </div>

        {/* Price */}
        <div className="w-1/2">
          <label
            htmlFor="price"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            Price (INR)
            <span className="text-red-500 ml-1">*</span>
          </label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
              ₹
            </span>
            <input
              type="number"
              id="price"
              name="price"
              placeholder="1999"
              min="0"
              step="1"
              value={formData.price}
              onChange={handleChange}
              className={`w-full pl-8 pr-4 py-2 outline-none border rounded-lg focus:ring-1 focus:ring-gray-500 focus:border-gray-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white `}
              required
            />
          </div>
        </div>

        {/* Thumbnail Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Course Thumbnail
            <span className="text-red-500 ml-1">*</span>
          </label>
          <div
            className={`border-2 border-dashed border-gray-400 rounded-lg p-6 text-center`}
          >
            {preview ? (
              <div className="flex flex-col items-center">
                <img
                  src={preview}
                  alt="Thumbnail Preview"
                  className="w-48 h-32 object-cover rounded mb-4"
                />
                <button
                  type="button"
                  onClick={() => {
                    setPreview(null);
                    setFormData((prev) => ({ ...prev, thumbnail: null }));
                  }}
                  className="text-sm text-red-600 hover:text-red-700 cursor-pointer"
                >
                  Remove Image
                </button>
              </div>
            ) : (
              <div className="flex justify-center items-center flex-col">
                <BiImageAdd className="text-[70px] text-gray-600" />
                <div className="mt-4 flex text-sm text-gray-600 dark:text-gray-400">
                  <label
                    htmlFor="thumbnail-upload"
                    className="relative cursor-pointer  bg-transparent rounded-md font-medium text-red-500 hover:text-blue-500 focus-within:outline-none"
                  >
                    <span>Upload a file</span>
                    <input
                      id="thumbnail-upload"
                      name="thumbnail"
                      type="file"
                      accept="image/*"
                      onChange={handleThumbnailChange}
                      className="sr-only"
                      required
                    />
                  </label>
                  <p className="pl-1">or drag and drop</p>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                  PNG, JPG, GIF up to 5MB
                </p>
              </div>
            )}
          </div>
        </div>

        {/* submit button */}
        <div className="pt-4 mb-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full flex justify-center items-center py-3 px-4 bg-dark_red hover:bg-dark_red/80 cursor-pointer text-white font-medium rounded-md transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <>
                Create Course
                <IoSend className="ml-2 mt-1" />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default DashboardInstructorCreateNewCourse;
