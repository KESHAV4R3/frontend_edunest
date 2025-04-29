import { configureStore } from "@reduxjs/toolkit";
import profileSliceReducer from "./slices/profileSlice";
import applicationSliceReducer from "./slices/applicationSlice";

export const store = configureStore({
  reducer: {
    profile: profileSliceReducer,
    application: applicationSliceReducer,
  },
});
