import classNames from "classnames";
import { ReactNode } from "react";

type Props = {
  children: ReactNode;
  classnames: string;
};

const Sheet = ({ children, classnames }: Props) => {
  return (
    <div className="fixed inset-0 z-40 bg-gray-200 bg-opacity-10 backdrop-blur-md">
      <div className={classNames(classnames, "blur-0")}>{children}</div>
    </div>
  );
};

export default Sheet;
