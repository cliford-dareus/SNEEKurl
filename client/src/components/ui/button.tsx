import classNames from "classnames";
import { ReactNode, forwardRef } from "react";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  classnames?: string;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ children, classnames, ...props }, ref) => {
    return (
      <button
        ref={ref}
        {...props}
        className={classNames(classnames,"px-4 py-1 inline-flex justify-center items-center bg-indigo-500 text-white rounded-full gap-2")}
      >
        {children}
      </button>
    );
  }
);

export default Button;
