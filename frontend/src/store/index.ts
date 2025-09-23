import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { combineReducers } from "@reduxjs/toolkit";
import { ENABLE_DEVTOOLS } from "../config";

// Import slices
import authSlice from "./authSlice.js";
import uiSlice from "./uiSlice.js";

// Import API slices
import { baseApi } from "./api/baseApi";

// Import middleware
import { toastMiddleware } from "./middleware/toastMiddleware";

// Persist configuration for auth
const authPersistConfig = {
  key: "auth",
  storage,
  whitelist: ["token", "user", "isAuthenticated"], // Persist auth state
  version: 1,
};

// Persist configuration for UI (optional - for theme, etc.)
const uiPersistConfig = {
  key: "ui",
  storage,
  whitelist: ["theme", "sidebarCollapsed"], // Only persist UI preferences
};

// Root reducer
const rootReducer = combineReducers({
  auth: persistReducer(authPersistConfig, authSlice),
  ui: persistReducer(uiPersistConfig, uiSlice),
  [baseApi.reducerPath]: baseApi.reducer,
});

// Configure store
export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [
          "persist/PERSIST",
          "persist/REHYDRATE",
          "persist/PAUSE",
          "persist/PURGE",
          "persist/REGISTER",
        ],
      },
    }).concat(baseApi.middleware, toastMiddleware),
  devTools: ENABLE_DEVTOOLS && process.env.NODE_ENV === "development",
});

// Create persistor
export const persistor = persistStore(store);

// Export types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
