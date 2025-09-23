import { useCallback } from "react";

// Toast types
export type ToastType = "success" | "error" | "warning" | "info";

// Toast configuration
interface ToastConfig {
  type: ToastType;
  message: string;
  duration?: number;
}

// Toast hook for API responses - uses custom toast system
export const useToast = () => {
  // Dispatch toast event
  const dispatchToast = useCallback((type: ToastType, message: string) => {
    const event = new CustomEvent("toast", {
      detail: { type, message },
    });
    window.dispatchEvent(event);
  }, []);

  // Show success toast
  const showSuccess = useCallback(
    (messageText: string) => {
      dispatchToast("success", messageText);
    },
    [dispatchToast]
  );

  // Show error toast
  const showError = useCallback(
    (messageText: string) => {
      dispatchToast("error", messageText);
    },
    [dispatchToast]
  );

  // Show warning toast
  const showWarning = useCallback(
    (messageText: string) => {
      dispatchToast("warning", messageText);
    },
    [dispatchToast]
  );

  // Show info toast
  const showInfo = useCallback(
    (messageText: string) => {
      dispatchToast("info", messageText);
    },
    [dispatchToast]
  );

  // Generic toast method
  const showToast = useCallback(
    (config: ToastConfig) => {
      const { type, message: messageText } = config;
      dispatchToast(type, messageText);
    },
    [dispatchToast]
  );

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
