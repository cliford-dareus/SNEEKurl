import React from "react";
import Label from "./ui/label";
import Input from "./ui/Input";
import Button from "./ui/button";
import { SubmitHandler, useForm } from "react-hook-form";

type Props = {};

export type IQrFormValues = {
  domain: string;
  size: number;
  image: string;
};

const Qrform = (props: Props) => {
  const { register, handleSubmit } = useForm<IQrFormValues>();

  const onsubmit: SubmitHandler<IQrFormValues> = (data) => {
    alert(JSON.stringify(data));
  };
  
  return (
    <form
      className="w-full flex flex-col mt-4 gap-4"
      onSubmit={handleSubmit(onsubmit)}
    >
      <div className="flex flex-col items-start">
        <Label>Enter your Qr code destination</Label>
        <Input
          register={register}
          label="domain"
          placeholder="Enter long url..."
          hidden={false}
        />
      </div>
      <div className="flex flex-col items-start">
        <Label>Chosse a size</Label>
        <Input
          register={register}
          label="size"
          placeholder="Enter long url..."
          hidden={false}
        />
      </div>
      <div className="flex flex-col items-start">
        <Label>Add logo(Optional)</Label>
        <Input
          register={register}
          label="image"
          placeholder="Enter long url..."
          hidden={false}
        />
      </div>
      <Button>Generate custom short</Button>
    </form>
  );
};

export default Qrform;
