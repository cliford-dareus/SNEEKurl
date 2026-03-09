import React, {forwardRef} from "react";
import classNames from "classnames";
import {toast} from "react-toastify";

interface InputProps extends React.ComponentProps<"input"> {
    className?: string;
    error?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
    ({className = "", error, ...props}, ref) => {

        if(!!error){
            toast.error(error)
        };

        return (
            <div className="w-full relative">
                <input
                    ref={ref}
                    data-slot="input"
                    className={classNames(
                        "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
                        "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
                        "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
                        error && "border-red-500 ring-red-500/20",
                        className
                    )}
                    {...props}
                />
            </div>
        );
    }
);

Input.displayName = "Input";

export default Input;
