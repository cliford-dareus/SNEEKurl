import React from "react";
import Label from "./ui/label";
import Input from "./ui/Input";
import Button from "./ui/button";
import { SubmitHandler, useForm, Controller } from "react-hook-form";

type Props = {};

export type IFormValues = {
  long: string;
  "back-half"?: string;
};

const Urlform = (props: Props) => {
  const { register, handleSubmit, control, watch } = useForm<
    IFormValues | any
  >();

  const onsubmit: SubmitHandler<IFormValues> = (data) => {
    alert(JSON.stringify(data));
    if (data["back-half"]) {
    }
  };

  const input1Value = watch("long1");

  return (
    <>
      <form
        className="w-full flex flex-col mt-4 gap-2"
        onSubmit={handleSubmit(onsubmit)}
      >
        <div className="flex flex-col items-start">
          <Label>Paste long Url</Label>
          <Controller
            name="long1"
            control={control}
            render={({ field }) => (
              <input
                className="w-full rounded-full text-black py-1 px-4"
                {...field}
              />
            )}
          />
        </div>

        <Button>Generate Short</Button>
      </form>

      <div className="mt-4 bg-white rounded-full aspect-square w-8 mx-auto text-black flex justify-center items-center">
        <span>OR</span>
      </div>

      <form
        className="w-full flex flex-col mt-4 gap-2"
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
