import React, { Dispatch, SetStateAction, forwardRef } from "react";
import { Path, UseFormRegister } from "react-hook-form";
import { Url } from "../../app/services/urlapi";
import {CreateLinkInBioProp} from "./modals/create-link-in-bio-modal";

type Props = {
  isChecked: boolean;
  fn?: Dispatch<SetStateAction<boolean>>;
  register?: UseFormRegister<Url | CreateLinkInBioProp | any>;
  disabled?: boolean;
  label: Path<Url | CreateLinkInBioProp>;
};

const Switch = ({ isChecked, fn, register, disabled, label }: Props) => {
  const handleToggle = () => {
    if (!fn) return;
    fn(!isChecked);
  };

  return (
    <label className="relative inline-flex cursor-pointer items-center">
      <input
        disabled={disabled}
        {...(register && register(label))}
        type="checkbox"
        className="sr-only peer"
        checked={isChecked}
        {...(fn && { onChange: handleToggle })}
        // onChange={handleToggle}
      />
      <div className="w-11 h-6 bg-gray-200 rounded-full peer-focus:ring-2 peer-focus:ring-indigo-300 peer-checked:bg-indigo-500 peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-1/2 after:left-1 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transform after:-translate-y-1/2 after:transition-all peer-checked:after:border-blue-600"></div>
    </label>
  );
};

export default Switch;
