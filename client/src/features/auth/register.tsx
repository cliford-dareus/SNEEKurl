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
    <div className="flex container h-screen p-4 items-center justify-center">
      <div className="fixed top-4 left-4">
        <Link to="/">
          <svg
            width="40"
            height="40"
            viewBox="0 0 200 250"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M0 62.5V200L62.5 250V112.5H137.5V200L200 250V112.5L87.5 0V62.5H0Z"
              fill="currentColor"
            />
          </svg>
        </Link>
      </div>
      <div className="rounded-xl bg-primary-content w-[400px] text-white">
        <div className="rounded-t-xl bg-primary p-4 text-center">
          <h1 className="text-4xl text-neutral-content">Sneek</h1>
          <p className="mt-2 text-xl text-neutral-content">
            Lorem ipsum dolor sit amet consectetur adipisicing.
          </p>
        </div>

        <div className="mt-4 p-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl text-neutral">Register</h2>
            <div className="flex items-center gap-2 text-neutral">
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

            <Button classnames="bg-primary">Continue</Button>
          </form>

          <div className="mt-16 text-neutral">
            <span className="text-sm">
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
