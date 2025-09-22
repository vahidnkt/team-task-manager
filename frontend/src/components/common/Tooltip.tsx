import React, { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { cn } from "../../utils/helpers";

export interface TooltipProps {
  children: React.ReactNode;
  content: React.ReactNode;
  placement?: "top" | "bottom" | "left" | "right";
  delay?: number;
  disabled?: boolean;
  className?: string;
  contentClassName?: string;
}

type Position = {
  top: number;
  left: number;
  placement: "top" | "bottom" | "left" | "right";
};

export const Tooltip: React.FC<TooltipProps> = ({
  children,
  content,
  placement = "top",
  delay = 200,
  disabled = false,
  className,
  contentClassName,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [position, setPosition] = useState<Position>({
    top: 0,
    left: 0,
    placement,
  });
  const triggerRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const updatePosition = () => {
    if (!triggerRef.current || !tooltipRef.current) return;

    const triggerRect = triggerRef.current.getBoundingClientRect();
    const tooltipRect = tooltipRef.current.getBoundingClientRect();
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const scrollLeft =
      window.pageXOffset || document.documentElement.scrollLeft;

    let top = 0;
    let left = 0;
    let finalPlacement = placement;

    switch (placement) {
      case "top":
        top = triggerRect.top + scrollTop - tooltipRect.height - 8;
        left =
          triggerRect.left +
          scrollLeft +
          (triggerRect.width - tooltipRect.width) / 2;
        break;
      case "bottom":
        top = triggerRect.bottom + scrollTop + 8;
        left =
          triggerRect.left +
          scrollLeft +
          (triggerRect.width - tooltipRect.width) / 2;
        break;
      case "left":
        top =
          triggerRect.top +
          scrollTop +
          (triggerRect.height - tooltipRect.height) / 2;
        left = triggerRect.left + scrollLeft - tooltipRect.width - 8;
        break;
      case "right":
        top =
          triggerRect.top +
          scrollTop +
          (triggerRect.height - tooltipRect.height) / 2;
        left = triggerRect.right + scrollLeft + 8;
        break;
    }

    // Adjust if tooltip goes off screen
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    if (left < 0) {
      left = 8;
      finalPlacement = "right";
    } else if (left + tooltipRect.width > viewportWidth) {
      left = viewportWidth - tooltipRect.width - 8;
      finalPlacement = "left";
    }

    if (top < 0) {
      top = 8;
      finalPlacement = "bottom";
    } else if (top + tooltipRect.height > viewportHeight + scrollTop) {
      top = viewportHeight + scrollTop - tooltipRect.height - 8;
      finalPlacement = "top";
    }

    setPosition({ top, left, placement: finalPlacement });
  };

  const showTooltip = () => {
    if (disabled) return;

    timeoutRef.current = setTimeout(() => {
      setIsVisible(true);
      // Update position after a brief delay to ensure tooltip is rendered
      setTimeout(updatePosition, 0);
    }, delay);
  };

  const hideTooltip = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setIsVisible(false);
  };

  useEffect(() => {
    if (isVisible) {
      updatePosition();
    }
  }, [isVisible, placement]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };
  }, []);

  const getArrowClasses = () => {
    const baseClasses = "absolute w-2 h-2 bg-gray-900 transform rotate-45";

    switch (position.placement) {
      case "top":
        return `${baseClasses} -bottom-1 left-1/2 -translate-x-1/2`;
      case "bottom":
        return `${baseClasses} -top-1 left-1/2 -translate-x-1/2`;
      case "left":
        return `${baseClasses} -right-1 top-1/2 -translate-y-1/2`;
      case "right":
        return `${baseClasses} -left-1 top-1/2 -translate-y-1/2`;
      default:
        return baseClasses;
    }
  };

  return (
    <>
      <div
        ref={triggerRef}
        className={cn("inline-block", className)}
        onMouseEnter={showTooltip}
        onMouseLeave={hideTooltip}
        onFocus={showTooltip}
        onBlur={hideTooltip}
      >
        {children}
      </div>

      {isVisible &&
        !disabled &&
        createPortal(
          <div
            ref={tooltipRef}
            className={cn(
              "fixed z-50 px-2 py-1 text-sm text-white bg-gray-900 rounded shadow-lg pointer-events-none",
              "animate-in fade-in-0 zoom-in-95 duration-200",
              contentClassName
            )}
            style={{
              top: position.top,
              left: position.left,
            }}
          >
            {content}
            <div className={getArrowClasses()} />
          </div>,
          document.body
        )}
    </>
  );
};

// Hook for programmatic tooltip control
export const useTooltip = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [content, setContent] = useState<React.ReactNode>("");

  const showTooltip = (tooltipContent: React.ReactNode) => {
    setContent(tooltipContent);
    setIsVisible(true);
  };

  const hideTooltip = () => {
    setIsVisible(false);
  };

  return {
    isVisible,
    content,
    showTooltip,
    hideTooltip,
  };
};
