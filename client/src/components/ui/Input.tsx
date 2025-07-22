import React from "react";
import { UseFormRegister } from "react-hook-form";

type Props = {
  register: UseFormRegister<any>;
  label: string;
  hidden: boolean;
  placeholder: string;
  disabled?: boolean;
  className?: string;
};

const Input = ({ register, label, hidden, placeholder, disabled = false, className = "" }: Props) => {
  return (
    <input
      className={`input input-bordered w-full ${className} ${disabled ? 'cursor-not-allowed' : ''}`}
      {...register(label)}
      type={hidden ? "password" : "text"}
      placeholder={placeholder}
      disabled={disabled}
    />
  );
};

export default Input;
