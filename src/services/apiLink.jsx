const baseUrl = import.meta.env.VITE_BACKEND_BASE_URL;

// to get reset password token
const currentUrl = window.location.href;
const token = currentUrl.split("/").at(-1);

export const apiLinks = {
  // Authentication & User Management
  login: `${baseUrl}/auth/login`,
  automatic_login: `${baseUrl}/auth/automatic-login`,
  logout: `${baseUrl}/auth/logout`,
  sendOtp: `${baseUrl}/auth/sendOtp`,
  sendOtp_owner: `${baseUrl}/auth/sendOtp_owner`,
  signup: `${baseUrl}/auth/signup`,
  googleLogin: `${baseUrl}/auth/googleLogin`,
  googleSignUp: `${baseUrl}/auth/googleSignUp`,
  signup_Admin: `${baseUrl}/auth/signup_Admin`,
  resetPassword: `${baseUrl}/resetPasswordRouter/resetPasswordToken`,
  updatePassword: `${baseUrl}/resetPasswordRouter/resetPassword/${token}`,

  // Category Endpoints
  get_catagory_list: `${baseUrl}/category/getAllCategory`,
  create_catagory: `${baseUrl}/category/createCategory`,
  getAllCouseByCategory: `${baseUrl}/category/getAllCouseByCategory`,
  delete_catagory: `${baseUrl}/category/deleteCategory/:id`,

  // Dashboard Endpoints
  getUserDetails: `${baseUrl}/dashboard/getUserDetails`,
  updateProfile: `${baseUrl}/dashboard/updateProfile`,
  getAllCourses: `${baseUrl}/dashboard/getAllCourses`,
  getAllEarnings: `${baseUrl}/dashboard/getAllEarnings`,
  getAllCoursesInDataBase: `${baseUrl}/dashboard/getAllCoursesInDataBase`,
  getAllStudents: `${baseUrl}/dashboard/getAllStudents`,
  getAllInstructors: `${baseUrl}/dashboard/getAllInstructors`,
  sendmailToAdmin: `${baseUrl}/dashboard/sendmailToAdmin`,
  sendmailToUser: `${baseUrl}/dashboard/sendmailToUser`,
  getCartCourse: `${baseUrl}/dashboard/getCartCourse`,
  removeCourseFromCart: `${baseUrl}/dashboard/removeCourseFromCart`,
  removeAllCourseFromCart: `${baseUrl}/dashboard/removeAllCourseFromCart`,
  insertCartCourse: `${baseUrl}/dashboard/insertCartCourse`,
  deleteAccountByAdmin: `${baseUrl}/dashboard/deleteAccountByAdmin`,
  deleteAccount: `${baseUrl}/dashboard/deleteAccount`,
  getStudentAnalytics: `${baseUrl}/dashboard/getStudentAnalytics`,

  // Course Management
  createCourse: `${baseUrl}/course/createCourse`,
  getTopCourses: `${baseUrl}/course/getTopCourses`,
  deleteCourse: `${baseUrl}/course/deleteCourse`,
  getCourseById: `${baseUrl}/course/getCourseById`,
  streamVideo: `${baseUrl}/course/streamVideo`,
  searchResult: `${baseUrl}/course/searchResult`,
  getCourseByIdOverview: `${baseUrl}/course/getCourseByIdOverview`,
  getCourseDetailByAdmin: `${baseUrl}/course/getCourseDetailByAdmin`,

  // Course Progress
  mark_completed: `${baseUrl}/courseProgressRouter/mark-completed`,
  remove_completed: `${baseUrl}/courseProgressRouter/remove-completed`,
  get_progress: `${baseUrl}/courseProgressRouter/get-progress`,

  // Section Management
  createSection: `${baseUrl}/sectionRouter/createSection`,
  updateSection: `${baseUrl}/sectionRouter/updateSection`,
  getAllSection: `${baseUrl}/sectionRouter/getAllSection`,
  deleteSection: `${baseUrl}/sectionRouter/deleteSection`,

  // SubSection Management
  createSubSection: `${baseUrl}/subSectionRouter/createSubSection`,
  getAllSubsections: `${baseUrl}/subSectionRouter/getAllSubsections`,
  deleteSubSection: `${baseUrl}/subSectionRouter/deleteSubSection`,
  updateSubSection: `${baseUrl}/subSectionRouter/updateSubSection`,

  // Payment Processing
  verifypayment: `${baseUrl}/razorPayPaymentIntegrationRouter/verifypayment`,
  capturePayment: `${baseUrl}/razorPayPaymentIntegrationRouter/capturePayment`,

  // Reviews & Ratings
  addReview: `${baseUrl}/RatingAndReview/add`,
  deleteReview: `${baseUrl}/RatingAndReview/delete`,
  updateReview: `${baseUrl}/RatingAndReview/update`,
  top_review: `${baseUrl}/RatingAndReview/top-comments`,
  getReview: `${baseUrl}/RatingAndReview/review`,
  topReview: `${baseUrl}/RatingAndReview/top-reviews`,


  // Live Streaming
  start: `${baseUrl}/streamRouter/start`,
  end: `${baseUrl}/streamRouter/end`,
  live: `${baseUrl}/streamRouter/live`
};
