import React, { useState, useCallback, memo } from "react";
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
  // Safe selector fallback
  const catagories = useSelector((state) => state.application.catagories) || [];
  
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

  const languages = ["English", "Hindi", "Spanish", "French", "German", "Japanese", "Other"];

  // --- MEMOIZED HANDLERS (Performance) ---

  const addLearningPoint = useCallback((data) => {
    if (data.trim()) {
      setLearningPoints((prev) => [...prev, data.trim()]);
      setCurrentPoint("");
    }
  }, []);

  const removeLearningPoint = useCallback((index) => {
    setLearningPoints((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const updateLearningPoint = useCallback((index, value) => {
    setLearningPoints((prev) => {
      const updated = [...prev];
      updated[index] = value;
      return updated;
    });
  }, []);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }, []);

  const handleThumbnailChange = useCallback((e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size limit is 5MB");
      return;
    }

    const allowedFormats = ["image/png", "image/jpeg", "image/jpg", "image/gif"];
    if (!allowedFormats.includes(file.type.toLowerCase())) {
      toast.error("Format not supported (PNG/JPG only)");
      return;
    }

    setFormData((prev) => ({ ...prev, thumbnail: file }));
    setPreview(URL.createObjectURL(file));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);
    try {
      const data = new FormData();
      data.append("name", formData.name);
      data.append("description", formData.description);
      data.append("language", formData.language);
      data.append("whatYouWillLearn", JSON.stringify(learningPoints));
      data.append("price", formData.price);
      data.append("categoryId", formData.categoryId);
      data.append("thumbnailImg", formData.thumbnail);

      const response = await apiConnector("POST", apiLinks.createCourse, null, data);

      if (response?.success) {
        toast.success("Course created successfully");
        navigate(`/dashboard/create-new-section/${response.course_id}`);
      } else {
        toast.error(response?.message || "Creation failed");
      }
    } catch (error) {
      console.error("Course creation error:", error);
      toast.error("Internal Server Error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full  mx-auto p-1 flex flex-col min-h-full">
      {/* Header Area */}
      <div className="mb-10 text-center md:text-left">
        <h1 className="text-3xl font-black text-center text-gray-100 tracking-tight uppercase">
          CREATE <span className="text-red-600">NEW COURSE</span>
        </h1>
        <p className="text-[15px] text-center text-gray-500 font-black mt-1">
          Initiate a new curriculum deployment
        </p>
      </div>

      <div className="bg-gray-800 border border-gray-700 rounded-2xl shadow-2xl p-6 md:p-10">
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Title */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] uppercase font-black tracking-widest text-gray-500 ml-1">Course Title</label>
            <input
              type="text"
              name="name"
              placeholder="e.g. Advanced System Design"
              value={formData.name}
              onChange={handleChange}
              className="bg-gray-900 text-white border border-gray-700 rounded-xl px-4 py-3 text-sm focus:border-red-600 outline-none transition-all font-medium placeholder:text-gray-700"
              required
            />
          </div>

          {/* Description */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] uppercase font-black tracking-widest text-gray-500 ml-1">Detailed Description</label>
            <textarea
              name="description"
              placeholder="Describe the technical scope of the course..."
              value={formData.description}
              onChange={handleChange}
              rows={4}
              className="bg-gray-900 text-white border border-gray-700 rounded-xl px-4 py-3 text-sm focus:border-red-600 outline-none transition-all font-medium resize-none placeholder:text-gray-700"
              required
            />
            <p className="text-[9px] font-bold text-gray-600 text-right uppercase tracking-tighter">
              Char Count: {formData.description.length} / 50 min
            </p>
          </div>

          {/* Language & Category */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] uppercase font-black tracking-widest text-gray-500 ml-1">Instruction Language</label>
              <select
                name="language"
                value={formData.language}
                onChange={handleChange}
                className="bg-gray-900 text-white border border-gray-700 rounded-xl px-4 py-3 text-sm focus:border-red-600 outline-none cursor-pointer"
              >
                {languages.map((lang) => <option key={lang} value={lang}>{lang}</option>)}
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] uppercase font-black tracking-widest text-gray-500 ml-1">Course Sector</label>
              <select
                name="categoryId"
                value={formData.categoryId}
                onChange={handleChange}
                className="bg-gray-900 text-white border border-gray-700 rounded-xl px-4 py-3 text-sm focus:border-red-600 outline-none cursor-pointer"
                required
              >
                <option value="" disabled>Select a category</option>
                {catagories.map((cat) => (
                  <option key={cat._id} value={cat._id}>{cat.name}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Learning Objectives */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] uppercase font-black tracking-widest text-gray-500 ml-1">Learning Objectives</label>
            <div className="space-y-2 mb-2">
              {learningPoints.map((point, index) => (
                <div key={index} className="flex items-center gap-2 group animate-fadeIn">
                  <input
                    type="text"
                    value={point}
                    onChange={(e) => updateLearningPoint(index, e.target.value)}
                    className="flex-1 bg-gray-900/50 text-gray-200 border border-gray-700 rounded-lg px-3 py-2 text-xs focus:border-red-600 outline-none font-medium"
                  />
                  <button
                    type="button"
                    onClick={() => removeLearningPoint(index)}
                    className="p-2 text-gray-600 hover:text-red-500 transition-colors"
                  >
                    <MdDelete size={18} />
                  </button>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={currentPoint}
                onChange={(e) => setCurrentPoint(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addLearningPoint(currentPoint))}
                className="flex-1 bg-gray-900 text-white border border-gray-700 rounded-xl px-4 py-2 text-sm focus:border-red-600 outline-none"
                placeholder="Add objective..."
              />
              <button
                type="button"
                onClick={() => addLearningPoint(currentPoint)}
                className="bg-gray-700 hover:bg-gray-600 text-white px-5 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all"
              >
                Add
              </button>
            </div>
          </div>

          {/* Price & Thumbnail Zone */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] uppercase font-black tracking-widest text-gray-500 ml-1">Market Price (INR)</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-red-600 font-black">₹</span>
                <input
                  type="number"
                  name="price"
                  placeholder="1999"
                  value={formData.price}
                  onChange={handleChange}
                  className="w-full bg-gray-900 text-white border border-gray-700 rounded-xl pl-8 pr-4 py-3 text-sm focus:border-red-600 outline-none font-black"
                  required
                />
              </div>
            </div>

            <div className="md:col-span-2 flex flex-col gap-1.5">
              <label className="text-[10px] uppercase font-black tracking-widest text-gray-500 ml-1">Cover Thumbnail</label>
              <div className="relative group border-2 border-dashed border-gray-700 rounded-2xl p-4 flex flex-col items-center justify-center transition-all hover:border-red-600/50 bg-gray-900/30">
                {preview ? (
                  <div className="flex flex-col items-center animate-fadeIn w-full">
                    <img src={preview} alt="Preview" className="w-full h-32 object-cover rounded-xl mb-3 shadow-lg" />
                    <button
                      type="button"
                      onClick={() => {setPreview(null); setFormData(p => ({...p, thumbnail: null}));}}
                      className="text-[9px] font-black uppercase tracking-widest text-red-500 hover:text-red-400"
                    >
                      Clear Image
                    </button>
                  </div>
                ) : (
                  <label htmlFor="thumb" className="flex flex-col items-center cursor-pointer w-full py-4">
                    <BiImageAdd size={40} className="text-gray-600 group-hover:text-red-600 transition-colors" />
                    <span className="text-[10px] font-bold text-gray-500 mt-2 uppercase tracking-tighter">Drag or select 16:9 media</span>
                    <input id="thumb" type="file" accept="image/*" onChange={handleThumbnailChange} className="hidden" required />
                  </label>
                )}
              </div>
            </div>
          </div>

          {/* Submit Action */}
          <div className="pt-6">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-red-600 hover:bg-red-700 text-white font-black py-4 rounded-2xl shadow-xl shadow-red-900/20 transition-all flex justify-center items-center gap-3 uppercase tracking-[0.2em] text-xs disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>
                  Establish Course <IoSend size={14} className="mb-0.5" />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default memo(DashboardInstructorCreateNewCourse);