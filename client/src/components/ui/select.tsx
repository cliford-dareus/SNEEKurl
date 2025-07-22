import classNames from "classnames";
import React, { ReactNode, forwardRef } from "react";
import { LuCheckCheck } from "react-icons/lu";

export interface SelectProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {
  children: ReactNode;
  classnames?: string;
}
export interface OptionProps
  extends React.OptionHTMLAttributes<HTMLOptionElement> {
  children: ReactNode;
  classnames?: string;
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ children, classnames, ...props }, ref) => (
    <select
      ref={ref}
      {...props}
      className={classNames(
        "relative w-full cursor-default rounded-md bg-white py-1.5 pl-3 pr-10 text-left text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-primary sm:text-sm sm:leading-6",
        classnames
      )}
    >
      {children}
    </select>
  )
);

const Option = forwardRef<HTMLOptionElement, OptionProps>(
  ({ children, classnames, ...props }, ref) => (
    <option
      ref={ref}
      className={classNames(
        " flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
        classnames
      )}
      {...props}
    >
      {children}
    </option>
  )
);

export { Select, Option };
