import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import "./index.css";
import { router } from "./router";
import { store, persistor } from "./store";
import { ToastContainer } from "./components/common/Toast";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={store}>
      <PersistGate loading={<div>Loading...</div>} persistor={persistor}>
        <RouterProvider router={router} />
        <ToastContainer position="top-right" />
      </PersistGate>
    </Provider>
  </StrictMode>
);
