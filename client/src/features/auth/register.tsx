import { Controller, SubmitHandler, useForm } from "react-hook-form";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/button";
import { Link } from "react-router-dom";
import { useRegisterMutation } from "../../app/services/auth";

export type IUserFormValues = {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
};

const Register = () => {
  const [useRegister, { isLoading, isSuccess, isError }] = useRegisterMutation();

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors }
  } = useForm<IUserFormValues>({
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: ""
    }
  });

  const watchPassword = watch("password");

  const onsubmit: SubmitHandler<IUserFormValues> = async (data) => {
    try {
      await useRegister({
        username: data.username,
        password: data.password,
        email: data.email,
      }).unwrap();
    } catch (error) {
      console.log(error);
    }
  };

  if (isSuccess) {
    return (
      <div className="mt-4 p-4 text-center">
        <h2 className="text-2xl text-success mb-4">Registration Successful!</h2>
        <p className="mb-4">Please check your email to verify your account.</p>
        <Link to="/login" className="text-primary underline">
          Go to Login
        </Link>
      </div>
    );
  }

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
                sign in to existing account
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
                },
                pattern: {
                  value: /^[a-zA-Z0-9_]+$/,
                  message: "Username can only contain letters, numbers, and underscores"
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
              name="email"
              control={control}
              rules={{
                required: "Email is required",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Please enter a valid email address"
                }
              }}
              render={({ field, fieldState }) => (
                <Input
                  {...field}
                  type="email"
                  placeholder="Enter your email"
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
                  value: 8,
                  message: "Password must be at least 8 characters"
                },
                pattern: {
                  value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
                  message: "Password must contain at least one uppercase letter, one lowercase letter, and one number"
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

            <Controller
              name="confirmPassword"
              control={control}
              rules={{
                required: "Please confirm your password",
                validate: (value) =>
                  value === watchPassword || "Passwords do not match"
              }}
              render={({ field, fieldState }) => (
                <Input
                  {...field}
                  type="password"
                  placeholder="Confirm your password"
                  error={fieldState.error?.message}
                />
              )}
            />

            <Button
              type="submit"
              classnames="bg-primary"
              disabled={isLoading}
            >
              {isLoading ? "Creating account..." : "Create Account"}
            </Button>

            {isError && (
              <p className="text-sm text-destructive text-center">
                Registration failed. Please try again.
              </p>
            )}
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
