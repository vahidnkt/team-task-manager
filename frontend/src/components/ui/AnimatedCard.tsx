import React from "react";
import { cn } from "../../utils/helpers";

interface AnimatedCardProps {
  children: React.ReactNode;
  className?: string;
  variant?: "default" | "glass" | "gradient" | "hover-scale";
  hover3d?: boolean;
  onClick?: () => void;
}

const AnimatedCard: React.FC<AnimatedCardProps> = ({
  children,
  className,
  variant = "default",
  hover3d = true,
  onClick
}) => {
  const baseClasses = "rounded-xl transition-all duration-300 transform";

  const variantClasses = {
    default: "bg-white border border-gray-200 shadow-sm hover:shadow-lg",
    glass: "glass-card",
    gradient: "bg-white border border-gray-200 shadow-sm hover:shadow-2xl",
    "hover-scale": "bg-white border border-gray-200 shadow-sm hover:shadow-xl"
  };

  const hoverClasses = hover3d
    ? "hover:scale-105 hover:-translate-y-3 hover:shadow-2xl hover:shadow-blue-500/20 hover:rotate-1"
    : "hover:shadow-lg";

  const interactiveClasses = onClick
    ? "cursor-pointer active:scale-95 active:translate-y-1"
    : "";

  return (
    <div
      className={cn(
        baseClasses,
        variantClasses[variant],
        hoverClasses,
        interactiveClasses,
        "animate-fade-in",
        "group",
        className
      )}
      onClick={onClick}
      style={{
        transformStyle: "preserve-3d",
        perspective: "1000px",
        willChange: "transform"
      }}
    >
      {children}
    </div>
  );
};

export default AnimatedCard;