import classNames from "classnames";
import React, { ReactNode, forwardRef } from "react";

export interface SelectProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {
  children: ReactNode;
  classnames?: string;
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ children, classnames, ...props }, ref) => (
    <select
      ref={ref}
      {...props}
      className={classNames("", classnames)}
    >
      {children}
    </select>
  )
);

export default Select;
