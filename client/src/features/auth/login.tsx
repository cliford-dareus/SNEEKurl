import { SubmitHandler, useForm } from "react-hook-form";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/button";
import { Link } from "react-router-dom";

type Props = {};

export type IUserFormValues = {
  name: string;
  email: string;
  password: string;
};

const Login = (props: Props) => {
  const { register, handleSubmit } = useForm<IUserFormValues>();

  const onsubmit: SubmitHandler<IUserFormValues> = (data) => {
    alert(data);
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
            <h2 className="text-2xl">Login</h2>
            <div className="flex gap-2 items-center">
              <span>or</span>
              <Link className="underline" to="/register">
                create a new account
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

          <div>
            <Button>
              <a href="http://localhost:4080/auth/github">Sign With Github</a>
            </Button>
          </div>

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

export default Login;
