import { useEffect } from "react";

const Popup = (props: { msg: string; pop: boolean; setPop: any }) => {
  const { msg, pop, setPop } = props;
  
  useEffect(() => {
    setTimeout(() => {
      setPop(false);
    }, 1000);
  }, [pop]);

  return (
    <div
      className={`${
        pop ? "translate-x-0" : ""
      } absolute bottom-8 right-0 w-2/5 lg:w-2/12 bg-red-700 p-4 translate-x-full transition-all duration-700 rounded-md `}
    >
      {msg}
    </div>
  );
};

export default Popup;
