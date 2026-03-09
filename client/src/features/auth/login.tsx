import {Controller, SubmitHandler, useForm} from "react-hook-form";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/button";
import {Link, useNavigate} from "react-router-dom";
import {useLoginMutation} from "../../app/services/auth";
import {useAppDispatch} from "../../app/hook";
import {setCredentials} from "./authslice";
import {useEffect} from "react";
import {useAuth} from "../../hooks/useAuth";

export type IUserFormValues = {
    username: string;
    password: string;
};

const Login = () => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const {isAuthenticated} = useAuth();
    const [useLogin, {isLoading, isError}] = useLoginMutation();

    const {
        handleSubmit,
        control,
        formState: {errors}
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
            navigate("/links", {replace: true});
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

            <div
                className="relative glass-morphism w-full max-w-[480px] rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">

                {/* Header Section with AI Tip */}
                <div className="bg-primary p-8 text-white relative">
                    {/*<button*/}
                    {/*    // onClick={onClose}*/}
                    {/*    className="absolute top-4 right-4 p-2 rounded-full hover:bg-white/10 transition-colors"*/}
                    {/*>*/}
                    {/*    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">*/}
                    {/*        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"*/}
                    {/*              d="M6 18L18 6M6 6l12 12"/>*/}
                    {/*    </svg>*/}
                    {/*</button>*/}

                    <h2 className="text-2xl font-bold mb-2">Welcome back</h2>
                    <p className="text-indigo-100 text-sm opacity-90">Sign in to continue your journey.</p>
                </div>

                {/* Form Section */}
                <div className="p-8 bg-white">
                    <form onSubmit={handleSubmit(onsubmit)} className="space-y-5">
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
                            render={({field, fieldState}) => (
                                <Input
                                    type="text"
                                    {...field}
                                    className="text-zinc-800"
                                    placeholder="John Doe"
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
                            render={({field, fieldState}) => (
                                <Input
                                    {...field}
                                    className="text-zinc-800"
                                    type="password"
                                    placeholder="••••••••"
                                />
                            )}
                        />


                        <button
                            type="submit"
                            // disabled={loading}
                            className="w-full bg-slate-900 hover:bg-slate-800 text-white font-semibold py-3 rounded-xl transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed shadow-lg shadow-slate-200"
                        >
                            {isLoading ? (
                                <div className="flex items-center justify-center gap-2">
                                    <div
                                        className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"/>
                                    <span>Processing...</span>
                                </div>
                            ) : (
                                <span>Sign In</span>
                            )}
                        </button>
                    </form>

                    <div className="relative my-8">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t border-slate-100"></span>
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span
                                className="bg-white px-3 text-slate-400 font-medium tracking-wider">Or continue with</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <button
                            className="flex items-center justify-center gap-2 px-4 py-2.5 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors text-sm font-medium text-slate-700">
                            <img src="https://www.gstatic.com/images/branding/product/1x/gsa_512dp.png"
                                 className="w-4 h-4" alt="Google"/>
                            Google
                        </button>
                        <button
                            className="flex items-center justify-center gap-2 px-4 py-2.5 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors text-sm font-medium text-slate-700">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                <path
                                    d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.041-1.416-4.041-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                            </svg>
                            GitHub
                        </button>
                    </div>

                    <p className="mt-8 text-center text-sm text-slate-500">
                        Don't have an account yet?
                        <button
                            onClick={() => {
                            }}
                            className="text-primary font-semibold hover:text-primary-700 transition-colors"
                        >
                            Create Account
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
