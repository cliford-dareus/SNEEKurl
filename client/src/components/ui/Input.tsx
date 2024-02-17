import { Path, UseFormRegister } from "react-hook-form";
import { IFormValues } from "../../features/url/urlform";
import { IQrFormValues } from "../../features/qr/qrform";
import { IUserFormValues } from "../../features/auth/login";
import { Url } from "../../app/services/urlapi";

type Props = {
  register: UseFormRegister<
    IFormValues | IQrFormValues | IUserFormValues | Url | any
  >;
  label: Path<IFormValues | IQrFormValues | IUserFormValues | Url>;
  placeholder: string;
  hidden: boolean;
  disabled?: boolean;
};

const Input = ({ label, register, placeholder, hidden, disabled }: Props) => {
  return (
    <input
      disabled={disabled}
      className="w-full rounded-full text-black py-1 px-4"
      placeholder={placeholder}
      {...register(label)}
      hidden={hidden}
    />
  );
};

export default Input;
