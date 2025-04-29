import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { apiLinks } from "../services/apiLink";
import { apiConnector } from "../services/apiConnector";
import { toast } from "react-toastify";
import CourseCard from "../components/dashBoardpage/CourseCard";

const SearchResult = () => {
  // Get the search parameter from the URL
  let { searchData } = useParams();
  searchData = searchData.replace(" ", "_");

  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSearchResult = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const url = apiLinks.searchResult + `/${searchData}`;
        const response = await apiConnector("GET", url);
        
        if (!response.success) {
          throw new Error(response.message || "Failed to fetch search results");
        }

        console.log(response);
        setSearchResult(response.searchResult || []);
        
        if (response.searchResult?.length === 0) {
          toast.info("No courses found matching your search", {
            autoClose: 3000,
            hideProgressBar: true,
          });
        }
        
      } catch (error) {
        console.error("Search error:", error);
        setError(error.message || "An error occurred while searching");
        toast.error(error.message || "Failed to load search results", {
          autoClose: 3000,
          hideProgressBar: true,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchSearchResult();
  }, [searchData]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-center">
        <h2 className="text-red-500 text-xl mb-2">Error</h2>
        <p className="text-gray-400">{error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl text-gray-400 text-center font-bold mb-4">
        Search Results
      </h1>
      <p className="text-lg text-center -mt-2 text-gray-300">
        {"( "}
        showing result for :{" "}
        <span className="font-semibold text-blue-600">
          {decodeURIComponent(searchData.replace(/_/g, " "))}
        </span>
        {" )"}
      </p>

      <div className="mt-8">
        {searchResult.length > 0 ? (
          <div className="flex justify-center items-center gap-5 flex-wrap p-5 text-gray-300">
            {searchResult.map((value, index) => (
              <CourseCard id={value._id} course={value} key={index} />
            ))}
          </div>
        ) : (
          <div className="text-center py-10 text-gray-400">
            No courses found matching your search criteria
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchResult;