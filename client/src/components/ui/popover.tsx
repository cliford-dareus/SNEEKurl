import classNames from "classnames";
import React, { ReactNode, useEffect, useRef, useState, useCallback } from "react";
import { createPortal } from "react-dom";
import { createContext, useContext } from "react";

type PopoverSide = "top" | "right" | "bottom" | "left";
type PopoverAlign = "start" | "center" | "end";

interface PopoverProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  children?: ReactNode;
  modal?: boolean;
}

interface PopoverTriggerProps {
  children: ReactNode;
  asChild?: boolean;
  className?: string;
}

interface PopoverContentProps {
  children: ReactNode;
  className?: string;
  side?: PopoverSide;
  align?: PopoverAlign;
  sideOffset?: number;
  alignOffset?: number;
  avoidCollisions?: boolean;
  collisionPadding?: number;
  sticky?: "partial" | "always";
  hideWhenDetached?: boolean;
  arrowPadding?: number;
  showArrow?: boolean;
}

interface PopoverArrowProps {
  className?: string;
  width?: number;
  height?: number;
}

// Context for popover state management
interface PopoverContextValue {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  triggerRef: React.RefObject<HTMLElement>;
  mousePosition: { x: number; y: number };
}

const PopoverContext = createContext<PopoverContextValue | null>(null);

const usePopover = () => {
  const context = useContext(PopoverContext);
  if (!context) {
    throw new Error("Popover components must be used within a Popover");
  }
  return context;
};

/**
 * Main Popover component - manages state and context
 */
const Popover = ({ open = false, onOpenChange, children, modal = false }: PopoverProps) => {
  const [internalOpen, setInternalOpen] = useState(open);
  const triggerRef = useRef<HTMLElement>(null);

   // mouse position
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: MouseEvent) => {
    setMousePosition({ x: e.clientX, y: e.clientY });
  };

  useEffect(() => {
      window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [internalOpen]);

  const isControlled = onOpenChange !== undefined;
  const isOpen = isControlled ? open : internalOpen;

  const handleOpenChange = useCallback((newOpen: boolean) => {
    if (isControlled) {
      onOpenChange?.(newOpen);
    } else {
      setInternalOpen(newOpen);
    }
  }, [isControlled, onOpenChange]);

  // Sync external open state
  useEffect(() => {
    if (isControlled) {
      setInternalOpen(open);
    }
  }, [open, isControlled]);

  const contextValue: PopoverContextValue = {
    open: isOpen,
    onOpenChange: handleOpenChange,
    triggerRef,
    mousePosition,
  };

  return (
    <PopoverContext.Provider value={contextValue}>
      {children}
    </PopoverContext.Provider>
  );
};

/**
 * Popover Trigger - opens/closes the popover
 */
const PopoverTrigger = ({ children, asChild = false, className }: PopoverTriggerProps) => {
  const { onOpenChange, open, triggerRef } = usePopover();

  const handleClick = useCallback(() => {
    onOpenChange(!open);
  }, [onOpenChange, open]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onOpenChange(!open);
    }
  }, [onOpenChange, open]);

  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children, {
      ...children.props,
      ref: triggerRef,
      onClick: handleClick,
      onKeyDown: handleKeyDown,
      "aria-expanded": open,
      "aria-haspopup": "dialog",
      className: classNames(children.props.className, className),
    });
  }

  return (
    <button
      ref={triggerRef as React.RefObject<HTMLButtonElement>}
      type="button"
      onClick={handleClick}

      onKeyDown={handleKeyDown}
      aria-expanded={open}
      aria-haspopup="dialog"
      className={className}
    >
      {children}
    </button>
  );
};

/**
 * Popover Content - main content container with smart positioning
 */
