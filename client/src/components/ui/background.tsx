import React from "react";

type Props = {};

const Background = (props: Props) => {
  return (
    <div className="fixed inset-0 z-[-1] w-full bg-base-100 grid grid-cols-[repeat(20,1fr)] grid-rows-[repeat(20,1fr)]">
      {new Array(20*20).fill(0).map((_, i) => (
        <div key={i}>
          <svg
            className="stroke-base-300 w-full h-full"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 32 32"
            fill="none"
            stroke="currentColor"
          >
            <path d="M0 .5H31.5V32" />
          </svg>
        </div>
      ))}
      <div className="absolute pointer-events-none inset-0 flex items-center justify-center bg-base-200  [mask-image:radial-gradient(ellipse_at_center,transparent_10%,black)]"></div>
    </div>
  );
};

export default Background;
