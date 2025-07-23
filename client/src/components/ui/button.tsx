import classNames from "classnames";
import { ReactNode } from "react";

type Props = {
  children: ReactNode;
  classnames?: string;
  onClick?: () => void;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
};

const Button = ({ children, classnames, onClick, disabled, type = "button" }: Props) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={classNames(
        "flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-all duration-200 text-neutral-content",
        "hover:opacity-90 active:scale-95",
        "disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100",
        "focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2",
        "min-h-[40px]", // Ensure minimum touch target size for mobile
        classnames
      )}
    >
      {children}
    </button>
  );
};

export default Button;
