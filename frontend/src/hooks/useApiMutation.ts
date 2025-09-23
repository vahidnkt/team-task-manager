import { useCallback } from "react";
import { useToast } from "./useToast";

/**
 * Custom hook to handle API mutations with toast messages
 * The global toast middleware will handle success/error messages automatically
 * This hook is for additional custom handling if needed
 */
export const useApiMutation = () => {
  const { showSuccess, showError } = useToast();

  // For operations that need custom success messages beyond the default
  const showCustomSuccess = useCallback((messageText: string) => {
    showSuccess(messageText);
  }, [showSuccess]);

  // For operations that need custom error messages beyond the default
  const showCustomError = useCallback((messageText: string) => {
    showError(messageText);
  }, [showError]);

  // For showing loading messages (using a simple state approach)
  const showLoading = useCallback((messageText: string = "Loading...") => {
    // You can implement loading state here if needed
    // For now, we'll just console.log as placeholder
    console.log(`Loading: ${messageText}`);
  }, []);

  // Hide loading message
  const hideLoading = useCallback(() => {
    // Placeholder for hiding loading state
    console.log("Loading finished");
  }, []);

  // Handle mutation with custom loading state
  const executeWithLoading = useCallback(
    async (
      mutation: () => Promise<any>,
      loadingMessage?: string,
      successMessage?: string
    ) => {
      try {
        if (loadingMessage) {
          showLoading(loadingMessage);
        }

        const result = await mutation();

        hideLoading();

        if (successMessage) {
          showCustomSuccess(successMessage);
        }

        return { success: true, data: result };
      } catch (error: any) {
        hideLoading();

        // Error will be handled by middleware, but return error info
        return {
          success: false,
          error: error?.data?.message || error?.message || "Operation failed",
        };
      }
    },
    [showLoading, hideLoading, showCustomSuccess]
  );

  return {
    showCustomSuccess,
    showCustomError,
    showLoading,
    hideLoading,
    executeWithLoading,
  };
};