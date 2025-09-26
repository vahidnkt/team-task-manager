import React from "react";
import { Button } from "antd";
import { AlertTriangle, Info, CheckCircle, XCircle } from "lucide-react";
import { Modal } from "./Modal";

export interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  type?: "danger" | "warning" | "info" | "success";
  confirmText?: string;
  cancelText?: string;
  isLoading?: boolean;
  size?: "sm" | "md" | "lg";
}

const typeConfig = {
  danger: {
    icon: XCircle,
    iconColor: "text-red-600",
    iconBg: "bg-red-100",
    confirmVariant: "destructive" as const,
  },
  warning: {
    icon: AlertTriangle,
    iconColor: "text-yellow-600",
    iconBg: "bg-yellow-100",
    confirmVariant: "warning" as const,
  },
  info: {
    icon: Info,
    iconColor: "text-blue-600",
    iconBg: "bg-blue-100",
    confirmVariant: "default" as const,
  },
  success: {
    icon: CheckCircle,
    iconColor: "text-green-600",
    iconBg: "bg-green-100",
    confirmVariant: "success" as const,
  },
};

const sizeConfig = {
  sm: "sm",
  md: "md",
  lg: "lg",
} as const;

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  type = "warning",
  confirmText = "Confirm",
  cancelText = "Cancel",
  isLoading = false,
  size = "sm",
}) => {
  const config = typeConfig[type];
  const Icon = config.icon;

  const handleConfirm = () => {
    onConfirm();
  };

  const sizeClass = sizeConfig[size];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size={sizeClass}
      showCloseButton={false}
      closeOnBackdropClick={!isLoading}
      closeOnEscape={!isLoading}
    >
      <div className="flex items-start space-x-4">
        {/* Icon */}
        <div
          className={`flex-shrink-0 mx-auto flex items-center justify-center h-12 w-12 rounded-full ${config.iconBg} sm:mx-0 sm:h-10 sm:w-10`}
        >
          <Icon className={`h-6 w-6 ${config.iconColor}`} aria-hidden="true" />
        </div>

        {/* Content */}
        <div className="mt-3 text-center sm:mt-0 sm:text-left flex-1">
          <h3 className="text-lg font-medium leading-6 text-gray-900 mb-2">
            {title}
          </h3>
          <div className="mt-2">
            <p className="text-sm text-gray-500">{message}</p>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="mt-6 sm:mt-4 sm:flex sm:flex-row-reverse">
        <Button
          type="button"
          variant={config.confirmVariant}
          onClick={handleConfirm}
          loading={isLoading}
          disabled={isLoading}
          className="w-full sm:ml-3 sm:w-auto"
        >
          {confirmText}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={onClose}
          disabled={isLoading}
          className="mt-3 w-full sm:mt-0 sm:w-auto"
        >
          {cancelText}
        </Button>
      </div>
    </Modal>
  );
};

// Hook for easy confirmation dialogs
export const useConfirmDialog = () => {
  const [dialog, setDialog] = React.useState<{
    isOpen: boolean;
    props: Omit<ConfirmDialogProps, "isOpen" | "onClose">;
  }>({
    isOpen: false,
    props: {
      title: "",
      message: "",
      onConfirm: () => {},
    },
  });

  const showConfirm = (
    props: Omit<ConfirmDialogProps, "isOpen" | "onClose">
  ) => {
    setDialog({
      isOpen: true,
      props,
    });
  };

  const hideConfirm = () => {
    setDialog((prev) => ({ ...prev, isOpen: false }));
  };

  const ConfirmDialogComponent = (
    <ConfirmDialog
      {...dialog.props}
      isOpen={dialog.isOpen}
      onClose={hideConfirm}
    />
  );

  return {
    showConfirm,
    hideConfirm,
    ConfirmDialogComponent,
  };
};
