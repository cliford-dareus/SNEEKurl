import { Controller, SubmitHandler, useForm } from "react-hook-form";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { useLoginMutation } from "../../app/services/auth";
import { useAppDispatch } from "../../app/hook";
import { setCredentials } from "./authslice";
import { useEffect } from "react";
import { useAuth } from "../../hooks/useAuth";

export type IUserFormValues = {
  username: string;
  password: string;
};

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { isAuthenticated } = useAuth();
  const [useLogin, { isLoading, isError }] = useLoginMutation();

  const {
    handleSubmit,
    control,
    formState: { errors }
  } = useForm<IUserFormValues>({
    defaultValues: {
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
              fill="currentColor"
            />
          </svg>
        </Link>
      </div>

      <div className="rounded-xl bg-primary-content w-[400px]">
        <div className="rounded-t-xl bg-primary p-4 text-center ">
          <h1 className="text-4xl text-neutral-content">Sneek</h1>
          <p className="mt-2 text-xl text-neutral-content">
            Lorem ipsum dolor sit amet consectetur adipisicing.
          </p>
        </div>

        <div className="mt-4 p-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl text-neutral">Login</h2>
            <div className="flex items-center gap-2 text-neutral">
              <span>or</span>
              <Link className="underline" to="/register">
                create a new account
              </Link>
            </div>
          </div>

          <form
            className="mt-16 flex flex-col gap-4"
            onSubmit={handleSubmit(onsubmit)}
          >
            <Controller
              name="username"
              control={control}
              rules={{
                required: "Username is required",
                minLength: {
                  value: 3,
                  message: "Username must be at least 3 characters"
                }
              }}
              render={({ field, fieldState }) => (
                <Input
                  {...field}
                  placeholder="Enter your username"
                  error={fieldState.error?.message}
                />
              )}
            />

            <Controller
              name="password"
              control={control}
              rules={{
                required: "Password is required",
                minLength: {
                  value: 2,
                  message: "Password must be at least 6 characters"
                }
              }}
              render={({ field, fieldState }) => (
                <Input
                  {...field}
                  type="password"
                  placeholder="Enter your password"
                  error={fieldState.error?.message}
                />
              )}
            />

            <Button
              type="submit"
              classnames="bg-primary"
              disabled={isLoading}
            >
              {isLoading ? "Signing in..." : "Continue"}
            </Button>

            {isError && (
              <p className="text-sm text-destructive text-center">
                Login failed. Please check your credentials.
              </p>
            )}
          </form>

          <div>
            <Button  classnames="bg-primary">Sign With Github</Button>
          </div>

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

export default Login;
