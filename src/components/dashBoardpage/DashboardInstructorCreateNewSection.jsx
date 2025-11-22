import React, { useState, useEffect, useCallback } from "react";
import { IoSend } from "react-icons/io5";
import { toast } from "react-toastify";
import { apiConnector } from "../../services/apiConnector";
import { apiLinks } from "../../services/apiLink";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { FaRegEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { IoMdAdd } from "react-icons/io";
import { MdCancel } from "react-icons/md";
import { MdOutlineSystemSecurityUpdateGood } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { setLoading } from "../../redux/slices/uiSlice";

const DashboardInstructorCreateNewSection = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const id = location.pathname.split("/").pop();
  const [sections, setSections] = useState([]);
  const { loading } = useSelector((state) => state.ui);

  const [newSection, setNewSection] = useState({
    courseId: id,
    name: "",
    description: "",
  });

  // Track which section is being edited (null means none)
  const [editingSectionId, setEditingSectionId] = useState(null);
  // Store the updated values for the section being edited
  const [updatedSection, setUpdatedSection] = useState({
    sectionId: "",
    name: "",
    description: "",
  });

  // handle update change
  const updatedSectionHandler = useCallback((event) => {
    setUpdatedSection((prevData) => {
      return { ...prevData, [event.target.name]: event.target.value };
    });
  }, []);

  // to fetch all section data if reloaded
  useEffect(() => {
    async function callSections() {
      dispatch(setLoading(true));
      try {
        const url = apiLinks.getAllSection + `/${id}`;
        const response = await apiConnector("GET", url);
        if (!response.success) {
          toast.error("Unable to fetch previous sections", {
            autoClose: 900,
            hideProgressBar: true,
            pauseOnHover: false,
            closeOnClick: true,
            draggable: false,
          });
        }
        setSections(response.sections || []);
      } catch (error) {
        console.error("Error fetching sections:", error);
        toast.error("Failed to fetch sections");
        setSections([]);
      } finally {
        dispatch(setLoading(false));
      }
    }
    callSections();
  }, [id, dispatch]);

  const handleInputChange = useCallback((event) => {
    setNewSection((prevData) => {
      return { ...prevData, [event.target.name]: event.target.value };
    });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if all required fields are filled
    if (!newSection.name.trim() || !newSection.description.trim()) {
      toast.error("Please fill in all fields", {
        autoClose: 900,
        hideProgressBar: true,
      });
      return;
    }

    try {
      dispatch(setLoading(true));
      // API call to create the section
      const response = await apiConnector(
        "POST",
        apiLinks.createSection,
        null,
        newSection
      );

      // Check if response is successful and contains the newly created section
      if (!response.success) {
        toast.error("unable to create section", {
          autoClose: 900,
          hideProgressBar: true,
          pauseOnHover: false,
          closeOnClick: true,
          draggable: false,
        });
        return;
      }

      setSections((prevSections) => [...prevSections, newSection]);

      toast.success("Section created successfully", {
        autoClose: 900,
        hideProgressBar: true,
        pauseOnHover: false,
        closeOnClick: true,
        draggable: false,
      });
    } catch (error) {
      console.error("API Error:", error);
      toast.error("something went wrong", {
        autoClose: 900,
        hideProgressBar: true,
        pauseOnHover: false,
        closeOnClick: true,
        draggable: false,
      });
    } finally {
      setNewSection({ courseId: id, name: "", description: "" });
      dispatch(setLoading(false));
    }
  };

  const cancelEdit = useCallback((sectionId) => {
    setEditingSectionId(null);
    setUpdatedSection({ sectionId: "", name: "", description: "" });
  }, []);

  const startEditing = useCallback((section) => {
    setEditingSectionId(section._id);
    setUpdatedSection({
      sectionId: section._id,
      name: section.name,
      description: section.description,
    });
  }, []);

  async function deleteSection(section) {
    dispatch(setLoading(true));
    try {
      const courseId = id;
      const sectionId = section._id;
      const url = apiLinks.deleteSection + `/${id}?sectionId=${sectionId}`;
      const response = await apiConnector("DELETE", url);
      if (!response.success) {
        toast.error("unable to delete section", {
          autoClose: 900,
          hideProgressBar: true,
          pauseOnHover: false,
          closeOnClick: true,
          draggable: false,
        });
        return;
      }
      const newSectionData = sections.filter((s) => s._id !== sectionId);
      setSections(newSectionData);
      toast.success("section deleted successfully", {
        autoClose: 900,
        hideProgressBar: true,
        pauseOnHover: false,
        closeOnClick: true,
        draggable: false,
      });
    } catch (error) {
    } finally {
      dispatch(setLoading(false));
    }
  }

  async function updateSectionAPICall(event) {
    dispatch(setLoading(true));
    try {
      const response = await apiConnector(
        "PATCH",
        apiLinks.updateSection,
        null,
        updatedSection
      );
      if (!response.success) {
        toast.error("unable to update data", {
          autoClose: 900,
          hideProgressBar: true,
          pauseOnHover: false,
          closeOnClick: true,
          draggable: false,
        });
        return;
      }
      toast.success("updated successfully", {
        autoClose: 900,
        hideProgressBar: true,
        pauseOnHover: false,
        closeOnClick: true,
        draggable: false,
      });
      sections.forEach((value) => {
        if (value._id == updatedSection.sectionId) {
          value.name = updatedSection.name || value.name;
          value.description = updatedSection.description || value.description;
        }
      });
    } catch (error) {
    } finally {
      setEditingSectionId(null);
      dispatch(setLoading(false));
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-2xl font-bold mb-6 text-white">Course Sections</h1>

      {/* Existing Sections */}
      <div className="mb-8 w-full">
        <h2 className="text-xl font-semibold mb-4 text-gray-300">
          Existing Sections
        </h2>
        {sections.length === 0 ? (
          <div className="p-6 border border-gray-700 rounded-lg text-center">
            <p className="text-gray-400">No sections created yet</p>
          </div>
        ) : (
          <div className="space-y-4 p-6 w-full  bg-black rounded-md h-[500px] overflow-y-auto">
            {sections.map((section) => (
              <div
                key={section._id}
                className="w-full space-y-3 p-4 border border-gray-700 rounded-lg bg-gray-800"
              >
                <div className="w-full flex items-start justify-between">
                  <div className="w-full">
                    <p className="text-sm font-medium text-gray-400 uppercase tracking-wider">
                      Section Name
                    </p>
                    {editingSectionId === section._id ? (
                      <input
                        type="text"
                        name="name"
                        value={updatedSection.name}
                        onChange={updatedSectionHandler}
                        className="w-[90%] mt-2  p-2 outline-none border-2 rounded-md border-gray-700"
                      />
                    ) : (
                      <h3 className="text-xl font-bold text-white mt-1">
                        {section.name}
                      </h3>
                    )}
                  </div>
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-400 uppercase tracking-wider">
                    Description
                  </p>
                  {editingSectionId === section._id ? (
                    <textarea
                      name="description"
                      value={updatedSection.description}
                      onChange={updatedSectionHandler}
                      className="w-full mt-2 p-2 outline-none border-2 rounded-md border-gray-700"
                    />
                  ) : (
                    <p className="text-gray-300 mt-1">
                      {section.description || "No description provided"}
                    </p>
                  )}
                </div>

                <div className="pt-3 mt-3 border-t border-gray-700">
                  {/* Flex container that changes direction based on screen size */}
                  <div className="flex flex-row flex-wrap gap-2 sm:gap-3">
                    {editingSectionId === section._id && (
                      <button
                        onClick={() => cancelEdit(section._id)}
                        type="button"
                        className="flex-1 sm:flex-none px-3 gap-2 py-1.5 text-sm rounded-md bg-orange-900/50 text-orange-400 hover:bg-orange-800/50 hover:text-orange-300 transition-all flex items-center justify-center min-w-[120px]"
                      >
                        <MdCancel />
                        <span className="whitespace-nowrap">Cancel Edit</span>
                      </button>
                    )}

                    {editingSectionId === section._id && (
                      <button
                        onClick={updateSectionAPICall}
                        type="button"
                        disabled={loading}
                        className="flex-1 sm:flex-none px-3 gap-2 py-1.5 text-sm rounded-md disabled:cursor-not-allowed bg-pink-900/10 text-pink-400 hover:bg-pink-800/50 hover:text-pink-300 transition-all flex items-center justify-center min-w-[120px]"
                      >
                        <MdOutlineSystemSecurityUpdateGood />
                        <span className="whitespace-nowrap">Save Edit</span>
                      </button>
                    )}

                    <button
                      onClick={() => startEditing(section)}
                      type="button"
                      disabled={editingSectionId !== null}
                      className={`flex-1 sm:flex-none px-3 gap-2 py-1.5 text-sm rounded-md bg-blue-900/50 text-blue-400 hover:bg-blue-800/50 hover:text-blue-300 transition-all flex items-center justify-center min-w-[120px] ${editingSectionId !== null
                          ? "opacity-50 cursor-not-allowed"
                          : ""
                        }`}
                    >
                      <FaRegEdit />
                      <span className="whitespace-nowrap">Edit</span>
                    </button>

                    <button
                      type="button"
                      disabled={editingSectionId !== null || loading}
                      onClick={() => deleteSection(section)}
                      className={`flex-1 sm:flex-none px-3 gap-2 py-1.5 text-sm rounded-md bg-red-900/50 text-red-400 hover:bg-red-800/50 hover:text-red-300 transition-all flex items-center justify-center min-w-[120px] ${editingSectionId !== null
                          ? "opacity-50 cursor-not-allowed"
                          : ""
                        }`}
                    >
                      <MdDelete />
                      <span className="whitespace-nowrap">Delete</span>
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        navigate(
                          `/dashboard/create-new-subsection/${id}?section_id=${section._id}`
                        )
                      }
                      disabled={editingSectionId !== null}
                      className={`flex-1 sm:flex-none px-3 gap-2 py-1.5 text-sm rounded-md bg-green-900/50 text-green-400 hover:bg-green-800/50 hover:text-green-300 transition-all flex items-center justify-center min-w-[120px] ${editingSectionId !== null
                          ? "opacity-50 cursor-not-allowed"
                          : ""
                        }`}
                    >
                      <IoMdAdd />
                      <span className="whitespace-nowrap">
                        Add Sub-sections
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Create New Section Form */}
      <div className="p-6 border border-gray-700 rounded-lg bg-gray-800">
        <h2 className="text-xl font-semibold mb-4 text-white">
          Create New Section
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-300 mb-1"
            >
              Section Name
              <span className="text-red-500 ml-1">*</span>
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={newSection.name}
              onChange={handleInputChange}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 text-white rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
              disabled={loading}
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-300 mb-1"
            >
              Section Description
              <span className="text-red-500 ml-1">*</span>
            </label>
            <textarea
              id="description"
              name="description"
              value={newSection.description}
              onChange={handleInputChange}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 text-white rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows="3"
              required
              disabled={loading}
            />
          </div>

          <div className="pt-4 flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="w-full sm:w-auto px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-t-transparent border-white rounded-full animate-spin mr-2" />
                  Submitting...
                </>
              ) : (
                <>
                  <IoSend className="mr-2" />
                  Create Section
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default React.memo(DashboardInstructorCreateNewSection);
