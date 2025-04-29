import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import Header from "./components/application/Header";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ResendEmailPage from "./pages/ResendEmailPage";
import CreateNewPasswordPage from "./pages/CreateNewPasswordPage";
import ResetCompletePage from "./pages/ResetCompletePage";
import VerifyMailPage from "./pages/VerifyMailPage";
import ForgotPasswordPrivate from "./privateRoutePath/ForgotPasswordPrivate";
import NonLoggedInPrivate from "./privateRoutePath/NonLoggedInPrivate";
import DashboardPage from "./pages/DashboardPage";
import AboutUsPage from "./pages/AboutUsPage";
import { useEffect, useState } from "react";
import { apiConnector } from "./services/apiConnector";
import { apiLinks } from "./services/apiLink";
import { setProfile } from "./redux/slices/profileSlice";
import { useDispatch } from "react-redux";
import DashboardPageMyProfile from "./components/dashBoardpage/DashboardPageMyProfile";
import DashboardPageCourses from "./components/dashBoardpage/DashboardPageCourses";
import DashboardPageSetting from "./components/dashBoardpage/DashboardPageSetting";
import DashboardPageInstructorAdmin from "./components/dashBoardpage/DashboardPageInstructorAdmin";
import DashboardPageStudentAdmin from "./components/dashBoardpage/DashboardPageStudentAdmin";
import DashboardPageAddcatagory from "./components/dashBoardpage/DashboardPageAddcatagory";
import DashboardPageDeletecatagory from "./components/dashBoardpage/DashboardPageDeletecatagory";
import PageNotFound from "./pages/PageNotFound";
import ContactUsPage from "./pages/ContactUsPage";
import ViewAllCatagory from "./pages/ViewAllCatagory";
import DashboardInstructorCreateNewCourse from "./components/dashBoardpage/DashboardInstructorCreateNewCourse";
import DashboardInstructorCreateNewSection from "./components/dashBoardpage/DashboardInstructorCreateNewSection";
import DashboardInstructorCreateNewCourseSuccessful from "./components/dashBoardpage/DashboardInstructorCreateNewCourseSuccessful";
import DashboardInstructorCreateNewSubsection from "./components/dashBoardpage/DashboardInstructorCreateNewSubsection";
import CourseCreatePrivate from "./privateRoutePath/CourseCreatePrivate";
import DashboardMessageToUser from "./components/dashBoardpage/DashboardMessageToUser";
import CatagoryCourse from "./pages/CatagoryCourse";
import CourseDetailPage from "./pages/CourseDetailPage";
import DashboardAccountSetting from "./components/dashBoardpage/DashboardAccountSetting";
import CartPage from "./pages/CartPage";
import CourseCompleteViewBuStudent from "./pages/CourseCompleteViewBuStudent";
import SearchResult from "./pages/SearchResult";

