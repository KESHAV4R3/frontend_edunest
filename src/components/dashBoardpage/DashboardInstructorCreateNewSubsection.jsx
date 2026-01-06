import React, { useState, useRef, useEffect, useCallback, useMemo, memo } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { apiConnector } from "../../services/apiConnector";
import { apiLinks } from "../../services/apiLink";
import { IoSend } from "react-icons/io5";
import { FaRegFileVideo, FaTimes, FaRegEdit, FaCheck } from "react-icons/fa";
import { MdDelete, MdCancel } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { setLoading } from "../../redux/slices/uiSlice";

const DashboardInstructorCreateNewSubsection = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  
  // Safely get sectionId
  const sectionId = useMemo(() => searchParams.get("section_id"), [searchParams]);
  
  const [subsections, setSubsections] = useState([]);
  const { loading } = useSelector((state) => state.ui) || { loading: false };

  // Form States
  const [newSubsection, setNewSubsection] = useState({
    sectionId, title: "", timeDuration: "", description: "",
  });
  const [editingId, setEditingId] = useState(null);
  const [editedData, setEditedData] = useState({
    title: "", timeDuration: "", description: "",
  });

  const [videoFile, setVideoFile] = useState(null);
  const [videoPreview, setVideoPreview] = useState(null);
  const [fileName, setFileName] = useState("");
  const fileInputRef = useRef(null);

  // --- API LOGIC ---

  const fetchSubsections = useCallback(async () => {
    if (!sectionId) return;
    dispatch(setLoading(true));
    try {
      const response = await apiConnector("GET", `${apiLinks.getAllSubsections}/${sectionId}`);
      if (response?.success) {
        setSubsections(response.data?.subSection || []);
      }
    } catch (error) {
      console.error("Fetch Error:", error);
      setSubsections([]);
    } finally {
      dispatch(setLoading(false));
    }
  }, [sectionId, dispatch]);

  useEffect(() => {
    fetchSubsections();
  }, [fetchSubsections]);

  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setNewSubsection((prev) => ({ ...prev, [name]: value }));
  }, []);

  const handleEditChange = useCallback((e) => {
    const { name, value } = e.target;
    setEditedData((prev) => ({ ...prev, [name]: value }));
  }, []);

  const handleVideoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.includes("video/mp4")) {
      toast.error("Please upload MP4 video only");
      return;
    }
    if (file.size > 50 * 1024 * 1024) { // Increased to 50MB for video
      toast.error("Video must be under 50MB");
      return;
    }
    setVideoFile(file);
    setFileName(file.name);
    setVideoPreview(URL.createObjectURL(file));
  };

  const clearVideo = useCallback(() => {
    if (videoPreview) URL.revokeObjectURL(videoPreview);
    setVideoFile(null);
    setVideoPreview(null);
    setFileName("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  }, [videoPreview]);

  const createSubSection = async (e) => {
    e.preventDefault();
    if (!newSubsection.title || !videoFile) {
      toast.error("Title and Video are required");
      return;
    }

    dispatch(setLoading(true));
    try {
      const formData = new FormData();
      formData.append("uploadedVideoFile", videoFile);
      formData.append("title", newSubsection.title);
      formData.append("timeDuration", newSubsection.timeDuration);
      formData.append("description", newSubsection.description);
      formData.append("sectionId", sectionId);

      const response = await apiConnector("POST", apiLinks.createSubSection, null, formData);
      if (response?.success) {
        toast.success("Added successfully");
        setNewSubsection({ sectionId, title: "", timeDuration: "", description: "" });
        clearVideo();
        fetchSubsections();
      }
    } catch (error) {
      toast.error("Error creating sub-section");
    } finally {
      dispatch(setLoading(false));
    }
  };

  const deleteSub = async (subId) => {
    if (!window.confirm("Delete this video?")) return;
    dispatch(setLoading(true));
    try {
      const response = await apiConnector("DELETE", `${apiLinks.deleteSubSection}/${sectionId}?subSectionId=${subId}`);
      if (response?.success) {
        setSubsections(prev => prev.filter(s => s._id !== subId));
        toast.success("Deleted");
      }
    } catch (error) {
      toast.error("Delete failed");
    } finally {
      dispatch(setLoading(false));
    }
  };

  const updateSub = async (subId) => {
    dispatch(setLoading(true));
    try {
      const response = await apiConnector("PATCH", apiLinks.updateSubSection, null, {
        subSectionId: subId, ...editedData
      });
      if (response?.success) {
        toast.success("Updated");
        setEditingId(null);
        fetchSubsections();
      }
    } catch (error) {
      toast.error("Update failed");
    } finally {
      dispatch(setLoading(false));
    }
  };

  return (
    <div className="w-full max-w-[1400px] mx-auto p-4 md:p-6 lg:p-8 flex flex-col min-h-screen">
      
      {/* Header */}
      <div className="mb-10 text-center lg:text-left">
        <h1 className="text-3xl text-center font-black text-gray-100 tracking-tight uppercase">
          CREATE <span className="text-red-600">SUB-SECTION</span>
        </h1>
         <p className="text-[15px] text-center text-gray-500 font-black mt-1">
          Manage Video Lessons and Content
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        
        {/* --- LEFT COLUMN: LIST --- */}
        <div className="flex flex-col space-y-4">
          <h2 className="text-[18px] font-black text-gray-400 tracking-widest ml-1">Created Sub-Section</h2>
          <div className="bg-gray-800 border-2 border-gray-700 rounded-2xl p-4 max-h-[750px] overflow-y-auto scrollbar-hide shadow-2xl">
            {subsections.length === 0 && !loading ? (
              <p className="py-20 text-center text-gray-600 font-black uppercase text-xs">No videos added yet</p>
            ) : (
              subsections.map((sub) => (
                <div key={sub._id} className="bg-gray-900 border border-gray-700 rounded-xl p-4 mb-4 transition-all">
                  <div className="flex flex-col gap-4">
                    {/* Video Preview */}
                    <div className="w-full aspect-video bg-black rounded-lg overflow-hidden border border-gray-800">
                      <video src={sub.videoUrl} controls className="w-full h-full object-contain" />
                    </div>

                    <div className="space-y-3">
                      <div>
                        <p className="text-[9px] font-black text-red-600 uppercase tracking-widest mb-1">Lesson Title</p>
                        {editingId === sub._id ? (
                          <input
                            name="title" value={editedData.title} onChange={handleEditChange}
                            className="w-full bg-gray-800 text-white p-2 rounded border border-red-600/40 outline-none text-sm font-bold"
                          />
                        ) : (
                          <h3 className="text-lg font-black text-gray-100 uppercase tracking-tight">{sub.title}</h3>
                        )}
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest mb-1">Duration</p>
                          {editingId === sub._id ? (
                            <input
                              name="timeDuration" value={editedData.timeDuration} onChange={handleEditChange}
                              className="w-full bg-gray-800 text-white p-2 rounded border border-red-600/40 outline-none text-xs"
                            />
                          ) : (
                            <p className="text-gray-300 text-xs font-bold">{sub.timeDuration || "00:00"}</p>
                          )}
                        </div>
                      </div>

                      <div>
                        <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest mb-1">Description</p>
                        {editingId === sub._id ? (
                          <textarea
                            name="description" value={editedData.description} onChange={handleEditChange}
                            rows={2} className="w-full bg-gray-800 text-gray-300 p-2 rounded border border-red-600/40 outline-none text-xs resize-none"
                          />
                        ) : (
                          <p className="text-gray-400 text-xs leading-relaxed line-clamp-2">{sub.description}</p>
                        )}
                      </div>
                    </div>

                    {/* Simple Action Buttons */}
                    <div className="flex gap-2 pt-4 border-t border-gray-800">
                      {editingId === sub._id ? (
                        <>
                          <button onClick={() => updateSub(sub._id)} className="bg-red-600 text-white px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-red-700 flex items-center gap-1.5">
                             Save
                          </button>
                          <button onClick={() => setEditingId(null)} className="bg-gray-800 text-gray-400 px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest hover:text-white">
                            Cancel
                          </button>
                        </>
                      ) : (
                        <>
                          <button onClick={() => {setEditingId(sub._id); setEditedData(sub);}} className="bg-gray-800 border border-gray-700 text-gray-400 px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest hover:border-red-600 hover:text-white transition-all">
                           Edit
                          </button>
                          <button onClick={() => deleteSub(sub._id)} className="bg-gray-800 border border-gray-700 text-red-500 px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-red-600 hover:text-white transition-all">
                            Delete
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* --- RIGHT COLUMN: CREATE FORM (STICKY) --- */}
        <div className="flex flex-col space-y-4 lg:sticky lg:top-8">
          <h2 className="text-[18px] font-black text-gray-400 tracking-widest ml-1">Create Sub-Section</h2>
          <div className="bg-gray-800 border-2 border-gray-700 rounded-2xl p-6 md:p-8 shadow-2xl">
            <form onSubmit={createSubSection} className="space-y-5">
              
              <div className="flex flex-col gap-1.5">
                <div className={`border-2 border-dashed rounded-xl p-4 text-center transition-all ${videoFile ? 'border-red-600 bg-red-600/5' : 'border-gray-700 bg-gray-900'}`}>
                  {videoPreview ? (
                    <div className="relative">
                      <video src={videoPreview} className="w-full rounded-lg bg-black aspect-video mb-2" />
                      <button type="button" onClick={clearVideo} className="absolute -top-2 -right-2 bg-red-600 p-1.5 rounded-full text-white shadow-lg"><FaTimes size={12} /></button>
                      <p className="text-[10px] text-gray-400 truncate px-2">{fileName}</p>
                    </div>
                  ) : (
                    <label className="cursor-pointer flex flex-col items-center py-6">
                      <FaRegFileVideo size={40} className="text-gray-700 mb-2" />
                      <span className="text-[10px] font-black text-red-500 uppercase tracking-widest">Select MP4 Video</span>
                      <input type="file" ref={fileInputRef} accept="video/mp4" onChange={handleVideoChange} className="hidden" />
                    </label>
                  )}
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Title</label>
                <input
                  name="title" value={newSubsection.title} onChange={handleInputChange} required
                  className="bg-gray-900 text-white border border-gray-700 rounded-xl px-4 py-3 text-sm focus:border-red-600 outline-none font-bold"
                  placeholder="Lesson Title"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Duration (MM:SS)</label>
                <input
                  name="timeDuration" value={newSubsection.timeDuration} onChange={handleInputChange}
                  className="bg-gray-900 text-white border border-gray-700 rounded-xl px-4 py-3 text-sm focus:border-red-600 outline-none font-bold"
                  placeholder="e.g. 12:45"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Description</label>
                <textarea
                  name="description" value={newSubsection.description} onChange={handleInputChange}
                  rows={3} required className="bg-gray-900 text-white border border-gray-700 rounded-xl px-4 py-4 text-sm focus:border-red-600 outline-none resize-none"
                  placeholder="Lesson details..."
                />
              </div>

              <button
                type="submit" disabled={loading}
                className="w-full bg-red-600 hover:bg-red-700 text-white py-4 rounded-xl text-[12px] font-black uppercase tracking-[0.2em] shadow-xl shadow-red-900/20 flex items-center justify-center gap-3 transition-all disabled:opacity-50"
              >
                {loading ? "Adding..." : <><IoSend size={16} /> Add Lesson</>}
              </button>
            </form>
          </div>
        </div>

      </div>
    </div>
  );
};

export default memo(DashboardInstructorCreateNewSubsection);