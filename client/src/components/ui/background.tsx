import React from "react";

type Props = {};

const Background = (props: Props) => {
  return (
    <div className="fixed inset-0 z-[-1] w-full dark:bg-black bg-white grid grid-cols-[repeat(20,1fr)] grid-rows-[repeat(20,1fr)]">
      {new Array(20*20).fill(0).map((_, i) => (
        <div key={i}>
          <svg
            className="stroke-slate-300 dark:stroke-white w-full h-full"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 32 32"
            fill="none"
            stroke="${value}"
          >
            <path d="M0 .5H31.5V32" />
          </svg>
        </div>
      ))}
      <div className="absolute pointer-events-none inset-0 flex items-center justify-center dark:bg-black bg-white [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"></div>
    </div>
  );
};

export default Background;
