import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

// UI State interface
interface UIState {
  // Theme
  theme: "light" | "dark";

  // Sidebar
  sidebarCollapsed: boolean;
  sidebarOpen: boolean;

  // Modals
  modals: {
    [key: string]: boolean;
  };

  // Toasts
  toasts: Array<{
    id: string;
    type: "success" | "error" | "warning" | "info";
    message: string;
    duration?: number;
  }>;

  // Loading states
  loading: {
    [key: string]: boolean;
  };

  // Global loading
  globalLoading: boolean;
}

// Initial state
const initialState: UIState = {
  theme: "light",
  sidebarCollapsed: false,
  sidebarOpen: false,
  modals: {},
  toasts: [],
  loading: {},
  globalLoading: false,
};

// UI slice
const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    // Theme actions
    setTheme: (state, action: PayloadAction<"light" | "dark">) => {
      state.theme = action.payload;
    },
    toggleTheme: (state) => {
      state.theme = state.theme === "light" ? "dark" : "light";
    },

    // Sidebar actions
    setSidebarCollapsed: (state, action: PayloadAction<boolean>) => {
      state.sidebarCollapsed = action.payload;
    },
    toggleSidebar: (state) => {
      state.sidebarCollapsed = !state.sidebarCollapsed;
    },
    setSidebarOpen: (state, action: PayloadAction<boolean>) => {
      state.sidebarOpen = action.payload;
    },

    // Modal actions
    openModal: (state, action: PayloadAction<string>) => {
      state.modals[action.payload] = true;
    },
    closeModal: (state, action: PayloadAction<string>) => {
      state.modals[action.payload] = false;
    },
    closeAllModals: (state) => {
      state.modals = {};
    },

    // Toast actions
    addToast: (
      state,
      action: PayloadAction<{
        id: string;
        type: "success" | "error" | "warning" | "info";
        message: string;
        duration?: number;
      }>
    ) => {
      state.toasts.push(action.payload);
    },
    removeToast: (state, action: PayloadAction<string>) => {
      state.toasts = state.toasts.filter(
        (toast) => toast.id !== action.payload
      );
    },
    clearToasts: (state) => {
      state.toasts = [];
    },

    // Loading actions
    setLoading: (
      state,
      action: PayloadAction<{ key: string; loading: boolean }>
    ) => {
      state.loading[action.payload.key] = action.payload.loading;
    },
    setGlobalLoading: (state, action: PayloadAction<boolean>) => {
      state.globalLoading = action.payload;
    },
    clearLoading: (state, action: PayloadAction<string>) => {
      delete state.loading[action.payload];
    },
    clearAllLoading: (state) => {
      state.loading = {};
    },
  },
});

// Export actions
export const {
  setTheme,
  toggleTheme,
  setSidebarCollapsed,
  toggleSidebar,
  setSidebarOpen,
  openModal,
  closeModal,
  closeAllModals,
  addToast,
  removeToast,
  clearToasts,
  setLoading,
  setGlobalLoading,
  clearLoading,
  clearAllLoading,
} = uiSlice.actions;

// Export reducer
export default uiSlice.reducer;
