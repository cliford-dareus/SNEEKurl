import React from "react";
import { useAppSelector } from "../app/hook";
import { RootState } from "../app/store";
import Header from "../components/Header";

const Favorite = () => {
  const user = useAppSelector((state: RootState) => state.user);
  return (
    <div className="text-white w-full h-full">
      <Header user={user} />
      <div>
        <h1 className="text-white">favorite</h1>
        <div>ddddddddddddd</div>
      </div>
    </div>
  );
};

export default Favorite;
