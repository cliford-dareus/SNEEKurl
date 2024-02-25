import React from "react";
import Label from "../../components/ui/label";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/button";
import { SubmitHandler, useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { createQr } from "./qrslice";
import { useAppSelector } from "../../app/hook";
import { RootState } from "../../app/store";
import { Select } from "../../components/ui/select";

type Props = {};

export type IQrFormValues = {
  domain: string;
  size: number;
  image: string;
};

const Qrform = (props: Props) => {
  const { register, handleSubmit } = useForm<IQrFormValues>();
  const dispatch = useDispatch();

  const onsubmit: SubmitHandler<IQrFormValues> = (data) => {
    dispatch(
      createQr({ url: data.domain, size: data.size, logoSrc: data.image })
    );
  };

  return (
    <form
      className="mt-4 flex w-full flex-col gap-4"
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
        <Select
          classnames="w-full rounded-full py-1 px-4 text-slate-600"
          {...register("size")}
        >
          <option value="">----Choose a size----</option>
          {[100, 200, 300].map((size) => (
            <option key={size} value={size} className="">
              {size}
            </option>
          ))}
        </Select>
      </div>
      <div className="flex flex-col items-start">
        <Label>Add logo url(Optional)</Label>
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
