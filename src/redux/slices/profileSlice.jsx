  import { createSlice } from "@reduxjs/toolkit";

  const initialState = {
    user: null,
    loading: true,
    personalData: {
      firstname: "",
      lastName: "",
      gender: "",
      dob: "",
      userName: "",
      profession: "",
      about: "",
    },
    allStudents: [],
    allInstructors: [],
    cartData: [],
    purchasedCourse: [],
    paymentLoading:false
  };

  export const profileSlice = createSlice({
    name: "profile",
    initialState,
    reducers: {
      setProfile: (state, action) => {
        state.user = action.payload;
        state.loading = false;
      },
      clearProfile: (state) => {
        state.user = null;
        state.loading = false;
      },
      setPersonalData: (state, action) => {
        state.personalData = action.payload;
      },
      setAllStudents: (state, action) => {
        state.allStudents = action.payload;
      },
      setAllInstructors: (state, action) => {
        state.allInstructors = action.payload;
      },
      setPurchasedCourse: (state, action) => {
        state.purchasedCourse = action.payload;
      },
      setPaymentLoading:(state,action)=>{
        state.paymentLoading=action.payload
      }
    },
  });

  export const {
    setProfile,
    clearProfile,
    setPersonalData,
    setAllStudents,
    setAllInstructors,
    setPurchasedCourse,
    setPaymentLoading
  } = profileSlice.actions;

  export default profileSlice.reducer;
