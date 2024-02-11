import classNames from "classnames";
import { ReactNode, useEffect, useRef } from "react";

type Props = {
  classnames?: string;
  triggerFn?: React.Dispatch<React.SetStateAction<string>>;
};

type ContentProps = {
  children: ReactNode;
  classnames?: string;
};

const Sheet = ({classnames, triggerFn}: Props) => {
  const Ref = useRef<HTMLDivElement | null>(null);

  const handleClickOutside = (event: any) => {
    if (Ref.current && Ref.current.contains(event.target) && triggerFn) {
      triggerFn("");
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  });

  return (
    <div
      ref={Ref}
      className={classNames(
        "fixed inset-0 z-50 bg-gray-200 bg-opacity-10 backdrop-blur-md isolate"
      )}
    />
  );
};

const SheetContent = ({ children, classnames }: ContentProps) => {
  return <div className={classNames(classnames, "blur-0 z-50 ")}>{children}</div>;
};
export { Sheet, SheetContent };