function App() {
  // for automatic login on page reload or after exit
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await apiConnector("POST", apiLinks.automatic_login);
        if (response.success) {
          dispatch(setProfile(response.user));
        }
      } catch (err) {
        console.log("Auto login failed", err);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  if (loading)
    return (
      <div className="text-white bg-dark_bg w-full h-screen flex justify-center items-center">
        <div className="flex items-center justify-center gap-4">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-600"></div>
          <span className="text-[20px] font-bold text-gray-400">
            {" "}
            Loading...
          </span>
        </div>
      </div>
    );

  return (
    <div className="perspective-1000 bg-dark_bg overflow-x-hidden overflow-y-auto w-full h-screen">
      <Header />
      <Routes>
        <Route path="/" element={<HomePage />} />

        <Route
          path="/login"
          element={
            <NonLoggedInPrivate>
              <LoginPage />
            </NonLoggedInPrivate>
          }
        />

        <Route path="/register" element={<RegisterPage />} />

        <Route path="/forgot-password" element={<ForgotPasswordPage />} />

        <Route
          path="/resend-email"
          element={
            <ForgotPasswordPrivate>
              <ResendEmailPage />
            </ForgotPasswordPrivate>
          }
        />

        <Route
          path="/create-new-password/:id"
          element={
            <ForgotPasswordPrivate>
              <CreateNewPasswordPage />
            </ForgotPasswordPrivate>
          }
        />

        <Route
          path="/reset-complete"
          element={
            <ForgotPasswordPrivate>
              <ResetCompletePage />
            </ForgotPasswordPrivate>
          }
        />

        <Route
          path="/verify-mail"
          element={
            <NonLoggedInPrivate>
              <VerifyMailPage />
            </NonLoggedInPrivate>
          }
        />

        {/* dashboard */}
        <Route
          path="/dashboard"
          element={
            <NonLoggedInPrivate dashboard="true">
              <DashboardPage />
            </NonLoggedInPrivate>
          }
        >
          <Route
            index
            element={
              <NonLoggedInPrivate dashboard="true">
                <DashboardPageMyProfile />
              </NonLoggedInPrivate>
            }
          />
          <Route
            path="message-from-user"
            element={
              <NonLoggedInPrivate dashboard="true">
                <DashboardMessageToUser />
              </NonLoggedInPrivate>
            }
          />
          <Route
            path="courses"
            element={
              <NonLoggedInPrivate dashboard="true">
                <DashboardPageCourses />
              </NonLoggedInPrivate>
            }
          />
          <Route
            path="setting"
            element={
              <NonLoggedInPrivate dashboard="true">
                <DashboardPageSetting />
              </NonLoggedInPrivate>
            }
          />
          <Route
            path="instructors-see-all"
            element={
              <NonLoggedInPrivate dashboard="true">
                <DashboardPageInstructorAdmin />
              </NonLoggedInPrivate>
            }
          />
          <Route
            path="student-see-all"
            element={
              <NonLoggedInPrivate dashboard="true">
                <DashboardPageStudentAdmin />
              </NonLoggedInPrivate>
            }
          />
          <Route
            path="accout-setting"
            element={
              <NonLoggedInPrivate dashboard="true">
                <DashboardAccountSetting />
              </NonLoggedInPrivate>
            }
          />
          <Route
            path="add-catagory"
            element={
              <NonLoggedInPrivate dashboard="true">
                <DashboardPageAddcatagory />
              </NonLoggedInPrivate>
            }
          />
          <Route
            path="delete-catagory"
            element={
              <NonLoggedInPrivate dashboard="true">
                <DashboardPageDeletecatagory />
              </NonLoggedInPrivate>
            }
          />
          <Route
            path="create-new-course"
            element={
              <CourseCreatePrivate>
                <DashboardInstructorCreateNewCourse />
              </CourseCreatePrivate>
            }
          />
          <Route
            path="create-new-section/:id"
            element={
              <CourseCreatePrivate>
                <DashboardInstructorCreateNewSection />
              </CourseCreatePrivate>
            }
          />
          <Route
            path="create-new-subsection/:courseId"
            element={
              <CourseCreatePrivate>
                <DashboardInstructorCreateNewSubsection />
              </CourseCreatePrivate>
            }
          />
          <Route
            path="course-creation-successful"
            element={
              <CourseCreatePrivate>
                <DashboardInstructorCreateNewCourseSuccessful />
              </CourseCreatePrivate>
            }
          />
        </Route>
        <Route path="/view-course/:courseId" element={<CourseCompleteViewBuStudent />} />
        <Route path="/about-us" element={<AboutUsPage />} />
        <Route path="/contact-us" element={<ContactUsPage />} />
        <Route path="/search/:searchData" element={<SearchResult />} />
        <Route path="/all-categories" element={<ViewAllCatagory />} />
        <Route path="/category/:name" element={<CatagoryCourse />} />
        <Route path="/course-detail/:courseId" element={<CourseDetailPage />} />
        <Route path="*" element={<PageNotFound />}></Route>
        <Route path="/cart" element={<CartPage />}></Route>
      </Routes>
    </div>
  );
}

export default App;
