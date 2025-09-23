import React from "react";
import { cn } from "../../utils/helpers";
import AnimatedCard from "./AnimatedCard";

interface StatsCardProps {
  title: string;
  value: number;
  subtitle: string;
  color: "primary" | "success" | "warning" | "error" | "secondary";
  icon: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
}

const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  subtitle,
  color,
  icon,
  trend,
  className
}) => {
  const colorClasses = {
    primary: {
      iconBg: "text-primary-600 bg-primary-50 border-primary-100",
      accent: "text-primary-600"
    },
    success: {
      iconBg: "text-success-600 bg-success-50 border-success-100",
      accent: "text-success-600"
    },
    warning: {
      iconBg: "text-warning-600 bg-warning-50 border-warning-100",
      accent: "text-warning-600"
    },
    error: {
      iconBg: "text-error-600 bg-error-50 border-error-100",
      accent: "text-error-600"
    },
    secondary: {
      iconBg: "text-secondary-600 bg-secondary-50 border-secondary-100",
      accent: "text-secondary-600"
    }
  };

  return (
    <AnimatedCard
      variant="gradient"
      hover3d={true}
      className={cn("group overflow-hidden relative", className)}
    >
      {/* Gradient overlay for enhanced 3D effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-white via-white to-gray-50 opacity-0 group-hover:opacity-100 transition-all duration-300" />

      {/* Glow effect */}
      <div className="absolute -inset-0.5 bg-gradient-to-r from-primary-600 to-purple-600 rounded-xl opacity-0 group-hover:opacity-20 blur transition-all duration-300" />

      <div className="card-content relative z-10">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
            <div className="flex items-baseline gap-2">
              <p className="text-3xl font-bold text-gray-900 group-hover:text-gray-800 transition-colors">
                {value.toLocaleString()}
              </p>
              {trend && (
                <span
                  className={cn(
                    "text-xs font-medium px-2 py-1 rounded-full",
                    trend.isPositive
                      ? "text-green-700 bg-green-100"
                      : "text-red-700 bg-red-100"
                  )}
                >
                  {trend.isPositive ? "+" : ""}{trend.value}%
                </span>
              )}
            </div>
            <p className="text-sm text-gray-500 mt-1">{subtitle}</p>
          </div>

          {/* 3D Icon Container */}
          <div
            className={cn(
              "p-4 rounded-2xl border-2 transition-all duration-500",
              "group-hover:scale-125 group-hover:rotate-12 group-hover:shadow-2xl",
              "group-hover:-translate-y-2 group-hover:shadow-blue-500/30",
              "transform-gpu", // Hardware acceleration
              colorClasses[color].iconBg
            )}
            style={{
              transformStyle: "preserve-3d",
              transform: "translateZ(20px)",
              willChange: "transform"
            }}
          >
            <span className="text-2xl block transition-all duration-500 group-hover:scale-125 group-hover:rotate-12">
              {icon}
            </span>
          </div>
        </div>
      </div>

      {/* Bottom accent bar with pulsing effect */}
      <div
        className={cn(
          "absolute bottom-0 left-0 right-0 h-1 transition-all duration-500",
          "group-hover:h-3 group-hover:shadow-lg",
          colorClasses[color].iconBg.split(' ')[1] // Extract background color class
        )}
      />

      {/* Floating particles effect */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
        <div className="absolute top-1/4 left-1/4 w-1 h-1 bg-blue-400 rounded-full animate-ping" style={{ animationDelay: '0.2s' }} />
        <div className="absolute top-3/4 right-1/4 w-1 h-1 bg-purple-400 rounded-full animate-ping" style={{ animationDelay: '0.5s' }} />
        <div className="absolute top-1/2 right-1/3 w-1 h-1 bg-pink-400 rounded-full animate-ping" style={{ animationDelay: '0.8s' }} />
      </div>
    </AnimatedCard>
  );
};

export default StatsCard;