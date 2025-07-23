import classNames from "classnames";
import React, { createContext, useContext, useRef, useEffect, useState } from "react";
import Portal from "../portal";

type TooltipDirection = "top" | "bottom" | "left" | "right";

interface TooltipContextValue {
  open: boolean;
  setOpen: (open: boolean) => void;
  triggerRef: React.RefObject<HTMLElement>;
  content: string;
  direction: TooltipDirection;
  delay: number;
}

interface TooltipProviderProps {
  children: React.ReactNode;
  delayDuration?: number;
}

interface TooltipTriggerProps {
  children: React.ReactNode;
  asChild?: boolean;
}

interface TooltipContentProps {
  children?: React.ReactNode;
  content?: string;
  side?: TooltipDirection;
  sideOffset?: number;
  className?: string;
  arrowClassName?: string;
}

interface TooltipProps {
  children: React.ReactNode;
  content: string;
  side?: TooltipDirection;
  delayDuration?: number;
  sideOffset?: number;
  className?: string;
}

const TooltipContext = createContext<TooltipContextValue | null>(null);

const useTooltip = () => {
  const context = useContext(TooltipContext);
  if (!context) {
    throw new Error("Tooltip components must be used within TooltipProvider");
  }
  return context;
};

/**
 * TooltipProvider - Manages tooltip state and context
 */
const TooltipProvider = React.memo<TooltipProviderProps>(
  ({ children, delayDuration = 700 }) => {
    const [open, setOpen] = useState(false);
    const [content, setContent] = useState("");
    const [direction, setDirection] = useState<TooltipDirection>("top");
    const triggerRef = useRef<HTMLElement>(null);
    const timeoutRef = useRef<number>();

    const contextValue: TooltipContextValue = {
      open,
      setOpen: (newOpen: boolean) => {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }

        if (newOpen) {
          timeoutRef.current = setTimeout(() => setOpen(true), delayDuration);
        } else {
          setOpen(false);
        }
      },
      triggerRef,
      content,
      direction,
      delay: delayDuration,
    };

    // No imperative handle needed for HTMLElement ref

    useEffect(() => {
      return () => {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
      };
    }, []);

    return (
      <TooltipContext.Provider value={contextValue}>
        {children}
      </TooltipContext.Provider>
    );
  }
);

/**
 * TooltipTrigger - Handles hover events and triggers tooltip
 */
const TooltipTrigger = React.memo<TooltipTriggerProps>(
  ({ children, asChild = false }) => {
    const { setOpen, triggerRef } = useTooltip();
    const elementRef = useRef<HTMLElement>(null);

    const handleMouseEnter = React.useCallback(() => {
      setOpen(true);
    }, [setOpen]);

    const handleMouseLeave = React.useCallback(() => {
      setOpen(false);
    }, [setOpen]);

    const handleFocus = React.useCallback(() => {
      setOpen(true);
    }, [setOpen]);

    const handleBlur = React.useCallback(() => {
      setOpen(false);
    }, [setOpen]);

    // Merge refs
    const mergedRef = React.useCallback((node: HTMLElement) => {
      elementRef.current = node;
      if (triggerRef) {
        (triggerRef as React.MutableRefObject<HTMLElement>).current = node;
      }
    }, [triggerRef]);

    if (asChild && React.isValidElement(children)) {
      return React.cloneElement(children, {
        ref: mergedRef,
        onMouseEnter: handleMouseEnter,
        onMouseLeave: handleMouseLeave,
        onFocus: handleFocus,
        onBlur: handleBlur,
        tabIndex: 0,
      });
    }

    return (
      <span
        ref={mergedRef}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onFocus={handleFocus}
        onBlur={handleBlur}
        tabIndex={0}
        className="inline-block"
      >
        {children}
      </span>
    );
  }
);

/**
 * TooltipContent - Renders the actual tooltip with positioning
 */
