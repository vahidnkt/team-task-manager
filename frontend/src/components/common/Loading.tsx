import React from "react";
import { Spin, Skeleton as AntSkeleton } from "antd";
import { cn } from "../../utils/helpers";

// Loading Spinner Component using Ant Design
interface SpinnerProps {
  size?: "small" | "default" | "large";
  className?: string;
}

export const Spinner: React.FC<SpinnerProps> = ({
  size = "default",
  className,
}) => {
  return <Spin size={size} className={cn("text-brand-primary", className)} />;
};

// Loading Button Component using Ant Design
interface LoadingButtonProps {
  loading?: boolean;
  children: React.ReactNode;
  className?: string;
  type?: "primary" | "default" | "dashed" | "link" | "text";
  size?: "small" | "middle" | "large";
  onClick?: () => void;
}

export const LoadingButton: React.FC<LoadingButtonProps> = ({
  loading,
  children,
  className,
  type = "primary",
  size = "middle",
  onClick,
}) => {
  return (
    <button
      className={cn(
        "ant-btn",
        `ant-btn-${type}`,
        `ant-btn-${size}`,
        loading && "ant-btn-loading",
        className
      )}
      disabled={loading}
      onClick={onClick}
    >
      {loading && <Spin size="small" className="mr-2" />}
      {children}
    </button>
  );
};

// Skeleton Loading Components using Ant Design

interface SkeletonProps {
  className?: string;
  active?: boolean;
  loading?: boolean;
  children?: React.ReactNode;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  className,
  active = true,
  loading = true,
  children,
}) => {
  return (
    <AntSkeleton active={active} loading={loading} className={className}>
      {children}
    </AntSkeleton>
  );
};

// Card Skeleton
export const CardSkeleton: React.FC = () => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <AntSkeleton active>
        <AntSkeleton.Input style={{ width: "75%", marginBottom: 16 }} />
        <AntSkeleton.Input style={{ width: "50%", marginBottom: 16 }} />
        <AntSkeleton.Input style={{ width: "66%" }} />
      </AntSkeleton>
    </div>
  );
};

// List Skeleton
export const ListSkeleton: React.FC<{ count?: number }> = ({ count = 5 }) => {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="flex items-center space-x-4">
          <AntSkeleton.Avatar active size="large" />
          <div className="flex-1">
            <AntSkeleton active>
              <AntSkeleton.Input style={{ width: "75%", marginBottom: 8 }} />
              <AntSkeleton.Input style={{ width: "50%" }} />
            </AntSkeleton>
          </div>
        </div>
      ))}
    </div>
  );
};

// Table Skeleton
export const TableSkeleton: React.FC<{ rows?: number; cols?: number }> = ({
  rows = 5,
  cols = 4,
}) => {
  return (
    <div className="space-y-3">
      <AntSkeleton active>
        {/* Header */}
        <div className="grid grid-cols-4 gap-4 mb-4">
          {Array.from({ length: cols }).map((_, index) => (
            <AntSkeleton.Input key={index} style={{ width: "100%" }} />
          ))}
        </div>

        {/* Rows */}
        {Array.from({ length: rows }).map((_, rowIndex) => (
          <div key={rowIndex} className="grid grid-cols-4 gap-4 mb-2">
            {Array.from({ length: cols }).map((_, colIndex) => (
              <AntSkeleton.Input key={colIndex} style={{ width: "100%" }} />
            ))}
          </div>
        ))}
      </AntSkeleton>
    </div>
  );
};

// Page Loading Component
interface PageLoadingProps {
  message?: string;
}

export const PageLoading: React.FC<PageLoadingProps> = ({
  message = "Loading...",
}) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-64 space-y-4">
      <Spinner size="large" />
      <p className="text-gray-600 text-sm">{message}</p>
    </div>
  );
};

// Loading Overlay
interface LoadingOverlayProps {
  isLoading: boolean;
  children: React.ReactNode;
  message?: string;
}

export const LoadingOverlay: React.FC<LoadingOverlayProps> = ({
  isLoading,
  children,
  message = "Loading...",
}) => {
  if (!isLoading) return <>{children}</>;

  return (
    <div className="relative">
      {children}
      <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center rounded-lg">
        <div className="flex flex-col items-center space-y-2">
          <Spinner size="default" />
          <p className="text-gray-600 text-sm">{message}</p>
        </div>
      </div>
    </div>
  );
};
