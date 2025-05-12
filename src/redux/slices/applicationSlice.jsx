import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  catagories: [],
  cartCourses:[]
};

export const applicationSlice = createSlice({
  name: "application",
  initialState,
  reducers: {
    setCatagory: (state, action) => {
      state.catagories = action.payload;
    },

    setCartCourses: (state, action) => {
      state.cartCourses = action.payload;
    },
   
  },
});

export const { setCatagory,setCartCourses} =
  applicationSlice.actions;

export default applicationSlice.reducer;