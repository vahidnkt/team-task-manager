import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { ConfigProvider, message, notification } from "antd";
import "./index.css";
import { router } from "./router";
import { store, persistor } from "./store";

// Configure Ant Design message and notification
message.config({
  top: 100,
  duration: 3,
  maxCount: 3,
  getContainer: () =>
    document.getElementById("antd-message-container") || document.body,
});

notification.config({
  placement: "topRight",
  duration: 4,
  maxCount: 3,
  getContainer: () =>
    document.getElementById("antd-notification-container") || document.body,
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={store}>
      <PersistGate loading={<div>Loading...</div>} persistor={persistor}>
        <ConfigProvider>
          <RouterProvider router={router} />
        </ConfigProvider>
      </PersistGate>
    </Provider>
  </StrictMode>
);
