import React, { useState, useEffect } from "react";
import { Transition } from "@headlessui/react";
import {
  CheckCircleIcon,
  XCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

export type ToastType = "success" | "error" | "warning" | "info";

export interface Toast {
  id: string;
  type: ToastType;
  message: string;
  duration?: number;
}

interface ToastItemProps {
  toast: Toast;
  onRemove: (id: string) => void;
}

const ToastItem: React.FC<ToastItemProps> = ({ toast, onRemove }) => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    // Show toast after mounting
    setShow(true);

    // Auto-remove toast after duration
    const timer = setTimeout(() => {
      setShow(false);
      // Wait for animation to complete before removing
      setTimeout(() => onRemove(toast.id), 300);
    }, toast.duration || 5000);

    return () => clearTimeout(timer);
  }, [toast.id, toast.duration, onRemove]);

  const getToastIcon = () => {
    switch (toast.type) {
      case "success":
        return <CheckCircleIcon className="h-6 w-6 text-green-400" />;
      case "error":
        return <XCircleIcon className="h-6 w-6 text-red-400" />;
      case "warning":
        return <ExclamationTriangleIcon className="h-6 w-6 text-yellow-400" />;
      case "info":
        return <InformationCircleIcon className="h-6 w-6 text-blue-400" />;
    }
  };

  const getToastColors = () => {
    switch (toast.type) {
      case "success":
        return "bg-white border-green-200 text-gray-900";
      case "error":
        return "bg-white border-red-200 text-gray-900";
      case "warning":
        return "bg-white border-yellow-200 text-gray-900";
      case "info":
        return "bg-white border-blue-200 text-gray-900";
    }
  };

  return (
    <Transition
      show={show}
      enter="transform ease-out duration-300 transition"
      enterFrom="translate-x-full opacity-0"
      enterTo="translate-x-0 opacity-100"
      leave="transform ease-in duration-300 transition"
      leaveFrom="translate-x-0 opacity-100"
      leaveTo="translate-x-full opacity-0"
    >
      <div
        className={`
          max-w-sm w-full shadow-lg rounded-lg border-l-4 p-4 mb-4
          ${getToastColors()}
        `}
      >
        <div className="flex items-start">
          <div className="flex-shrink-0">
            {getToastIcon()}
          </div>
          <div className="ml-3 flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 break-words">
              {toast.message}
            </p>
          </div>
          <div className="ml-4 flex-shrink-0">
            <button
              className="inline-flex rounded-md text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
              onClick={() => {
                setShow(false);
                setTimeout(() => onRemove(toast.id), 300);
              }}
            >
              <span className="sr-only">Close</span>
              <XMarkIcon className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </Transition>
  );
};

interface ToastContainerProps {
  position?: "top-right" | "top-left" | "bottom-right" | "bottom-left";
}

export const ToastContainer: React.FC<ToastContainerProps> = ({
  position = "top-right",
}) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  useEffect(() => {
    const handleToast = (event: CustomEvent<{ type: ToastType; message: string }>) => {
      const { type, message } = event.detail;
      const id = Date.now().toString() + Math.random().toString(36).substr(2, 9);

      const newToast: Toast = {
        id,
        type,
        message,
        duration: type === "error" ? 7000 : 5000, // Errors stay longer
      };

      setToasts((prev) => [...prev, newToast]);
    };

    window.addEventListener("toast", handleToast as EventListener);
    return () => window.removeEventListener("toast", handleToast as EventListener);
  }, []);

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  const getPositionClasses = () => {
    switch (position) {
      case "top-right":
        return "fixed top-4 right-4 z-50";
      case "top-left":
        return "fixed top-4 left-4 z-50";
      case "bottom-right":
        return "fixed bottom-4 right-4 z-50";
      case "bottom-left":
        return "fixed bottom-4 left-4 z-50";
    }
  };

  return (
    <div className={`${getPositionClasses()} flex flex-col space-y-2 max-w-sm pointer-events-none`}>
      <div className="pointer-events-auto">
        {toasts.map((toast) => (
          <ToastItem
            key={toast.id}
            toast={toast}
            onRemove={removeToast}
          />
        ))}
      </div>
    </div>
  );
};

// Hook for using toast functionality
export const useToast = () => {
  const showToast = (type: ToastType, message: string) => {
    const event = new CustomEvent("toast", {
      detail: { type, message },
    });
    window.dispatchEvent(event);
  };

  const showSuccess = (message: string) => showToast("success", message);
  const showError = (message: string) => showToast("error", message);
  const showWarning = (message: string) => showToast("warning", message);
  const showInfo = (message: string) => showToast("info", message);

  return {
    showToast,
    showSuccess,
    showError,
    showWarning,
    showInfo,
  };
};