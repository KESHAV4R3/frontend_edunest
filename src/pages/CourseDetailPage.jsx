import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Footer from "../components/application/Footer";
import { CiGlobe } from "react-icons/ci";
import { IoIosArrowDown } from "react-icons/io";
import { IoIosArrowForward } from "react-icons/io";
import { FaStar, FaRegStar, FaEdit, FaTrash } from "react-icons/fa";
import { apiConnector } from "../services/apiConnector";
import { apiLinks } from "../services/apiLink";
import { useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { buyCourse } from "../services/razorPayIntegration";
import { setPaymentLoading } from "../redux/slices/profileSlice";

const CourseDetailPage = () => {
  const location = useLocation();
  const courseId = location.pathname.split("/").at(-1);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [basicData, setBasicData] = useState({
    name: "",
    description: "",
    language: "",
    price: 0,
    thumbnail: "",
    averageRating: 0,
  });
  const [instructor, setInstructor] = useState([]);
  const [whatYouWillLearn, setWhatYouWillLearn] = useState([]);
  const [sections, setSections] = useState([]);
  const [ratingAndReviews, setRatingAndReviews] = useState([]);
  const [studentEnrolled, setStudentEnrolled] = useState([]);
  const [loading, setLoading] = useState(false);
  const [expandedSections, setExpandedSections] = useState([]);
  const [cartAddloading, setCartAddloading] = useState(false);
  const [purchaseLoading, setPurchaseLoading] = useState(false);
  const [purchaseButtonLoading, setPurchaseButtonLoading] = useState(false);
  const [reviewForm, setReviewForm] = useState({
    rating: 5,
    review: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [reviewLoading, setReviewLoading] = useState(false);
  const [userReview, setUserReview] = useState(null);

  const paymentPageLoader = useSelector(
    (state) => state.profile.paymentLoading
  );
  const user = useSelector((state) => state.profile.user);

  useEffect(() => {
    async function fetchCourse() {
      try {
        setLoading(true);
        let url = null;
        if (!user) {
          toast.warn("Login / register to continue");
          navigate("/");
          return;
        }
        if (user && user.accountType == "Admin") {
          url = apiLinks.getCourseDetailByAdmin + `/${courseId}`;
        } else {
          url = apiLinks.getCourseByIdOverview + `/${courseId}`;
        }
        const response = await apiConnector("GET", url);

        if (!response.success) {
          toast.error("Unable to fetch course detail");
          return;
        }

        const basicData = {
          name: response?.data?.name || "",
          description: response?.data?.description || "",
          language: response?.data?.language || "",
          price: response?.data?.price || 0,
          thumbnail: response?.data?.thumbnail || "",
          averageRating: Number(response?.data?.averageRating) || 0,
        };
        setBasicData(basicData);
        setInstructor(response?.data?.instructor || []);
        let learned = [];
        try {
          learned = JSON.parse(response?.data?.whatYouWillLearn || "[]");
        } catch (e) {
          learned = [];
        }
        setWhatYouWillLearn(learned);
        setSections(response?.data?.section || []);
        setRatingAndReviews(response?.data?.reviews || []);
        setStudentEnrolled(response?.data?.studentEnrolled || []);
        console.log(ratingAndReviews);
      } catch (error) {
        toast.error("Error fetching course data");
      } finally {
        setLoading(false);
      }
    }
    fetchCourse();
  }, [courseId, user]);

  const toggleSection = (index) => {
    if (expandedSections.includes(index)) {
      setExpandedSections(expandedSections.filter((i) => i !== index));
    } else {
      setExpandedSections([...expandedSections, index]);
    }
  };

  const collapseAllSections = () => {
    setExpandedSections([]);
  };

  const renderRatingStars = (rating) => {
    const safeRating = Number(rating) || 0;
    return (
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <span key={star} className="text-xl">
            {star <= safeRating ? (
              <FaStar className="text-yellow-400" />
            ) : (
              <FaRegStar className="text-yellow-400" />
            )}
          </span>
        ))}
      </div>
    );
  };

  const formatNumber = (number) => {
    return number?.toLocaleString("en-IN") || 0;
  };

  async function addToCart() {
    try {
      setCartAddloading(true);
      const url = apiLinks.insertCartCourse + `/${courseId}`;
      const response = await apiConnector("PUT", url);
      if (!response.success) {
        toast.error("Unable to add course to cart");
        return;
      }
      toast.success("Course added to cart");
    } catch (error) {
      console.error(error);
    } finally {
      setCartAddloading(false);
    }
  }

  async function purchaseHandler() {
    setPurchaseButtonLoading(true);
    if (!user) {
      toast.info("Login to purchase the course");
      navigate("/login");
      return;
    }

    try {
      await buyCourse([courseId], user, navigate, (isLoading) => {
        if (isLoading) {
          dispatch(setPaymentLoading(true));
        } else {
          dispatch(setPaymentLoading(false));
        }
      });
    } catch (error) {
      console.error("Purchase failed:", error);
      dispatch(setPaymentLoading(false));
    } finally {
      setPurchaseButtonLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="bg-dark_bg min-h-screen text-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-dark_red"></div>
      </div>
    );
  }

  if (paymentPageLoader) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0000004f] bg-opacity-70">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-white">Completing your purchase...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-dark_bg min-h-screen text-white">
      <style>
        {`
          @keyframes fadeInUp {
            from {
              opacity: 0;
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          .review-card {
            transition: all 0.3s ease;
          }
          .review-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
          }
        `}
      </style>
      <div className="w-[95%] mx-auto mb-[100px] max-w-[1400px]">
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-10 pt-8 lg:pt-20">
          {/* Left Column - Course Header and Content */}
          <div className="flex-1 flex flex-col gap-6 lg:gap-8 order-2 lg:order-1">
            {/* Course Header */}
            <div className="w-full flex flex-col gap-4">
              <h1 className="text-2xl lg:text-[30px] font-bold text-gray-300">
                {basicData.name}
              </h1>
              <p className="text-gray-400 text-base lg:text-lg">
                {basicData.description}
              </p>
              <div className="flex flex-wrap items-center gap-3 lg:gap-4">
                <div className="flex items-center space-x-1">
                  {renderRatingStars(basicData?.averageRating)}
                  <span className="text-gray-400 text-lg lg:text-xl ml-2">
                    {(basicData?.averageRating || 0).toFixed(1)}
                  </span>
                </div>
                <span className="text-gray-400 text-sm lg:text-base">
                  ({formatNumber(ratingAndReviews.length)} ratings)
                </span>
                <span className="text-gray-400 text-sm lg:text-base">
                  {formatNumber(studentEnrolled.length)} students
                </span>
              </div>
              <div className="text-gray-400 text-sm lg:text-[18px]">
                Created by{" "}
                <span className="font-medium text-dark_red hover:text-red-500 cursor-pointer">
                  {instructor?.map((inst) => `${inst?.firstName || ""} ${inst?.lastName || ""}`)
                    .join(", ")}
                </span>
              </div>
              <div className="flex items-center gap-4 lg:gap-10 text-gray-400 text-sm lg:text-base">
                <div className="flex items-center gap-1 cursor-pointer">
                  <CiGlobe className="text-lg" />
                  <span>{basicData.language}</span>
                </div>
              </div>
            </div>

            {/* What You'll Learn */}
            {whatYouWillLearn.length > 0 && (
              <div className="border border-gray-800 p-6 lg:p-8 rounded-lg shadow-[0_0_40px_25px_rgba(96,105,90,0.1)]">
                <h2 className="text-xl lg:text-2xl font-bold text-gray-300 mb-4 lg:mb-6">
                  What You'll Learn
                </h2>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 lg:gap-4">
                  {whatYouWillLearn?.map((item, index) => (
                    <li
                      key={index}
                      className="flex items-start text-gray-400 text-sm lg:text-base"
                    >
                      <span className="mr-2 mt-1 flex justify-center items-center">
                        ✅
                      </span>{" "}
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Course Content */}
            {sections.length > 0 && (
              <div className="border border-gray-800 p-6 lg:p-8 rounded-lg">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 lg:mb-6 gap-3">
                  <h2 className="text-xl lg:text-2xl font-bold text-white">
                    Course Content
                  </h2>
                  <button
                    onClick={collapseAllSections}
                    className="text-gray-400 hover:text-white transition-all duration-300 cursor-pointer text-sm lg:text-base"
                  >
                    Collapse All
                  </button>
                </div>
                <div className="space-y-4 lg:space-y-6">
                  {sections?.map((section, index) => (
                    <div key={index} className="mb-4 lg:mb-6">
                      {/* Section Header */}
                      <div
                        className="flex items-center justify-between bg-gray-900 p-3 lg:p-4 rounded-md cursor-pointer hover:bg-gray-800 transition-all duration-300"
                        onClick={() => toggleSection(index)}
                      >
                        <div className="flex-1">
                          <h3 className="text-base lg:text-[20px] font-semibold text-gray-300">
                            {section?.name}
                          </h3>
                          {section?.description && (
                            <p className="text-gray-400 text-xs lg:text-[17px] mt-1">
                              {section?.description}
                            </p>
                          )}
                        </div>
                        <span className="text-gray-400 ml-2">
                          {expandedSections.includes(index) ? (
                            <IoIosArrowDown />
                          ) : (
                            <IoIosArrowForward />
                          )}
                        </span>
                      </div>

                      {/* Subsection List */}
                      <div
                        className={`overflow-hidden transition-all duration-500  p-2 ${expandedSections.includes(index)
                            ? "max-h-[1000px]"
                            : "max-h-0"
                          }`}
                      >
                        <div className="space-y-2 mt-2 ">
                          {section?.subSection?.map((subsection, subIndex) => (
                            <div
                              key={subIndex}
                              className="bg-dark_bg border-1 border-gray-700 p-3 lg:p-4 rounded-lg hover:bg-gray-900 cursor-pointer transition-all duration-300"
                            >
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <div className="flex items-center">
                                    <span className="text-gray-400 mr-2">
                                      ▶️
                                    </span>
                                    <span className="text-gray-400 font-medium text-[18px]">
                                      {subsection?.title}
                                    </span>
                                  </div>
                                  {subsection?.description && (
                                    <p className="text-gray-500 text-xs lg:text-[16px] mt-2 ml-6 ">
                                      {subsection?.description}
                                    </p>
                                  )}
                                </div>
                                <div className="flex flex-col justify-center items-center pt-2">
                                  <a
                                    href={subsection?.videoUrl}
                                    target="blank"
                                    className="text-blue-500 hover:text-red-500"
                                  >
                                    watch video
                                  </a>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Reviews Section */}
            <div className="bg-gray-900 p-6 lg:p-8 rounded-lg">
              <h2 className="text-xl lg:text-2xl font-bold text-white mb-4 lg:mb-6">
                Reviews
              </h2>
              {ratingAndReviews?.map((item, index) => (
                <div
                  key={item?._id || index}
                  className="bg-gray-800 text-white rounded-xl p-4 shadow-md border border-gray-700 max-w-md mb-4"
                >
                  <div className="flex items-center mb-3">
                    <img
                      src={item?.user?.image || `https://api.dicebear.com/5.x/initials/svg?seed=${item?.user?.firstName || "User"}`}
                      alt={`${item?.user?.firstName || ""} ${item?.user?.lastName || ""}`}
                      className="w-10 h-10 rounded-full mr-3"
                    />
                    <div>
                      <p className="font-semibold">
                        {item?.user?.firstName} {item?.user?.lastName}
                      </p>
                      <div className="flex text-yellow-400">
                        {[...Array(item?.rating || 0)].map((_, i) => (
                          <svg
                            key={i}
                            xmlns="http://www.w3.org/2000/svg"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                            className="w-4 h-4 mr-1"
                          >
                            <path d="M12 .587l3.668 7.431 8.2 1.192-5.934 5.787 1.402 8.173L12 18.896l-7.336 3.874 1.402-8.173L.132 9.21l8.2-1.192z" />
                          </svg>
                        ))}
                      </div>
                    </div>
                  </div>
                  <p className="text-gray-300">{item?.review}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column - Course Info */}
          <div className="w-full lg:w-[400px] flex-shrink-0 order-1 lg:order-2">
            <div className="bg-gray-900 p-6 lg:p-8 rounded-lg sticky top-4 lg:top-20">
              {/* Course Thumbnail */}
              <img
                src={
                  basicData.thumbnail ||
                  "https://ui-avatars.com/api/?name=Edunest+Edtech"
                }
                alt="Course Thumbnail"
                className="w-full h-40 lg:h-48 object-cover rounded-lg mb-4 lg:mb-6"
              />
              {/* Course Details */}
              <h3 className="text-lg lg:text-xl font-bold text-white mb-3 lg:mb-4">
                Course Details
              </h3>
              <p className="text-gray-400 text-sm lg:text-base mb-4 lg:mb-6">
                {basicData.description}
              </p>
              {/* Purchase and Add to Cart Buttons */}
              {(!user || user.accountType == "Student") && (
                <>
                  <button
                    onClick={purchaseHandler}
                    disabled={purchaseButtonLoading}
                    className="w-full flex items-center justify-center gap-2 cursor-pointer disabled:cursor-not-allowed bg-dark_red text-white font-semibold p-2 lg:p-3 rounded-lg hover:bg-dark_red/80 transition-all duration-300 mb-3 lg:mb-4 text-sm lg:text-base"
                  >
                    {purchaseButtonLoading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Processing...
                      </>
                    ) : (
                      <>Enroll Now for ₹{formatNumber(basicData.price)}</>
                    )}
                  </button>

                  <button
                    onClick={addToCart}
                    disabled={cartAddloading}
                    className="w-full disabled:cursor-not-allowed bg-gray-800 text-white font-semibold p-2 lg:p-3 rounded-lg hover:bg-gray-700 transition-all duration-300 text-sm lg:text-base flex justify-center items-center gap-2"
                  >
                    {cartAddloading ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Adding...
                      </div>
                    ) : (
                      "Add to Cart"
                    )}
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default CourseDetailPage;