const TooltipContent = React.memo<TooltipContentProps>(
  ({
    children,
    content,
    side = "top",
    sideOffset = 8,
    className,
    arrowClassName
  }) => {
    const { open, triggerRef } = useTooltip();
    const contentRef = useRef<HTMLDivElement>(null);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [actualSide, setActualSide] = useState(side);

    useEffect(() => {
      if (!open || !triggerRef.current || !contentRef.current) return;

      const updatePosition = () => {
        const trigger = triggerRef.current!;
        const tooltip = contentRef.current!;
        const triggerRect = trigger.getBoundingClientRect();
        const tooltipRect = tooltip.getBoundingClientRect();
        const viewport = {
          width: window.innerWidth,
          height: window.innerHeight,
        };

        let newSide = side;
        let x = 0;
        let y = 0;

        // Calculate initial position based on preferred side
        switch (side) {
          case "top":
            x = triggerRect.left + triggerRect.width / 2 - tooltipRect.width / 2;
            y = triggerRect.top - tooltipRect.height - sideOffset;
            break;
          case "bottom":
            x = triggerRect.left + triggerRect.width / 2 - tooltipRect.width / 2;
            y = triggerRect.bottom + sideOffset;
            break;
          case "left":
            x = triggerRect.left - tooltipRect.width - sideOffset;
            y = triggerRect.top + triggerRect.height / 2 - tooltipRect.height / 2;
            break;
          case "right":
            x = triggerRect.right + sideOffset;
            y = triggerRect.top + triggerRect.height / 2 - tooltipRect.height / 2;
            break;
        }

        // Check if tooltip would go outside viewport and flip if needed
        if (side === "top" && y < 0) {
          newSide = "bottom";
          y = triggerRect.bottom + sideOffset;
        } else if (side === "bottom" && y + tooltipRect.height > viewport.height) {
          newSide = "top";
          y = triggerRect.top - tooltipRect.height - sideOffset;
        } else if (side === "left" && x < 0) {
          newSide = "right";
          x = triggerRect.right + sideOffset;
        } else if (side === "right" && x + tooltipRect.width > viewport.width) {
          newSide = "left";
          x = triggerRect.left - tooltipRect.width - sideOffset;
        }

        // Ensure tooltip stays within viewport bounds
        x = Math.max(8, Math.min(x, viewport.width - tooltipRect.width - 8));
        y = Math.max(8, Math.min(y, viewport.height - tooltipRect.height - 8));

        setPosition({ x, y });
        setActualSide(newSide);
      };

      updatePosition();
      window.addEventListener("scroll", updatePosition);
      window.addEventListener("resize", updatePosition);

      return () => {
        window.removeEventListener("scroll", updatePosition);
        window.removeEventListener("resize", updatePosition);
      };
    }, [open, side, sideOffset, triggerRef]);

    if (!open) return null;

    const tooltipContent = content || children;

    return (
      <Portal>
        <div
          ref={contentRef}
          role="tooltip"
          className={classNames(
            // Base styles
            "fixed z-50 px-3 py-2 text-sm font-medium text-white bg-gray-900 rounded-lg shadow-lg",
            "animate-in fade-in-0 zoom-in-95",
            "data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95",
            // Dark mode
            "dark:bg-gray-800 dark:text-gray-100",
            // Custom className
            className
          )}
          style={{
            left: position.x,
            top: position.y,
          }}
          data-side={actualSide}
        >
          {tooltipContent}

          {/* Arrow */}
          <div
            className={classNames(
              "absolute w-2 h-2 bg-gray-900 dark:bg-gray-800 rotate-45",
              {
                "bottom-[-4px] left-1/2 -translate-x-1/2": actualSide === "top",
                "top-[-4px] left-1/2 -translate-x-1/2": actualSide === "bottom",
                "right-[-4px] top-1/2 -translate-y-1/2": actualSide === "left",
                "left-[-4px] top-1/2 -translate-y-1/2": actualSide === "right",
              },
              arrowClassName
            )}
          />
        </div>
      </Portal>
    );
  }
);

/**
 * Simple Tooltip wrapper component for easy usage
 */
const Tooltip = React.memo<TooltipProps>(
  ({ children, content, side = "top", delayDuration = 700, sideOffset = 8, className }) => {
    return (
      <TooltipProvider delayDuration={delayDuration}>
        <TooltipTrigger asChild>
          {children}
        </TooltipTrigger>
        <TooltipContent
          content={content}
          side={side}
          sideOffset={sideOffset}
          className={className}
        />
      </TooltipProvider>
    );
  }
);

// Set display names for debugging
TooltipProvider.displayName = "TooltipProvider";
TooltipTrigger.displayName = "TooltipTrigger";
TooltipContent.displayName = "TooltipContent";
Tooltip.displayName = "Tooltip";

export {
  Tooltip,
  TooltipProvider,
  TooltipTrigger,
  TooltipContent,
  useTooltip
};