const usePopoverPositioning = (
  open: boolean,
  triggerRef: React.RefObject<HTMLElement>,
  contentRef: React.RefObject<HTMLDivElement>,
  side: PopoverSide,
  align: PopoverAlign,
  sideOffset: number,
  alignOffset: number,
  avoidCollisions: boolean,
  collisionPadding: number
) => {
  const [position, setPosition] = useState({ x: 0, y: 0});
  const [actualSide, setActualSide] = useState(side);
  const [actualAlign, setActualAlign] = useState(align);
  const [isPositioned, setIsPositioned] = useState(false);

  const calculateInitialPosition = useCallback(() => {
    if (!triggerRef.current) return { x: 0, y: 0 };

    const triggerRect = triggerRef.current.getBoundingClientRect();
    let x = triggerRect.left;
    let y = triggerRect.bottom + sideOffset;

    // Calculate initial position based on side
    switch (side) {
      case "top":
        y = triggerRect.top - sideOffset;
        break;
      case "right":
        x = triggerRect.right + sideOffset;
        y = triggerRect.top;
        break;
      case "bottom":
        y = triggerRect.bottom + sideOffset;
        break;
      case "left":
        x = triggerRect.left - sideOffset;
        y = triggerRect.top;
        break;
    }

    return { x, y };
  }, [side, sideOffset]);

  const calculatePosition = useCallback(() => {
    if (!open || !triggerRef.current || !contentRef.current) return;

    const trigger = triggerRef.current;
    const content = contentRef.current;
    const triggerRect = trigger.getBoundingClientRect();
    const contentRect = content.getBoundingClientRect();
    const viewport = {
      width: window.innerWidth,
      height: window.innerHeight,
    };

    let x = 0;
    let y = 0;
    let newSide = side;
    let newAlign = align;

    // Calculate base position based on side
    switch (side) {
      case "top":
        x = triggerRect.left;
        y = triggerRect.top - contentRect.height - sideOffset;
        break;
      case "right":
        x = triggerRect.right + sideOffset;
        y = triggerRect.top;
        break;
      case "bottom":
        x = triggerRect.left;
        y = triggerRect.bottom + sideOffset;
        break;
      case "left":
        x = triggerRect.left - contentRect.width - sideOffset;
        y = triggerRect.top;
        break;
    }

    // Apply alignment
    if (side === "top" || side === "bottom") {
      switch (align) {
        case "start":
          x = triggerRect.left + alignOffset;
          break;
        case "center":
          x = triggerRect.left + triggerRect.width / 2 - contentRect.width / 2 + alignOffset;
          break;
        case "end":
          x = triggerRect.right - contentRect.width + alignOffset;
          break;
      }
    } else {
      switch (align) {
        case "start":
          y = triggerRect.top + alignOffset;
          break;
        case "center":
          y = triggerRect.top + triggerRect.height / 2 - contentRect.height / 2 + alignOffset;
          break;
        case "end":
          y = triggerRect.bottom - contentRect.height + alignOffset;
          break;
      }
    }

    // Collision detection and avoidance
    if (avoidCollisions) {
      if (side === "top" && y < collisionPadding) {
        newSide = "bottom";
        y = triggerRect.bottom + sideOffset;
      } else if (side === "bottom" && y + contentRect.height > viewport.height - collisionPadding) {
        newSide = "top";
        y = triggerRect.top - contentRect.height - sideOffset;
      } else if (side === "left" && x < collisionPadding) {
        newSide = "right";
        x = triggerRect.right + sideOffset;
      } else if (side === "right" && x + contentRect.width > viewport.width - collisionPadding) {
        newSide = "left";
        x = triggerRect.left - contentRect.width - sideOffset;
      }

      x = Math.max(collisionPadding, Math.min(x, viewport.width - contentRect.width - collisionPadding));
      y = Math.max(collisionPadding, Math.min(y, viewport.height - contentRect.height - collisionPadding));
    }

    setPosition({ x, y });
    setActualSide(newSide);
    setActualAlign(newAlign);
    setIsPositioned(true);
  }, [open, side, align, sideOffset, alignOffset, avoidCollisions, collisionPadding]);

  // Set initial position immediately when opening
  useEffect(() => {
    if (open && triggerRef.current) {
      const initialPos = calculateInitialPosition();
      setPosition(initialPos);
      setIsPositioned(true);
    } else if (!open) {
      setIsPositioned(false);
    }
  }, [open, calculateInitialPosition]);

  // Refine position after content is rendered
  useEffect(() => {
    if (!open || !isPositioned) return;

    const timer = setTimeout(() => {
      calculatePosition();
    }, 0);

    const handleScroll = () => calculatePosition();
    const handleResize = () => calculatePosition();

    window.addEventListener("scroll", handleScroll, true);
    window.addEventListener("resize", handleResize);

    return () => {
      clearTimeout(timer);
      window.removeEventListener("scroll", handleScroll, true);
      window.removeEventListener("resize", handleResize);
    };
  }, [open, isPositioned, calculatePosition]);

  return {
    position,
    actualSide,
    actualAlign,
    isPositioned,
  };
};

