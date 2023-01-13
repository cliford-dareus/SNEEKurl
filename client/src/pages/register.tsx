import React, { ChangeEvent, FormEvent, useState } from "react";
import InputForm from "../components/InputForm";
import { useRegisterUserMutation } from "../features/api";

interface UserInterface {
  name: string;
  email: string;
  password: string;
}

const Register = () => {
  const [registerUser, { isLoading }] = useRegisterUserMutation();
  const [userInfo, setUserInfo] = useState<UserInterface>({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setUserInfo({ ...userInfo, [event.target.name]: event.target.value });
  };

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const { name, email, password } = userInfo;
    const body = { name, email, password };

    try {
      registerUser(body);
      setUserInfo({ name: "", email: "", password: "" });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="w-11/12 flex flex-col items-center sm:w-6/12">
      <h2 className="text-2xl text-white">Register</h2>
      <form
        onSubmit={onSubmit}
        action=""
        className="w-full flex flex-col gap-4 mt-8 bg-blue-900 py-8 px-6 rounded-md"
      >
        <InputForm
          name="name"
          type="text"
          placeholder="Name"
          value={userInfo.name}
          fn={handleChange}
        />
        <InputForm
          name="email"
          type="text"
          placeholder="Email"
          value={userInfo.email}
          fn={handleChange}
        />
        <InputForm
          name="password"
          type="password"
          placeholder="Password"
          value={userInfo.password}
          fn={handleChange}
        />

        <button className="bg-white p-2 mt-2 rounded-md border-none outline-none">
          Sign Up
        </button>
      </form>
    </div>
  );
};

export default Register;
