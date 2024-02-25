import { SubmitHandler, useForm } from "react-hook-form";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/button";
import { Link } from "react-router-dom";
import { useRegisterMutation } from "../../app/services/auth";

type Props = {};

export type IUserFormValues = {
  username: string;
  email: string;
  password: string;
};

const Register = (props: Props) => {
  const [useRegister, { isLoading, isSuccess }] = useRegisterMutation();
  const { register, handleSubmit } = useForm<IUserFormValues>();

  const onsubmit: SubmitHandler<IUserFormValues> = async (data) => {
    await useRegister({
      username: data.username,
      password: data.password,
      email: data.email,
    });
    
  };

  return (
    <div className="flex h-screen w-screen items-center justify-center">
      <div className="rounded-xl bg-red-500 w-[400px]">
        <div className="rounded-t-xl bg-red-600 p-4 text-center">
          <h1 className="text-4xl">Sneek</h1>
          <p className="mt-2 text-xl">
            Lorem ipsum dolor sit amet consectetur adipisicing.
          </p>
        </div>

        <div className="mt-4 p-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl">Register</h2>
            <div className="flex items-center gap-2">
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
              label="username"
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
