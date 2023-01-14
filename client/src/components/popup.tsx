import React ,{useEffect, useState} from 'react';;

const Popup = (props:{ msg: string, pop: boolean, setPop: any}) => {
    useEffect(()=> {
        setTimeout(()=>{
            props.setPop(false)
        }, 1000)
    }, [props.pop])

  return (
    <div
      className={`${
        props.pop ? "-translate-x-0" : ""
      } absolute bottom-8 right-0 w-2/5 lg:w-2/12 bg-red-700 p-4 translate-x-full transition-all duration-700 rounded-md `}
    >
      {props.msg}
    </div>
  );
};

export default Popup;