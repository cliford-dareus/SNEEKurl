import { useForm } from "react-hook-form";
import Input from "../../components/ui/Input";
import Label from "../../components/ui/label";

type Props = {};

export type IUserFormValues = {
  name: string;
  email: string;
  password: string;
};

const Login = (props: Props) => {
  const { register } = useForm<IUserFormValues>();

  return (
    <div className="w-screen h-screen flex justify-center items-center">
      <div className="w-[700px]">
        <form action="">
          <div>
            <Label>Name</Label>
            <Input
              register={register}
              label="name"
              placeholder="rrrrrrrrrrrrrr"
              hidden={false}
            />
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
