import { combineReducers } from "@reduxjs/toolkit";

// Import slices
import authSlice from "./authSlice.js";
import uiSlice from "./uiSlice.js";

// Import API slices
import { baseApi } from "./api/baseApi";

// Root reducer
export const rootReducer = combineReducers({
  auth: authSlice,
  ui: uiSlice,
  [baseApi.reducerPath]: baseApi.reducer,
});

// Export root state type
export type RootState = ReturnType<typeof rootReducer>;
