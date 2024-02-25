import Label from "../../components/ui/label";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/button";
import { SubmitHandler, useForm, Controller } from "react-hook-form";

type Props = {
  shortenFn: any;
};

export type IFormValues = {
  long: string;
  "back-half"?: string;
};

const Urlform = ({ shortenFn }: Props) => {
  const { register, handleSubmit, control, watch } = useForm<
    IFormValues | any
  >();

  const onsubmit: SubmitHandler<IFormValues> = async (data) => {
    if (data["back-half"] === "") {
      shortenFn({ longUrl: data["long"] });
      return
    }

    shortenFn({ longUrl: data["long"], backhalf: data["back-half"] });
  };

  const input1Value = watch("long");

  return (
    <>
      <form
        className="mt-4 flex w-full flex-col gap-2"
        onSubmit={handleSubmit(onsubmit)}
      >
        <div className="flex flex-col items-start">
          <Label>Paste long Url</Label>
          <Controller
            name="long"
            control={control}
            render={({ field }) => (
              <input
                className="w-full rounded-full px-4 py-1 text-black"
                {...field}
              />
            )}
          />
        </div>

        <Button>Generate Short</Button>
      </form>

      <div className="mx-auto mt-4 flex aspect-square w-8 items-center justify-center rounded-full bg-white text-black">
        <span>OR</span>
      </div>

      <form
        className="mt-4 flex w-full flex-col gap-2"
        onSubmit={handleSubmit(onsubmit)}
      >
        <Controller
          name="long2"
          control={control}
          render={({ field }) => (
            <input hidden {...field} value={input1Value} />
          )}
        />

        <div className="flex flex-col items-start">
          <Label>Enter a back-half(Optional)</Label>
          <Input
            register={register}
            label="back-half"
            placeholder="Enter long url..."
            hidden={false}
          />
        </div>

        <Button>Generate custom short</Button>
        <span className="">
          Lorem ipsum dolor sit amet consectetur adipisicing.
        </span>
      </form>
    </>
  );
};

export default Urlform;
