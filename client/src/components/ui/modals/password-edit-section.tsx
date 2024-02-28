import {useEffect, useState} from "react";
import Switch from "../switch";
import {Url} from "../../../app/services/urlapi";
import {UseFormRegister} from "react-hook-form";
import Input from "../Input";
import {useAppSelector} from "../../../app/hook";
import {selectCurrentUser} from "../../../features/auth/authslice";

type Props = {
    register: UseFormRegister<Url | any>;
    password: string;
    setvalue: any;
    plan: string;
};

const PasswordEditSection = ({register, password, setvalue, plan}: Props) => {
    const [enable, setEnable] = useState(!!password);
    const user = useAppSelector(selectCurrentUser);

    useEffect(() => {
        if (!enable) {
            setvalue("password", null);
        }
    }, [enable]);


    return (
        <>
            <div className="flex items-center justify-between">
                <p>Password</p>
                <Switch
                    label="password"
                    isChecked={enable}
                    fn={setEnable}
                    disabled={!(user.user.username !== "Guest" && plan !== "free")}
                />
            </div>

            {enable && (
                <div>
                    <Input
                        disabled={!(user.user.username !== "Guest" && plan !== "free")}
                        register={register}
                        label="password"
                        hidden={false}
                        placeholder="Enter password"
                    />
                </div>
            )}
        </>
    );
};

export default PasswordEditSection;
