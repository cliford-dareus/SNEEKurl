import React from "react";
import { useAppSelector } from "../app/hook";
import { RootState } from "../app/store";
import Header from "../components/Header";

const Recent = () => {
  const user = useAppSelector((state: RootState) => state.auth);
  return (
    <div className="w-full h-full">
      <div>recent</div>
    </div>
  );
};

export default Recent;
