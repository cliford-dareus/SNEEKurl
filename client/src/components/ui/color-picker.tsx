import React, {forwardRef, useEffect, useMemo, useRef, useState} from "react";
import {HexColorPicker} from "react-colorful";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "./popover";
import classNames from "classnames";
import {Button} from "./button";
import type {ButtonProps} from "./button";

interface ColorPickerProps {
    value: string;
    onChange: (value: string) => void;
    onBlur?: () => void;
}

const ColorPicker = forwardRef<
    HTMLInputElement,
    Omit<ButtonProps, "value" | "onChange" | "onBlur"> & ColorPickerProps
>(
    (
        {disabled, value, onChange, onBlur, name, className, ...props},
        forwardedRef
    ) => {
        const ref = useForwardedRef(forwardedRef);
        const [open, setOpen] = useState(false);

        const parsedValue = useMemo(() => {
            return value || "#FFFFFF";
        }, [value]);

        console.log(disabled)

        return (
            <Popover onOpenChange={setOpen} open={open}>
                <PopoverTrigger>
                    <Button
                        {...props}
                        className={classNames("block min-w-9", className)}
                        name={name}
                        onClick={() => {
                            setOpen(true);
                        }}
                        size="icon"
                        style={{
                            backgroundColor: parsedValue,
                        }}
                        variant="outline"
                    >
                        <div/>
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full">
                    <HexColorPicker color={parsedValue} onChange={onChange}/>
                </PopoverContent>
            </Popover>
        );
    }
);

ColorPicker.displayName = "ColorPicker";

export {ColorPicker};

export function useForwardedRef<T>(ref: React.ForwardedRef<T>) {
    const innerRef = useRef<T>(null);

    useEffect(() => {
        if (!ref) return;
        if (typeof ref === "function") {
            ref(innerRef.current);
        } else {
            ref.current = innerRef.current;
        }
    });

    return innerRef;
};