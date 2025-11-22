import { configureStore } from "@reduxjs/toolkit";
import profileSliceReducer from "./slices/profileSlice";
import applicationSliceReducer from "./slices/applicationSlice";
import uiSliceReducer from "./slices/uiSlice";

export const store = configureStore({
  reducer: {
    profile: profileSliceReducer,
    application: applicationSliceReducer,
    ui: uiSliceReducer,
  },
});
