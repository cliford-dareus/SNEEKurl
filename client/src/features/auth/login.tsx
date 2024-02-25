import { SubmitHandler, useForm } from "react-hook-form";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { useLoginMutation } from "../../app/services/auth";
import { useAppDispatch, useAppSelector } from "../../app/hook";
import { AuthState, selectCurrentUser, setCredentials } from "./authslice";
import { useEffect } from "react";
import useLocalStorage from "../../Utils/hooks/use-local-storage";

type Props = {};

export type IUserFormValues = {
  username: string;
  email: string;
  password: string;
};

const Login = (props: Props) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [Value, setValue] = useLocalStorage("token", '');
  const user = useAppSelector(selectCurrentUser) as AuthState;

  const [useLogin, { isLoading, isError }] = useLoginMutation();
  const { register, handleSubmit } = useForm<IUserFormValues>();

  const onsubmit: SubmitHandler<IUserFormValues> = async (formData) => {
    try {
      const data = await useLogin({
        username: formData.username,
        password: formData.password,
      }).unwrap();

      setValue(JSON.stringify(data.token));

      dispatch(
        setCredentials({
          user: {
            username: data.user.username,
            stripe_account_id: data.user.stripe_account_id,
            isVerified: data.user.isVerified,
          },
        })
      );
      navigate("/links", { replace: true });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (user.token) {
      navigate("/links");
    }
  }, []);

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
            <h2 className="text-2xl">Login</h2>
            <div className="flex items-center gap-2">
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
              label="username"
              placeholder="Enter your username"
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
            <Button>Sign With Github</Button>
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
