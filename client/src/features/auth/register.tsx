import { SubmitHandler, useForm } from "react-hook-form";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/button";
import { Link } from "react-router-dom";
import { useRegisterMutation } from "../../app/services/auth";

type Props = {};

export type IUserFormValues = {
  name: string;
  email: string;
  password: string;
};

const Register = (props: Props) => {
  const [useRegister, { isLoading, isSuccess }] = useRegisterMutation();
  const { register, handleSubmit } = useForm<IUserFormValues>();

  const onsubmit: SubmitHandler<IUserFormValues> = async (data) => {
    await useRegister({
      username: data.name,
      password: data.password,
      email: data.email,
    });
    
  };

  return (
    <div className="w-screen h-screen flex justify-center items-center">
      <div className="w-[400px] bg-red-500 rounded-xl">
        <div className="text-center bg-red-600 rounded-t-xl p-4">
          <h1 className="text-4xl">Sneek</h1>
          <p className="text-xl mt-2">
            Lorem ipsum dolor sit amet consectetur adipisicing.
          </p>
        </div>

        <div className="mt-4 p-4">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl">Register</h2>
            <div className="flex gap-2 items-center">
              <span>or</span>
              <Link className="underline" to="/login">
                login
              </Link>
            </div>
          </div>

          <form
            action=""
            className="mt-16 flex flex-col gap-4"
            onSubmit={handleSubmit(onsubmit)}
          >
            <Input
              register={register}
              label="name"
              placeholder="Enter a username"
              hidden={false}
            />
            <Input
              register={register}
              label="email"
              placeholder="Enter your email address"
              hidden={false}
            />

            <Input
              register={register}
              label="password"
              placeholder="Enter your password"
              hidden={false}
            />

            <Button>Continue</Button>
          </form>

          <div className="mt-16">
            <span>
              By clicking "Continue", you agree to the Terms of Service and
              Privacy policy.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
