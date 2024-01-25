import { Path, UseFormRegister } from "react-hook-form";
import { IProps } from "../../types/types";
import { IFormValues } from "../urlform";
import { IQrFormValues } from "../qrform";

type Props = {
  register:UseFormRegister<IFormValues | IQrFormValues | any>
  label: Path<IFormValues | IQrFormValues>
  placeholder: string
  hidden: boolean
}

const Input = ({ label, register, placeholder, hidden }: Props) => {
  return (
    <input
      className="w-full rounded-full text-black py-1 px-4"
      placeholder={placeholder}
      {...register(label)}
      hidden={hidden}
    />
  );
};

export default Input;
