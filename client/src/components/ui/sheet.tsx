import classNames from "classnames";
import { ReactNode, useEffect, useRef, useCallback, useState } from "react";
import { createPortal } from "react-dom";
import { LuX } from "react-icons/lu";

type SheetSide = "top" | "right" | "bottom" | "left";

interface SheetProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  children?: ReactNode;
  modal?: boolean;
}

interface SheetTriggerProps {
  children: ReactNode;
  asChild?: boolean;
  className?: string;
}

interface SheetContentProps {
  children: ReactNode;
  className?: string;
  side?: SheetSide;
  size?: "sm" | "md" | "lg" | "xl" | "full";
  showCloseButton?: boolean;
  closeOnOutsideClick?: boolean;
  closeOnEscape?: boolean;
}

interface SheetHeaderProps {
  children: ReactNode;
  className?: string;
}

interface SheetTitleProps {
  children: ReactNode;
  className?: string;
}

interface SheetDescriptionProps {
  children: ReactNode;
  className?: string;
}

interface SheetFooterProps {
  children: ReactNode;
  className?: string;
}

// Context for sheet state management
import { createContext, useContext } from "react";

interface SheetContextValue {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const SheetContext = createContext<SheetContextValue | null>(null);

const useSheet = () => {
  const context = useContext(SheetContext);
  if (!context) {
    throw new Error("Sheet components must be used within a Sheet");
  }
  return context;
};

/**
 * Main Sheet component - manages state and context
 */
const Sheet = ({ open = false, onOpenChange, children, modal = true }: SheetProps) => {
  const [internalOpen, setInternalOpen] = useState(open);

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

  const contextValue: SheetContextValue = {
    open: isOpen,
    onOpenChange: handleOpenChange,
  };

  return (
    <SheetContext.Provider value={contextValue}>
      {children}
    </SheetContext.Provider>
  );
};

/**
 * Sheet Trigger - opens the sheet
 */
const SheetTrigger = ({ children, asChild = false, className }: SheetTriggerProps) => {
  const { onOpenChange } = useSheet();

  const handleClick = useCallback(() => {
    onOpenChange(true);
  }, [onOpenChange]);

  if (asChild && typeof children === 'object' && children !== null && 'props' in children) {
    return {
      ...children,
      props: {
        ...children.props,
        onClick: handleClick,
        className: classNames(children.props.className, className),
      },
    };
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className={className}
    >
      {children}
    </button>
  );
};

/**
 * Sheet Overlay - backdrop/overlay component
 */
const SheetOverlay = ({ className }: { className?: string }) => {
  const { open, onOpenChange } = useSheet();

  if (!open) return null;

  return createPortal(
    <div
      className={classNames(
        "fixed inset-0 z-50 bg-black/50 backdrop-blur-sm",
        "data-[state=open]:animate-in data-[state=open]:fade-in-0",
        "data-[state=closed]:animate-out data-[state=closed]:fade-out-0",
        className
      )}
      data-state={open ? "open" : "closed"}
      onClick={() => onOpenChange(false)}
    />,
    document.body
  );
};

/**
 * Sheet Content - main content container
 */
const SheetContent = ({
  children,
  className,
  side = "right",
  size = "md",
  showCloseButton = true,
  closeOnOutsideClick = true,
  closeOnEscape = true,
}: SheetContentProps) => {
  const { open, onOpenChange } = useSheet();
  const contentRef = useRef<HTMLDivElement>(null);

  // Handle escape key
  useEffect(() => {
    if (!closeOnEscape) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && open) {
        onOpenChange(false);
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [open, onOpenChange, closeOnEscape]);

  // Handle outside click
  useEffect(() => {
    if (!closeOnOutsideClick) return;

    const handleOutsideClick = (e: MouseEvent) => {
      if (
        open &&
        contentRef.current &&
        !contentRef.current.contains(e.target as Node)
      ) {
        onOpenChange(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [open, onOpenChange, closeOnOutsideClick]);

  // Focus management
  useEffect(() => {
    if (open && contentRef.current) {
      const focusableElements = contentRef.current.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      const firstElement = focusableElements[0] as HTMLElement;
      firstElement?.focus();
    }
  }, [open]);

  // Body scroll lock
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = "unset";
      };
    }
  }, [open]);

  if (!open) return null;

  const sizeClasses = {
    sm: {
      right: "w-80",
      left: "w-80",
      top: "h-1/3",
      bottom: "h-1/3",
    },
    md: {
      right: "w-96",
      left: "w-96",
      top: "h-1/2",
      bottom: "h-1/2",
    },
    lg: {
      right: "w-[500px]",
      left: "w-[500px]",
      top: "h-2/3",
      bottom: "h-2/3",
    },
    xl: {
      right: "w-[600px]",
      left: "w-[600px]",
      top: "h-3/4",
      bottom: "h-3/4",
    },
    full: {
      right: "w-full",
      left: "w-full",
      top: "h-full",
      bottom: "h-full",
    },
  };

  const positionClasses = {
    top: "top-0 left-0 right-0 border-b",
    right: "top-0 right-0 bottom-0 border-l",
    bottom: "bottom-0 left-0 right-0 border-t",
    left: "top-0 left-0 bottom-0 border-r",
  };

  const animationClasses = {
    top: "data-[state=open]:slide-in-from-top data-[state=closed]:slide-out-to-top",
    right: "data-[state=open]:slide-in-from-right data-[state=closed]:slide-out-to-right",
    bottom: "data-[state=open]:slide-in-from-bottom data-[state=closed]:slide-out-to-bottom",
    left: "data-[state=open]:slide-in-from-left data-[state=closed]:slide-out-to-left",
  };

  return createPortal(
    <>
      <SheetOverlay />
      <div
        ref={contentRef}
        role="dialog"
        aria-modal="true"
        className={classNames(
          "fixed z-50 bg-base-100 shadow-lg",
          "data-[state=open]:animate-in data-[state=closed]:animate-out",
          "data-[state=closed]:duration-300 data-[state=open]:duration-500",
          positionClasses[side],
          sizeClasses[size][side],
          animationClasses[side],
          className
        )}
        data-state={open ? "open" : "closed"}
      >
        {showCloseButton && (
          <button
            onClick={() => onOpenChange(false)}
            className="absolute top-4 right-4 z-10 rounded-sm opacity-70 ring-offset-base-100 transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
            aria-label="Close"
          >
            <LuX className="h-4 w-4" />
          </button>
        )}
        <div className="h-full overflow-auto">
          {children}
        </div>
      </div>
    </>,
    document.body
  );
};

/**
 * Sheet Header - header section
 */
const SheetHeader = ({ children, className }: SheetHeaderProps) => {
  return (
    <div className={classNames("flex flex-col space-y-2 text-center sm:text-left p-6 pb-0", className)}>
      {children}
    </div>
  );
};

/**
 * Sheet Title - title component
 */
const SheetTitle = ({ children, className }: SheetTitleProps) => {
  return (
    <h2 className={classNames("text-lg font-semibold text-base-content", className)}>
      {children}
    </h2>
  );
};

/**
 * Sheet Description - description component
 */
const SheetDescription = ({ children, className }: SheetDescriptionProps) => {
  return (
    <p className={classNames("text-sm text-base-content/70", className)}>
      {children}
    </p>
  );
};

/**
 * Sheet Footer - footer section
 */
const SheetFooter = ({ children, className }: SheetFooterProps) => {
  return (
    <div className={classNames("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 p-6 pt-0", className)}>
      {children}
    </div>
  );
};

// Legacy compatibility - a simple sheet with a trigger function
interface LegacySheetProps {
  classnames?: string;
  triggerFn?: React.Dispatch<React.SetStateAction<boolean>> | (() => void);
}

const LegacySheet = ({ classnames, triggerFn }: LegacySheetProps) => {
  const handleClick = useCallback(() => {
    if (triggerFn) {
      if (typeof triggerFn === 'function') {
        // Handle both boolean setter and regular function
        try {
          triggerFn(false as any);
        } catch {
          triggerFn(false);
        }
      }
    }
  }, [triggerFn]);

  return (
    <div
      onClick={handleClick}
      className={classNames(
        "fixed inset-0 z-50 bg-black/50 backdrop-blur-sm",
        classnames
      )}
    />
  );
};

export {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
  SheetOverlay,
//   LegacySheet as Sheet, // For backward compatibility
};

// Export the new Sheet as default, but keep legacy as named export
export default Sheet;
