import React, { ReactNode } from "react";
import ReactDOM from "react-dom";

type Props = {
  children: ReactNode;
};

const Portal = ({ children }: Props) => {
  return ReactDOM.createPortal(
    children,
    document.getElementById("portal_root") as HTMLElement
  );
};

export default Portal;
