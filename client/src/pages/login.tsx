import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { useLoginUserMutation } from "../features/api";
import InputForm from "../components/ui/Input";
import { useAppDispatch } from "../app/hook";
import { setUser } from "../features/userSlice";
import { useNavigate } from "react-router-dom";
import { UserInterface } from "../types/types";

const Login = () => {
  const [loginUser, { data: data, isSuccess: isSuccess }] =
    useLoginUserMutation();
  const [userInfo, setUserInfo] = useState<UserInterface>({
    name: "",
    password: "",
  });

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setUserInfo({ ...userInfo, [event.target.name]: event.target.value });
  };

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const { name, password } = userInfo;

    if (!name || !password) {
      console.log("Please provide an email and password");
      return (
        <div className="text-white bg-white w-10 absolute h-11">
          Please provide an email and password
        </div>
      );
    }

    const body = { name, password };

    try {
      await loginUser(body);
      setUserInfo({ name: "", password: "" });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (!data) return;
    dispatch(setUser({ ...data }));
    if (isSuccess) navigate("/");
  }, [data]);

  return (
    <div className="w-11/12 flex flex-col items-center sm:w-6/12">
      <h2 className="text-2xl text-white">Login</h2>
      <form
        action=""
        className="w-full flex flex-col gap-4 mt-8 bg-blue-900 py-8 px-6 rounded-md"
        onSubmit={onSubmit}
      >
        <InputForm
          name="name"
          type="text"
          placeholder="Name"
          value={userInfo.name!}
          fn={handleChange}
        />
        <InputForm
          name="password"
          type="text"
          placeholder="Password"
          value={userInfo.password!}
          fn={handleChange}
        />

        <button className="bg-white p-2 mt-2 rounded-md border-none outline-none">
          Sign In
        </button>
      </form>
    </div>
  );
};

export default Login;
