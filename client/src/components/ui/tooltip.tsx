import classNames from "classnames";
import React, { createContext, useContext } from "react";
import Portal from "../portal";

type Props = {
  children: React.ReactNode;
  content?: string;
  direction?: "top" | "bottom" | "left" | "right";
  trigger?: React.Dispatch<React.SetStateAction<boolean>>;
};

/**
 * Component that wraps its children and displays a tooltip on hover.
 *
 * @param {Object} props - The component props.
 * @param {React.ReactNode} props.children - The content to be wrapped.
 * @param {string} [props.content] - The content of the tooltip.
 * @param {("top" | "bottom" | "left" | "right")} [props.direction] - The direction of the tooltip.
 * @return {React.ReactElement} The wrapped content.
 */
const TooltipTrigger = React.memo<Props>(
  ({ children, content, direction = "top" }: Props): React.ReactElement => {
    const [open, setOpen] =
      useContext<[boolean, React.Dispatch<React.SetStateAction<boolean>>]>(
        TooltipContext
      );

    const handleMouseEnter = React.useCallback((): void => {
      setOpen(true);
    }, [setOpen]);

    const handleMouseLeave = React.useCallback((): void => {
      setOpen(false);
    }, [setOpen]);

    return (
      <div
        className="cursor-pointer"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {children}
      </div>
    );
  }
);

const TooltipContext = React.createContext<
  [boolean, React.Dispatch<React.SetStateAction<boolean>>]
>([
  false,
  () => {
    return;
  },
]); // Default type for the context

/**
 * TooltipProvider context provider.
 * @param {Object} props - The component props.
 * @param {React.ReactNode} props.children - The component children.
 * @returns {JSX.Element} The rendered component.
 */
const TooltipProvider = React.memo(
  ({ children }: { children: React.ReactNode }): JSX.Element => {
    const [open, setOpen] = React.useState<boolean>(false);
    const value: [boolean, React.Dispatch<React.SetStateAction<boolean>>] = [
      open,
      setOpen,
    ];

    return (
      <TooltipContext.Provider value={value}>
        {children}
      </TooltipContext.Provider>
    );
  }
);

/**
 * Tooltip component.
 * @param {Object} props - The component props.
 * @param {string} props.content - The tooltip content.
 * @param {'top' | 'bottom' | 'left' | 'right'} props.direction - The tooltip direction.
 * @returns {JSX.Element} The rendered component.
 */
const Tooltip = ({
  content,
  direction,
  classnames
}: {
  content: string;
  direction: "top" | "bottom" | "left" | "right";
  classnames?: string;
}): JSX.Element => {
  const [open, setOpen] =
    useContext<[boolean, React.Dispatch<React.SetStateAction<boolean>>]>(
      TooltipContext
    );
  return (
    <>
      {open && (
        <div
          className={classNames(
            direction === "top" ? "bottom-[150%] left-[50%] " : "",
            direction === "bottom" ? "top-[150%] left-[50%]" : "",
            direction === "left" ? "right-[110%] top-[50%]" : "",
            direction === "right" ? "right-[110%] top-[50%]" : "",
            "absolute p-4 z-10 bg-indigo-400 rounded-md w-max text-white", classnames
          )}
        >
          {content}
        </div>
      )}
    </>
  );
};

export { Tooltip, TooltipTrigger, TooltipProvider };
