import {Path, UseFormRegister} from "react-hook-form";
import {IFormValues} from "../../features/url/urlform";
import {IQrFormValues} from "../../features/qr/qrform";
import {IUserFormValues} from "../../features/auth/login";
import {Url} from "../../app/services/urlapi";
import {Profile} from "../profile";

type Props = {
    register: UseFormRegister<
        IFormValues | IQrFormValues | IUserFormValues | Url | Profile | { search: string } | any
    >;
    label: Path<IFormValues | IQrFormValues | IUserFormValues | Url | Profile | { search: string }>;
    placeholder: string;
    hidden: boolean;
    disabled?: boolean;
    type?: string;
};

const Input = ({label, register, placeholder, hidden, disabled, type}: Props) => {
    return (
        <input
            disabled={disabled}
            className="w-full rounded-full border border-slate-200 px-4 py-1 text-black"
            placeholder={placeholder}
            {...register(label)}
            hidden={hidden}
            type={type}
        />
    );
};

export default Input;
