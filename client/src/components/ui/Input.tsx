import {Path, UseFormRegister} from "react-hook-form";
import {IFormValues} from "../../features/url/urlform";
import {IQrFormValues} from "../../features/qr/qrform";
import {IUserFormValues} from "../../features/auth/login";
import {Url} from "../../app/services/urlapi";
import {Profile} from "../profile";
import {CreateLinkInBioProp} from "./modals/create-link-in-bio-modal";

type Props = {
    register: UseFormRegister<
        IFormValues
        | IQrFormValues
        | IUserFormValues
        | Url
        | Profile
        | CreateLinkInBioProp
        | { search: string } | any
    >;
    label: Path<
        IFormValues
        | IQrFormValues
        | IUserFormValues
        | Url
        | Profile
        | CreateLinkInBioProp
        | { search: string }
    >;
    placeholder: string;
    hidden: boolean;
    disabled?: boolean;
    type?: string;
};

const Input = ({label, register, placeholder, hidden, disabled, type}: Props) => {
    return (
        <input
            disabled={disabled}
            className="w-full rounded-full border border-slate-200 px-4 py-1 text-black focus:ring-2 focus:ring-indigo-500 outline-none"
            placeholder={placeholder}
            {...register(label)}
            hidden={hidden}
            type={type}
        />
    );
};

export default Input;
