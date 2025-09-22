import { useCallback } from "react";
import { message, notification, App } from "antd";

// Toast types
export type ToastType = "success" | "error" | "warning" | "info";

// Toast configuration
interface ToastConfig {
  type: ToastType;
  message: string;
  description?: string;
  duration?: number;
}

// Toast hook for API responses
export const useToast = () => {
  // Show success toast
  const showSuccess = useCallback(
    (messageText: string, description?: string) => {
      message.success({
        content: messageText,
        duration: 3,
      });

      if (description) {
        notification.success({
          message: messageText,
          description,
          duration: 4,
          placement: "topRight",
        });
      }
    },
    []
  );

  // Show error toast
  const showError = useCallback((messageText: string, description?: string) => {
    message.error({
      content: messageText,
      duration: 5,
    });

    if (description) {
      notification.error({
        message: messageText,
        description,
        duration: 6,
        placement: "topRight",
      });
    }
  }, []);

  // Show warning toast
  const showWarning = useCallback(
    (messageText: string, description?: string) => {
      message.warning({
        content: messageText,
        duration: 4,
      });

      if (description) {
        notification.warning({
          message: messageText,
          description,
          duration: 5,
          placement: "topRight",
        });
      }
    },
    []
  );

  // Show info toast
  const showInfo = useCallback((messageText: string, description?: string) => {
    message.info({
      content: messageText,
      duration: 3,
    });

    if (description) {
      notification.info({
        message: messageText,
        description,
        duration: 4,
        placement: "topRight",
      });
    }
  }, []);

  // Generic toast method
  const showToast = useCallback((config: ToastConfig) => {
    const { type, message: messageText, description, duration } = config;

    const toastConfig = {
      content: messageText,
      duration: duration ? duration / 1000 : type === "error" ? 5 : 3,
    };

    switch (type) {
      case "success":
        message.success(toastConfig);
        break;
      case "error":
        message.error(toastConfig);
        break;
      case "warning":
        message.warning(toastConfig);
        break;
      case "info":
        message.info(toastConfig);
        break;
    }

    if (description) {
      notification[type]({
        message: messageText,
        description,
        duration: duration ? duration / 1000 + 1 : type === "error" ? 6 : 4,
        placement: "topRight",
      });
    }
  }, []);

  // Handle API response and show appropriate toast
  const handleApiResponse = useCallback(
    (response: any, defaultMessage?: string) => {
      if (response?.success) {
        const message =
          response.message ||
          defaultMessage ||
          "Operation completed successfully";
        showSuccess(message);
      } else {
        const errorMessage =
          response?.message ||
          response?.error ||
          defaultMessage ||
          "An error occurred";
        showError(errorMessage);
      }
    },
    [showSuccess, showError]
  );

  // Handle API error
  const handleApiError = useCallback(
    (error: any, defaultMessage?: string) => {
      let errorMessage = defaultMessage || "An error occurred";

      if (error?.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error?.response?.data?.error) {
        errorMessage = error.response.data.error;
      } else if (error?.message) {
        errorMessage = error.message;
      }

      showError(errorMessage);
    },
    [showError]
  );

  return {
    showSuccess,
    showError,
    showWarning,
    showInfo,
    showToast,
    handleApiResponse,
    handleApiError,
  };
};
