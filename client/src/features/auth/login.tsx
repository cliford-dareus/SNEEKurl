import { SubmitHandler, useForm } from "react-hook-form";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { useLoginMutation } from "../../app/services/auth";
import { useAppDispatch, useAppSelector } from "../../app/hook";
import { AuthState, selectCurrentUser, setCredentials } from "./authslice";
import { useEffect } from "react";
import useLocalStorage from "../../hooks/use-local-storage";
import { useAuth } from "../../hooks/useAuth";

type Props = {};

export type IUserFormValues = {
  username: string;
  email: string;
  password: string;
};

const Login = (props: Props) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { isAuthenticated } = useAuth();
  const [useLogin, { isLoading, isError }] = useLoginMutation();
  const { register, handleSubmit } = useForm<IUserFormValues>({
    defaultValues: {
      email: "",
      username: "",
      password: "",
    },
  });

  const onsubmit: SubmitHandler<IUserFormValues> = async (formData) => {
    try {
      const data = await useLogin({
        username: formData.username,
        password: formData.password,
      }).unwrap();

      // Don't store token in localStorage anymore
      dispatch(
        setCredentials({
          user: {
            username: data.user.username,
            email: data.user.email,
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
    if (isAuthenticated) {
      navigate("/links");
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="flex h-screen w-screen container p-4 items-center justify-center">
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
              fill="black"
            />
          </svg>
        </Link>
      </div>

      <div className="rounded-xl bg-indigo-500 w-[400px] text-white">
        <div className="rounded-t-xl bg-indigo-600 p-4 text-center ">
          <h1 className="text-4xl">Sneek</h1>
          <p className="mt-2 text-xl ">
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
