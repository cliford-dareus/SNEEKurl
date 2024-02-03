import classNames from "classnames";
import React, { ReactNode, useEffect, useRef } from "react";

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
    <div className={classNames("relative", classnames)} ref={Ref}>
      {children}
    </div>
  );
};

const Popover = ({ classnames, children }: Props) => {
  return (
    <div
      className={classNames(
        classnames,
        "absolute min-w-[200px] p-4 bg-slate-300 rounded-lg top-0 z-20"
      )}
    >
      {children}
    </div>
  );
};

export { Popover, PopoverContainer };
