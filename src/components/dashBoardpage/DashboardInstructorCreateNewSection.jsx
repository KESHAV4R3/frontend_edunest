import React, { useState, useEffect, useCallback, useMemo, memo } from "react";
import { IoSend } from "react-icons/io5";
import { toast } from "react-toastify";
import { apiConnector } from "../../services/apiConnector";
import { apiLinks } from "../../services/apiLink";
import { useLocation, useNavigate } from "react-router-dom";
import { FaRegEdit } from "react-icons/fa";
import { MdDelete, MdCancel, MdOutlineSystemSecurityUpdateGood } from "react-icons/md";
import { IoMdAdd } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";
import { setLoading } from "../../redux/slices/uiSlice";

const DashboardInstructorCreateNewSection = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const id = useMemo(() => location.pathname.split("/").pop(), [location.pathname]);
  
  const [sections, setSections] = useState([]);
  const { loading } = useSelector((state) => state.ui) || { loading: false };

  const [newSection, setNewSection] = useState({
    courseId: id,
    name: "",
    description: "",
  });

  const [editingSectionId, setEditingSectionId] = useState(null);
  const [updatedSection, setUpdatedSection] = useState({
    sectionId: "",
    name: "",
    description: "",
  });

  // --- API LOGIC ---

  const fetchSections = useCallback(async () => {
    dispatch(setLoading(true));
    try {
      const response = await apiConnector("GET", `${apiLinks.getAllSection}/${id}`);
      if (response?.success) {
        setSections(response.sections || []);
      }
    } catch (error) {
      console.error("Fetch Error:", error);
      setSections([]);
    } finally {
      dispatch(setLoading(false));
    }
  }, [id, dispatch]);

  useEffect(() => {
    fetchSections();
  }, [fetchSections]);

  const handleInputChange = useCallback((event) => {
    const { name, value } = event.target;
    setNewSection((prev) => ({ ...prev, [name]: value }));
  }, []);

  const updatedSectionHandler = useCallback((event) => {
    const { name, value } = event.target;
    setUpdatedSection((prev) => ({ ...prev, [name]: value }));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newSection.name.trim() || !newSection.description.trim()) {
      toast.error("Fields cannot be empty");
      return;
    }

    dispatch(setLoading(true));
    try {
      const response = await apiConnector("POST", apiLinks.createSection, null, newSection);
      if (response?.success) {
        toast.success("Section deployed");
        setNewSection({ courseId: id, name: "", description: "" });
        fetchSections();
      }
    } catch (error) {
      toast.error("Internal Error");
    } finally {
      dispatch(setLoading(false));
    }
  };

  const startEditing = useCallback((section) => {
    setEditingSectionId(section._id);
    setUpdatedSection({
      sectionId: section._id,
      name: section.name,
      description: section.description,
    });
  }, []);

  const cancelEdit = useCallback(() => {
    setEditingSectionId(null);
    setUpdatedSection({ sectionId: "", name: "", description: "" });
  }, []);

  const updateSectionAPICall = async () => {
    dispatch(setLoading(true));
    try {
      const response = await apiConnector("PATCH", apiLinks.updateSection, null, updatedSection);
      if (response?.success) {
        toast.success("Updated");
        await fetchSections();
        cancelEdit();
      }
    } catch (error) {
      toast.error("Update failed");
    } finally {
      dispatch(setLoading(false));
    }
  };

  const deleteSection = async (sectionId) => {
    if (!window.confirm("Permanently remove this section?")) return;
    dispatch(setLoading(true));
    try {
      const url = `${apiLinks.deleteSection}/${id}?sectionId=${sectionId}`;
      const response = await apiConnector("DELETE", url);
      if (response?.success) {
        toast.success("Section purged");
        setSections(prev => prev.filter(s => s._id !== sectionId));
      }
    } catch (error) {
      toast.error("Deletion error");
    } finally {
      dispatch(setLoading(false));
    }
  };

  return (
    <div className="w-full max-w-[1400px] mx-auto p-1 flex flex-col min-h-screen">
      
      {/* Header Area */}
      <div className="mb-10 text-center lg:text-left">
        <h1 className="text-3xl text-center font-black text-gray-100 tracking-tight uppercase">
          CREATE <span className="text-red-600 ml-2">SECTION</span>
        </h1>
        <p className="text-[15px] text-center text-gray-500 font-black mt-1">
          Deployment Hub for Course Modules
        </p>
      </div>

      {/* Main Content Grid: Two Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 flex-1 items-start">
        
        {/* --- COLUMN 1: EXISTING SECTIONS --- */}
        <div className="flex flex-col space-y-4 h-full">
          <h2 className="text-[18px] font-black text-gray-400 tracking-widest ml-1">Created Section</h2>
          <div className="bg-gray-800 border-2 border-gray-700 rounded-2xl p-4 max-h-[400px] overflow-y-scroll scrollbar-hide shadow-2xl flex-1">
            {sections.length === 0 && !loading ? (
              <p className="py-20 text-center text-gray-600 font-black uppercase text-xs">No active sections</p>
            ) : (
              sections.map((section) => (
                <div key={section._id} className="bg-gray-900 border border-gray-700 rounded-xl p-5 mb-4 transition-all hover:border-gray-600">
                  <div className="space-y-4">
                    <div>
                      {editingSectionId === section._id ? (
                        <input
                          name="name"
                          value={updatedSection.name}
                          onChange={updatedSectionHandler}
                          className="w-full bg-gray-800 text-white p-3 rounded-lg border border-red-600/40 outline-none text-sm font-bold"
                        />
                      ) : (
                        <h3 className="text-lg font-black text-gray-100 uppercase tracking-tight">{section.name}</h3>
                      )}
                    </div>

                    <div>
                      {editingSectionId === section._id ? (
                        <textarea
                          name="description"
                          value={updatedSection.description}
                          onChange={updatedSectionHandler}
                          rows={2}
                          className="w-full bg-gray-800 text-gray-300 p-3 rounded-lg border border-red-600/40 outline-none text-xs resize-none"
                        />
                      ) : (
                        <p className="text-gray-400 text-xs leading-relaxed line-clamp-3">{section.description || "No data provided."}</p>
                      )}
                    </div>

                    <div className="flex flex-wrap gap-2 pt-4 border-t border-gray-800">
                      {editingSectionId === section._id ? (
                        <>
                          <button onClick={updateSectionAPICall} className="bg-red-600 text-white px-5 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-red-700 flex items-center gap-2">
                            <MdOutlineSystemSecurityUpdateGood /> Commit
                          </button>
                          <button onClick={cancelEdit} className="bg-gray-800 text-gray-400 px-5 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest hover:text-white">
                            Cancel
                          </button>
                        </>
                      ) : (
                        <>
                          <button onClick={() => startEditing(section)} disabled={editingSectionId !== null} className="bg-gray-800 border border-gray-700 text-gray-400 px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest hover:border-red-600 hover:text-white transition-all disabled:opacity-20">
                             Edit
                          </button>
                          <button onClick={() => deleteSection(section._id)} disabled={editingSectionId !== null} className="bg-gray-800 border border-gray-700 text-red-500 px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-red-600 hover:text-white transition-all disabled:opacity-20">
                         Delete
                          </button>
                          <button onClick={() => navigate(`/dashboard/create-new-subsection/${id}?section_id=${section._id}`)} disabled={editingSectionId !== null} className="bg-gray-800 border border-gray-700 text-green-500 px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-green-600 hover:text-white transition-all ml-auto disabled:opacity-20">
                             Sub-Section
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

        {/* --- COLUMN 2: CREATE FORM --- */}
        <div className="flex flex-col space-y-4 lg:sticky lg:top-8 ">
          <h2 className="text-[18px] font-black text-gray-400 tracking-widest ml-1">Create New Section</h2>
          <div className="bg-gray-800 border-2 border-gray-700 rounded-2xl p-6 md:p-8 shadow-2xl">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Section Title</label>
                <input
                  name="name"
                  value={newSection.name} 
                  onChange={handleInputChange}
                  className="bg-gray-900 text-white border border-gray-700 rounded-xl px-4 py-4 text-sm focus:border-red-600 outline-none transition-all font-bold placeholder:text-gray-700"
                  placeholder="e.g. CORE INFRASTRUCTURE"
                  required
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Section Overview</label>
                <textarea
                  name="description"
                  value={newSection.description}
                  onChange={handleInputChange}
                  rows={4}
                  className="bg-gray-900 text-white border border-gray-700 rounded-xl px-4 py-4 text-sm focus:border-red-600 outline-none transition-all font-medium resize-none placeholder:text-gray-700"
                  placeholder="Describe technical course objectives..."
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-red-600 hover:bg-red-700 text-white py-5 rounded-2xl text-[12px] font-black uppercase tracking-[0.25em] shadow-xl shadow-red-900/20 flex items-center justify-center gap-3 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "INITIALIZING..." : <><IoSend size={16} />Create Section</>}
              </button>
            </form>
          </div>
        </div>

      </div>
    </div>
  );
};

export default memo(DashboardInstructorCreateNewSection);