const PopoverContent = ({
  children,
  className,
  side = "bottom",
  align = "center",
  sideOffset = 8,
  alignOffset = 0,
  avoidCollisions = true,
  collisionPadding = 8,
  sticky = "partial",
  hideWhenDetached = false,
  arrowPadding = 0,
  showArrow = true,
}: PopoverContentProps) => {
  const { open, onOpenChange, triggerRef } = usePopover();
  const contentRef = useRef<HTMLDivElement>(null);

  const { position, actualSide, actualAlign, isPositioned } = usePopoverPositioning(
    open,
    triggerRef,
    contentRef,
    side,
    align,
    sideOffset,
    alignOffset,
    avoidCollisions,
    collisionPadding
  );

  // Handle outside click
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (
        open &&
        contentRef.current &&
        triggerRef.current &&
        !contentRef.current.contains(e.target as Node) &&
        !triggerRef.current.contains(e.target as Node)
      ) {
        onOpenChange(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [open, onOpenChange, triggerRef]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && open) {
        onOpenChange(false);
        triggerRef.current?.focus();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [open, onOpenChange, triggerRef]);

  if (!open) return null;

  return createPortal(
    <div
      ref={contentRef}
      role="dialog"
      aria-modal="false"
      className={classNames(
        "fixed z-50 min-w-[200px] p-4 bg-base-200 rounded-md border border-base-300 drop-shadow-lg",
        "transition-opacity duration-150",
        isPositioned ? "opacity-100" : "opacity-0",
        className
      )}
      style={{
        left: position.x,
        top: position.y,
      }}
      data-state={open ? "open" : "closed"}
      data-side={actualSide}
      data-align={actualAlign}
    >
      {children}
      {showArrow && isPositioned && <PopoverArrow />}
    </div>,
    document.body
  );
};

/**
 * Popover Arrow - arrow pointing to trigger
 */
const PopoverArrow = ({ className, width = 8, height = 4 }: PopoverArrowProps) => {
  const { triggerRef } = usePopover();
  const [side, setSide] = useState<PopoverSide>("bottom");

  useEffect(() => {
    // Get the actual side from the content element
    const content = document.querySelector('[role="dialog"][data-side]') as HTMLElement;
    if (content) {
      setSide(content.dataset.side as PopoverSide);
    }
  });

  const arrowClasses = {
    top: "bottom-[-4px] left-1/2 -translate-x-1/2 border-l-transparent border-r-transparent border-b-0 border-t-base-200",
    right: "left-[-4px] top-1/2 -translate-y-1/2 border-t-transparent border-b-transparent border-l-0 border-r-base-200",
    bottom: "top-[-4px] left-1/2 -translate-x-1/2 border-l-transparent border-r-transparent border-t-0 border-b-base-200",
    left: "right-[-4px] top-1/2 -translate-y-1/2 border-t-transparent border-b-transparent border-r-0 border-l-base-200",
  };

  return (
    <div
      className={classNames(
        "absolute w-2 h-2 border-4",
        arrowClasses[side],
        className
      )}
      style={{ width, height }}
    />
  );
};

// Simple Popover wrapper for easy usage
interface SimplePopoverProps {
  children: ReactNode;
  content: ReactNode;
  side?: PopoverSide;
  align?: PopoverAlign;
  className?: string;
  contentClassName?: string;
  showArrow?: boolean;
}

const SimplePopover = ({
  children,
  content,
  side = "bottom",
  align = "center",
  className,
  contentClassName,
  showArrow = true,
}: SimplePopoverProps) => {
  return (
    <Popover>
      <PopoverTrigger asChild className={className}>
        {children}
      </PopoverTrigger>
      <PopoverContent
        side={side}
        align={align}
        className={contentClassName}
        showArrow={showArrow}
      >
        {content}
      </PopoverContent>
    </Popover>
  );
};

export {
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverArrow,
  SimplePopover,
};

// Export the new Popover as default
export default Popover;
