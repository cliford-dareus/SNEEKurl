import classNames from "classnames";
import React, {ReactNode, useEffect, useRef, useState} from "react";

type Props = {
    children: ReactNode;
    classnames?: string;
};

type ContainerProps = {
    children: ReactNode;
    classnames?: string;
    triggerFn: React.Dispatch<React.SetStateAction<boolean>>;
};

const PopoverContainer = ({
                              children,
                              triggerFn,
                              classnames,
                          }: ContainerProps) => {
    const Ref = useRef<HTMLDivElement | null>(null);

    const handleClickOutside = (event: any) => {
        if (Ref.current && !Ref.current.contains(event.target)) {
            triggerFn(false);
        }
    };

    useEffect(() => {
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    });

    return (
        <div className={classNames("relative inset-0", classnames)}
             ref={Ref}>
            {children}
        </div>
    );
};

const Popover = ({classnames, children}: Props) => {
    const [isOutScreen, setIsOutScreen] = useState(false);
    const ref = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (!ref.current) {
            return;
        }

        const bounds = ref.current?.getBoundingClientRect().bottom;
        const win = window.innerHeight;

        if (bounds >= win) {
            setIsOutScreen(true)
        }
    }, []);

    return (
        <div
            ref={ref}
            className={classNames(
                "absolute min-w-[200px] p-4 bg-base-200 rounded-md right-2 z-20 animate-slide-up-fade items-center border border-base-300 drop-shadow-lg",
                isOutScreen ? "bottom-0" : "top-8 ",
                classnames
            )}
        >
            {children}
        </div>
    );
};

export {Popover, PopoverContainer};
