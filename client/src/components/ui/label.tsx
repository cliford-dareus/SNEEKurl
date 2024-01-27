import classNames from "classnames";
import React, { ReactNode } from "react";

type Props = {
  children: ReactNode;
  classnames?: string;
};

const Label = ({ children, classnames }: Props) => {
  return <label className={classNames(classnames)}>{children}</label>;
};

export default Label;
