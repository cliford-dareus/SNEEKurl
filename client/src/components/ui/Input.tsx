import { Path, UseFormRegister } from "react-hook-form";
import { IProps } from "../../Utils/types/types";
import { IFormValues } from "../../features/url/urlform";
import { IQrFormValues } from "../../features/qr/qrform";
import { IUserFormValues } from "../../features/auth/login";

type Props = {
  register: UseFormRegister<
    IFormValues | IQrFormValues | IUserFormValues | any
  >;
  label: Path<IFormValues | IQrFormValues | IUserFormValues>;
  placeholder: string;
  hidden: boolean;
};

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
