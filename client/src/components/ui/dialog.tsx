import classNames from "classnames";
import { ReactNode, useEffect, useRef, useCallback, useState } from "react";
import { createPortal } from "react-dom";
import { LuX } from "react-icons/lu";
import { createContext, useContext } from "react";

interface DialogProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  children?: ReactNode;
  modal?: boolean;
}

interface DialogTriggerProps {
  children: ReactNode;
  asChild?: boolean;
  className?: string;
}

interface DialogContentProps {
  children: ReactNode;
  className?: string;
  size?: "sm" | "md" | "lg" | "xl" | "full";
  showCloseButton?: boolean;
  closeOnOutsideClick?: boolean;
  closeOnEscape?: boolean;
  position?: "center" | "top" | "bottom";
}

interface DialogHeaderProps {
  children: ReactNode;
  className?: string;
}

interface DialogTitleProps {
  children: ReactNode;
  className?: string;
}

interface DialogDescriptionProps {
  children: ReactNode;
  className?: string;
}

interface DialogFooterProps {
  children: ReactNode;
  className?: string;
}

// Context for dialog state management
interface DialogContextValue {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const DialogContext = createContext<DialogContextValue | null>(null);

const useDialog = () => {
  const context = useContext(DialogContext);
  if (!context) {
    throw new Error("Dialog components must be used within a Dialog");
  }
  return context;
};

/**
 * Main Dialog component - manages state and context
 */
const Dialog = ({ open = false, onOpenChange, children, modal = true }: DialogProps) => {
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

  const contextValue: DialogContextValue = {
    open: isOpen,
    onOpenChange: handleOpenChange,
  };

  return (
    <DialogContext.Provider value={contextValue}>
      {children}
    </DialogContext.Provider>
  );
};

/**
 * Dialog Trigger - opens the dialog
 */
const DialogTrigger = ({ children, asChild = false, className }: DialogTriggerProps) => {
  const { onOpenChange } = useDialog();

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
 * Dialog Overlay - backdrop/overlay component
 */
const DialogOverlay = ({ className }: { className?: string }) => {
  const { open, onOpenChange } = useDialog();

  if (!open) return null;

  return createPortal(
    <div
      className={classNames(
        "fixed inset-0 z-50 bg-black/50 backdrop-blur-sm",
        "data-[state=open]:animate-in data-[state=open]:fade-in-0",
        "data-[state=closed]:animate-out data-[state=closed]:fade-out-0",
        "transition-all duration-200",
        className
      )}
      data-state={open ? "open" : "closed"}
      onClick={() => onOpenChange(false)}
    />,
    document.body
  );
};

/**
 * Dialog Content - main content container
 */
const DialogContent = ({
  children,
  className,
  size = "md",
  showCloseButton = true,
  closeOnOutsideClick = true,
  closeOnEscape = true,
  position = "center",
}: DialogContentProps) => {
  const { open, onOpenChange } = useDialog();
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
    sm: "max-w-sm w-full",
    md: "max-w-md w-full",
    lg: "max-w-lg w-full",
    xl: "max-w-xl w-full",
    full: "max-w-[95vw] w-full max-h-[95vh]",
  };

  const positionClasses = {
    center: "top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2",
    top: "top-[10%] left-1/2 -translate-x-1/2",
    bottom: "bottom-[10%] left-1/2 -translate-x-1/2",
  };

  return createPortal(
    <>
      <DialogOverlay />
      <div
        ref={contentRef}
        role="dialog"
        aria-modal="true"
        className={classNames(
          "fixed z-50 bg-base-100 shadow-xl rounded-lg border border-base-300",
          "data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95",
          "data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95",
          "transition-all duration-200",
          sizeClasses[size],
          positionClasses[position],
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
        <div className="max-h-[80vh] overflow-auto">
          {children}
        </div>
      </div>
    </>,
    document.body
  );
};

/**
 * Dialog Header - header section
 */
const DialogHeader = ({ children, className }: DialogHeaderProps) => {
  return (
    <div className={classNames("flex flex-col space-y-2 text-center sm:text-left p-6 pb-4", className)}>
      {children}
    </div>
  );
};

/**
 * Dialog Title - title component
 */
const DialogTitle = ({ children, className }: DialogTitleProps) => {
  return (
    <h2 className={classNames("text-lg font-semibold text-base-content", className)}>
      {children}
    </h2>
  );
};

/**
 * Dialog Description - description component
 */
const DialogDescription = ({ children, className }: DialogDescriptionProps) => {
  return (
    <p className={classNames("text-sm text-base-content/70", className)}>
      {children}
    </p>
  );
};

/**
 * Dialog Footer - footer section
 */
const DialogFooter = ({ children, className }: DialogFooterProps) => {
  return (
    <div className={classNames("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 p-6 pt-4 border-t border-base-300", className)}>
      {children}
    </div>
  );
};

// Legacy compatibility - simple dialog with trigger function
interface LegacyDialogProps {
  classnames?: string;
  triggerFn?: React.Dispatch<React.SetStateAction<boolean>> | (() => void);
}

const LegacyDialog = ({ classnames, triggerFn }: LegacyDialogProps) => {
  const handleClick = useCallback(() => {
    if (triggerFn) {
      if (typeof triggerFn === 'function') {
        // Handle both boolean setter and regular function
        try {
          triggerFn(false as any);
        } catch {
          triggerFn();
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
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogOverlay,
  LegacyDialog,
};

// Export the new Dialog as default
export default Dialog;