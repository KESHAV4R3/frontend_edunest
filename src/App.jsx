import { Suspense, lazy, useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import { useDispatch } from "react-redux";
import { apiConnector } from "./services/apiConnector";
import { apiLinks } from "./services/apiLink";
import { setProfile } from "./redux/slices/profileSlice";
import NonLoggedInPrivate from "./privateRoutePath/NonLoggedInPrivate";
import ForgotPasswordPrivate from "./privateRoutePath/ForgotPasswordPrivate";
import CourseCreatePrivate from "./privateRoutePath/CourseCreatePrivate";

// Lazy load all page components
const HomePage = lazy(() => import("./pages/HomePage"));
const Header = lazy(() => import("./components/application/Header"));
const LoginPage = lazy(() => import("./pages/LoginPage"));
const RegisterPage = lazy(() => import("./pages/RegisterPage"));
const ForgotPasswordPage = lazy(() => import("./pages/ForgotPasswordPage"));
const ResendEmailPage = lazy(() => import("./pages/ResendEmailPage"));
const CreateNewPasswordPage = lazy(() =>
  import("./pages/CreateNewPasswordPage")
);
const ResetCompletePage = lazy(() => import("./pages/ResetCompletePage"));
const VerifyMailPage = lazy(() => import("./pages/VerifyMailPage"));
const DashboardPage = lazy(() => import("./pages/DashboardPage"));
const AboutUsPage = lazy(() => import("./pages/AboutUsPage"));
const ContactUsPage = lazy(() => import("./pages/ContactUsPage"));
const ViewAllCatagory = lazy(() => import("./pages/ViewAllCatagory"));
const CatagoryCourse = lazy(() => import("./pages/CatagoryCourse"));
const CourseDetailPage = lazy(() => import("./pages/CourseDetailPage"));
const CartPage = lazy(() => import("./pages/CartPage"));
const CourseCompleteViewBuStudent = lazy(() =>
  import("./pages/CourseCompleteViewBuStudent")
);
const SearchResult = lazy(() => import("./pages/SearchResult"));
const PageNotFound = lazy(() => import("./pages/PageNotFound"));

// Lazy load dashboard components
const DashboardPageMyProfile = lazy(() =>
  import("./components/dashBoardpage/DashboardPageMyProfile")
);
const DashboardMessageToUser = lazy(() =>
  import("./components/dashBoardpage/DashboardMessageToUser")
);
const DashboardPageCourses = lazy(() =>
  import("./components/dashBoardpage/DashboardPageCourses")
);
const DashboardPageSetting = lazy(() =>
  import("./components/dashBoardpage/DashboardPageSetting")
);
const DashboardPageInstructorAdmin = lazy(() =>
  import("./components/dashBoardpage/DashboardPageInstructorAdmin")
);
const DashboardPageStudentAdmin = lazy(() =>
  import("./components/dashBoardpage/DashboardPageStudentAdmin")
);
const DashboardAccountSetting = lazy(() =>
  import("./components/dashBoardpage/DashboardAccountSetting")
);
const DashboardPageAddcatagory = lazy(() =>
  import("./components/dashBoardpage/DashboardPageAddcatagory")
);
const DashboardPageDeletecatagory = lazy(() =>
  import("./components/dashBoardpage/DashboardPageDeletecatagory")
);
const DashboardInstructorCreateNewCourse = lazy(() =>
  import("./components/dashBoardpage/DashboardInstructorCreateNewCourse")
);
const DashboardInstructorCreateNewSection = lazy(() =>
  import("./components/dashBoardpage/DashboardInstructorCreateNewSection")
);
const DashboardInstructorCreateNewSubsection = lazy(() =>
  import("./components/dashBoardpage/DashboardInstructorCreateNewSubsection")
);
const DashboardInstructorCreateNewCourseSuccessful = lazy(() =>
  import(
    "./components/dashBoardpage/DashboardInstructorCreateNewCourseSuccessful"
  )
);
const DashboardLiveStream = lazy(() =>
  import("./components/dashBoardpage/DashboardLiveStream")
);

function App() {
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
  }, [dispatch]);

  const SimpleSpinner = () => (
    <div className="text-white bg-dark_bg w-full h-screen flex justify-center items-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-400"></div>
    </div>
  );

  return (
    <div className="perspective-1000 bg-dark_bg overflow-x-hidden overflow-y-auto w-full h-screen">
      <Suspense fallback={null}>
        <Header />
      </Suspense>

      {loading ? (
        <SimpleSpinner />
      ) : (
        <Routes>
          <Route
            path="/"
            element={
              <Suspense fallback={<SimpleSpinner />}>
                <HomePage />
              </Suspense>
            }
          />

          <Route
            path="/login"
            element={
              <NonLoggedInPrivate>
                <Suspense fallback={<SimpleSpinner />}>
                  <LoginPage />
                </Suspense>
              </NonLoggedInPrivate>
            }
          />

          <Route
            path="/register"
            element={
              <Suspense fallback={<SimpleSpinner />}>
                <RegisterPage />
              </Suspense>
            }
          />

          <Route
            path="/forgot-password"
            element={
              <Suspense fallback={<SimpleSpinner />}>
                <ForgotPasswordPage />
              </Suspense>
            }
          />

          <Route
            path="/resend-email"
            element={
              <ForgotPasswordPrivate>
                <Suspense fallback={<SimpleSpinner />}>
                  <ResendEmailPage />
                </Suspense>
              </ForgotPasswordPrivate>
            }
          />

          <Route
            path="/create-new-password/:id"
            element={
              <ForgotPasswordPrivate>
                <Suspense fallback={<SimpleSpinner />}>
                  <CreateNewPasswordPage />
                </Suspense>
              </ForgotPasswordPrivate>
            }
          />

          <Route
            path="/reset-complete"
            element={
              <ForgotPasswordPrivate>
                <Suspense fallback={<SimpleSpinner />}>
                  <ResetCompletePage />
                </Suspense>
              </ForgotPasswordPrivate>
            }
          />

          <Route
            path="/verify-mail"
            element={
              <NonLoggedInPrivate>
                <Suspense fallback={<SimpleSpinner />}>
                  <VerifyMailPage />
                </Suspense>
              </NonLoggedInPrivate>
            }
          />

          {/* Dashboard Routes */}
          <Route
            path="/dashboard"
            element={
              <NonLoggedInPrivate dashboard="true">
                <Suspense fallback={<SimpleSpinner />}>
                  <DashboardPage />
                </Suspense>
              </NonLoggedInPrivate>
            }
          >
            <Route
              index
              element={
                <NonLoggedInPrivate dashboard="true">
                  <Suspense fallback={<SimpleSpinner />}>
                    <DashboardPageMyProfile />
                  </Suspense>
                </NonLoggedInPrivate>
              }
            />
            <Route
              path="message-from-user"
              element={
                <NonLoggedInPrivate dashboard="true">
                  <Suspense fallback={<SimpleSpinner />}>
                    <DashboardMessageToUser />
                  </Suspense>
                </NonLoggedInPrivate>
              }
            />
            <Route
              path="courses"
              element={
                <NonLoggedInPrivate dashboard="true">
                  <Suspense fallback={<SimpleSpinner />}>
                    <DashboardPageCourses />
                  </Suspense>
                </NonLoggedInPrivate>
              }
            />
            <Route
              path="setting"
              element={
                <NonLoggedInPrivate dashboard="true">
                  <Suspense fallback={<SimpleSpinner />}>
                    <DashboardPageSetting />
                  </Suspense>
                </NonLoggedInPrivate>
              }
            />
            <Route
              path="instructors-see-all"
              element={
                <NonLoggedInPrivate dashboard="true">
                  <Suspense fallback={<SimpleSpinner />}>
                    <DashboardPageInstructorAdmin />
                  </Suspense>
                </NonLoggedInPrivate>
              }
            />
            <Route
              path="student-see-all"
              element={
                <NonLoggedInPrivate dashboard="true">
                  <Suspense fallback={<SimpleSpinner />}>
                    <DashboardPageStudentAdmin />
                  </Suspense>
                </NonLoggedInPrivate>
              }
            />
            <Route
              path="LiveStream"
              element={
                <NonLoggedInPrivate dashboard="true">
                  <Suspense fallback={<SimpleSpinner />}>
                    <DashboardLiveStream />
                  </Suspense>
                </NonLoggedInPrivate>
              }
            />
            <Route
              path="accout-setting"
              element={
                <NonLoggedInPrivate dashboard="true">
                  <Suspense fallback={<SimpleSpinner />}>
                    <DashboardAccountSetting />
                  </Suspense>
                </NonLoggedInPrivate>
              }
            />
            <Route
              path="add-catagory"
              element={
                <NonLoggedInPrivate dashboard="true">
                  <Suspense fallback={<SimpleSpinner />}>
                    <DashboardPageAddcatagory />
                  </Suspense>
                </NonLoggedInPrivate>
              }
            />
            <Route
              path="delete-catagory"
              element={
                <NonLoggedInPrivate dashboard="true">
                  <Suspense fallback={<SimpleSpinner />}>
                    <DashboardPageDeletecatagory />
                  </Suspense>
                </NonLoggedInPrivate>
              }
            />
            <Route
              path="create-new-course"
              element={
                <CourseCreatePrivate>
                  <Suspense fallback={<SimpleSpinner />}>
                    <DashboardInstructorCreateNewCourse />
                  </Suspense>
                </CourseCreatePrivate>
              }
            />
            <Route
              path="create-new-section/:id"
              element={
                <CourseCreatePrivate>
                  <Suspense fallback={<SimpleSpinner />}>
                    <DashboardInstructorCreateNewSection />
                  </Suspense>
                </CourseCreatePrivate>
              }
            />
            <Route
              path="create-new-subsection/:courseId"
              element={
                <CourseCreatePrivate>
                  <Suspense fallback={<SimpleSpinner />}>
                    <DashboardInstructorCreateNewSubsection />
                  </Suspense>
                </CourseCreatePrivate>
              }
            />
            <Route
              path="course-creation-successful"
              element={
                <CourseCreatePrivate>
                  <Suspense fallback={<SimpleSpinner />}>
                    <DashboardInstructorCreateNewCourseSuccessful />
                  </Suspense>
                </CourseCreatePrivate>
              }
            />
          </Route>

          {/* Other Routes */}
          <Route
            path="/view-course/:courseId"
            element={
              <Suspense fallback={<SimpleSpinner />}>
                <CourseCompleteViewBuStudent />
              </Suspense>
            }
          />
          <Route
            path="/about-us"
            element={
              <Suspense fallback={<SimpleSpinner />}>
                <AboutUsPage />
              </Suspense>
            }
          />
          <Route
            path="/contact-us"
            element={
              <Suspense fallback={<SimpleSpinner />}>
                <ContactUsPage />
              </Suspense>
            }
          />
          <Route
            path="/search/:searchData"
            element={
              <Suspense fallback={<SimpleSpinner />}>
                <SearchResult />
              </Suspense>
            }
          />
          <Route
            path="/all-categories"
            element={
              <Suspense fallback={<SimpleSpinner />}>
                <ViewAllCatagory />
              </Suspense>
            }
          />
          <Route
            path="/category/:name"
            element={
              <Suspense fallback={<SimpleSpinner />}>
                <CatagoryCourse />
              </Suspense>
            }
          />
          <Route
            path="/course-detail/:courseId"
            element={
              <Suspense fallback={<SimpleSpinner />}>
                <CourseDetailPage />
              </Suspense>
            }
          />
          <Route
            path="/cart"
            element={
              <Suspense fallback={<SimpleSpinner />}>
                <CartPage />
              </Suspense>
            }
          />
          <Route
            path="*"
            element={
              <Suspense fallback={<SimpleSpinner />}>
                <PageNotFound />
              </Suspense>
            }
          />
        </Routes>
      )}
    </div>
  );
}

export default App;
